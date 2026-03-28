import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import { TextControl, ToggleControl, SelectControl } from '@wordpress/components';
import {
    Row,
    Col,
    Skeleton,
    Typography,
    Switch,
    Input,
    Select,
    InputNumber,
} from "@douyinfe/semi-ui";

import { SkeletonPlaceholder, MediaUploaderControl } from "../components";

const { Title, Paragraph, Text } = Typography;

const sourceOptions = [
    { label: __('Recent Posts', 'mos-faqs'), value: 'recent' },
    { label: __('Selected Posts', 'mos-faqs'), value: 'selected_posts' },
    { label: __('Selected Categories', 'mos-faqs'), value: 'selected_categories' },
];

const orderbyOptions = [
    { label: __('None', 'mos-faqs'), value: 'none' },
    { label: __('ID', 'mos-faqs'), value: 'ID' },
    { label: __('Author', 'mos-faqs'), value: 'author' },
    { label: __('Title', 'mos-faqs'), value: 'title' },
    { label: __('Name', 'mos-faqs'), value: 'name' },
    { label: __('Type', 'mos-faqs'), value: 'type' },
    { label: __('Date', 'mos-faqs'), value: 'date' },
    { label: __('Modified', 'mos-faqs'), value: 'modified' },
    { label: __('Parent', 'mos-faqs'), value: 'parent' },
    { label: __('Random', 'mos-faqs'), value: 'rand' },
    { label: __('Comment Count', 'mos-faqs'), value: 'comment_count' },
];

const orderOptions = [
    { label: __('Default', 'mos-faqs'), value: '' },
    { label: __('Ascending', 'mos-faqs'), value: 'asc' },
    { label: __('Descending', 'mos-faqs'), value: 'desc' },
];

const viewOptions = [
    { label: __('Accordion', 'mos-faqs'), value: 'accordion' },
    { label: __('Collapsible', 'mos-faqs'), value: 'collapsible' },
    { label: __('Block', 'mos-faqs'), value: 'block' },
];

const ProductApp = () => {
    const [faqPosts, setFaqPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    const [attributes, setAttributes] = useState({
        count: -1,
        offset: 0,
        author: '1',
        source: 'recent',
        posts: '',
        category: '',
        orderby: '',
        order: '',
        pagination: false,
        view: 'accordion',
        enabled: false,
    });

    const selectedPosts = attributes.posts ? attributes.posts.split(',').map((id) => id.trim()) : [];
    const selectedCategories = attributes.category ? attributes.category.split(',').map((id) => id.trim()) : [];
    const selectedAuthors = attributes.author ? attributes.author.split(',').map((id) => id.trim()) : [];

    const updateAttributes = (newAttributes) => {
        setAttributes(newAttributes);
    };

    const updateHiddenFields = (data) => {
        const fields = [
            'enabled', 'count', 'offset', 'author', 'source',
            'posts', 'category', 'orderby', 'order', 'pagination', 'view'
        ];
        fields.forEach((field) => {
            const element = document.getElementById(`mos_faq_${field}`);
            if (element) {
                if (typeof data[field] === 'boolean') {
                    element.value = data[field] ? '1' : '0';
                } else {
                    element.value = data[field] || '';
                }
            }
        });
    };

    useEffect(() => {
        if (typeof mosFaqProductData !== 'undefined') {
            setAttributes(mosFaqProductData);
            updateHiddenFields(mosFaqProductData);
        }
    }, []);

    useEffect(() => {
        if (typeof mosFaqProductId !== 'undefined' && mosFaqProductId) {
            const saveSettings = async () => {
                try {
                    updateHiddenFields(attributes);
                    await apiFetch({
                        path: `/mos-faqs/v1/product-faq/${mosFaqProductId}`,
                        method: 'POST',
                        data: attributes,
                    });
                } catch (error) {
                    console.error('Error saving FAQ settings:', error);
                }
            };

            const timer = setTimeout(() => {
                saveSettings();
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [attributes]);

    useEffect(() => {
        setIsLoadingPosts(true);
        apiFetch({ path: '/wp/v2/qa?per_page=100&_fields=id,title' })
            .then((data) => {
                setFaqPosts(data);
                setIsLoadingPosts(false);
            })
            .catch(() => setIsLoadingPosts(false));
    }, []);

    useEffect(() => {
        setIsLoadingCategories(true);
        apiFetch({ path: '/wp/v2/faq-category?per_page=100&_fields=id,name' })
            .then((data) => {
                setCategories(data);
                setIsLoadingCategories(false);
            })
            .catch(() => setIsLoadingCategories(false));
    }, []);

    useEffect(() => {
        setIsLoadingUsers(true);
        apiFetch({ path: '/wp/v2/users?per_page=100&_fields=id,name' })
            .then((data) => {
                setUsers(data);
                setIsLoadingUsers(false);
            })
            .catch(() => setIsLoadingUsers(false));
    }, []);

    const postsOptions = faqPosts.map((post) => ({
        value: post.id.toString(),
        label: post.title.rendered.replace(/<\/?[^>]+(>|$)/g, ''),
    }));

    const categoryOptions = categories.map((cat) => ({
        value: cat.id.toString(),
        label: cat.name,
    }));

    const userOptions = users.map((user) => ({
        value: user.id.toString(),
        label: `${user.name} (${user.id})`,
    }));

    return (
        <div className="px-4">
            {console.log(attributes)}
            <div className="setting-unit py-4">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton
                            placeholder={<SkeletonPlaceholder />}
                            loading={isLoadingPosts}
                            active
                        >
                            <Title heading={4}>
                                {__(
                                    "Enable FAQs",
                                    "mos-faqs"
                                )}
                            </Title>
                            <Text className="p-0">
                                {__(
                                    "Enable or disable FAQs for this product. When enabled, FAQs will be displayed on the product page based on the selected source and other settings.",
                                    "mos-faqs"
                                )}
                            </Text>
                        </Skeleton>
                    </Col>

                    <Col xs={24} lg={12} xl={10}>
                        <Switch
                            loading={isLoadingPosts}
                            checked={attributes.enabled}
					        onChange={(value) => setAttributes({ ...attributes, enabled: value })}
                        />
                    </Col>
                </Row>
            </div>
            <div className="setting-unit py-4">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton
                            placeholder={<SkeletonPlaceholder />}
                            loading={isLoadingPosts}
                            active
                        >
                            <Title heading={4}>
                                {__(
                                    "Source",
                                    "mos-faqs"
                                )}
                            </Title>
                            <Text className="p-0">
                                {__(
                                    "Select the source for the FAQs to be displayed on the product page.",
                                    "mos-faqs"
                                )}
                            </Text>
                        </Skeleton>
                    </Col>

                    <Col xs={24} lg={12} xl={10}>
                        <Select
							value={attributes.source}
							optionList={sourceOptions}
							onChange={(value) => setAttributes({ ...attributes, source: value })}
                            className="w-full"
						/>
                    </Col>
                </Row>
            </div>

            {attributes.source === 'selected_posts' && (
                <div className="setting-unit py-4">
                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={12} xl={14}>
                            <Skeleton
                                placeholder={<SkeletonPlaceholder />}
                                loading={isLoadingPosts}
                                active
                            >
                                <Title heading={4}>
                                    {__(
                                        "Select posts",
                                        "mos-faqs"
                                    )}
                                </Title>
                                <Text className="p-0">
                                    {__(
                                        "Select the posts to be displayed as FAQs on the product page.",
                                        "mos-faqs"
                                    )}
                                </Text>
                            </Skeleton>
                        </Col>

                        <Col xs={24} lg={12} xl={10}>
                            <div className="setting-unit">
                                <Select
                                    multiple
                                    placeholder={__('Select posts...', 'mos-faqs')}
                                    value={selectedPosts}
                                    optionList={postsOptions}
                                    onChange={(value) => {
                                        setAttributes({ ...attributes, posts: value.join(',') });
                                    }}
                                    style={{ width: '100%' }}
                                    loading={isLoadingPosts}
                                    filter
                                    searchPosition='dropdown'
                                    className="w-full"
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
			)}

            {attributes.source === 'selected_categories' && (
                <div className="setting-unit py-4">
                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={12} xl={14}>
                            <Skeleton
                                placeholder={<SkeletonPlaceholder />}
                                loading={isLoadingCategories}
                                active
                            >
                                <Title heading={4}>
                                    {__(
                                        "Select categories",
                                        "mos-faqs"
                                    )}
                                </Title>
                                <Text className="p-0">
                                    {__(
                                        "Select the categories to be displayed as FAQs on the product page.",
                                        "mos-faqs"
                                    )}
                                </Text>
                            </Skeleton>
                        </Col>

                        <Col xs={24} lg={12} xl={10}>
                            <div className="setting-unit">
                                <Select
                                    multiple
                                    placeholder={__('Select categories...', 'mos-faqs')}
                                    value={selectedCategories}
                                    optionList={categoryOptions}
                                    onChange={(value) => {
                                        setAttributes({ ...attributes, category: value.join(',') });
                                    }}
                                    style={{ width: '100%' }}
                                    loading={isLoadingCategories}
                                    filter
                                    searchPosition='dropdown'
                                    className="w-full"
                                />
                            </div>
                        </Col>
                    </Row>
                </div>  
			)}

            <div className="setting-unit py-4">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton
                            placeholder={<SkeletonPlaceholder />}
                            loading={isLoadingPosts}
                            active
                        >
                            <Title heading={4}>
                                {__(
                                    "Count",
                                    "mos-faqs"
                                )}
                            </Title>
                            <Text className="p-0">
                                {__(
                                    "Select the number of FAQs to display on the product page.",
                                    "mos-faqs"
                                )}
                            </Text>
                        </Skeleton>
                    </Col>

                    <Col xs={24} lg={12} xl={10}>
                        <div className="setting-unit">
                            <InputNumber
                                value={attributes.count}
                                onChange={(value) => setAttributes({ ...attributes, count: parseInt(value) })}
                                min='-1'
                                className="w-full"
                            />
                            <br />
                            <Text type="quaternary">{__('Number of FAQs to display. Use -1 for all.', 'mos-faqs')}</Text>
                        </div>
                    </Col>
                </Row>
            </div> 

            <div className="setting-unit py-4">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton
                            placeholder={<SkeletonPlaceholder />}
                            loading={isLoadingPosts}
                            active
                        >
                            <Title heading={4}>
                                {__(
                                    "Offset",
                                    "mos-faqs"
                                )}
                            </Title>
                            <Text className="p-0">
                                {__(
                                    "Select the number of FAQs to skip before starting to display on the product page.",
                                    "mos-faqs"
                                )}
                            </Text>
                        </Skeleton>
                    </Col>
                    <Col xs={24} lg={12} xl={10}>
                        <div className="setting-unit">
                            <InputNumber
                                value={attributes.offset}
                                onChange={(value) => setAttributes({ ...attributes, offset: parseInt(value) || 0 })}
                                min='0'
                                className="w-full"
                            />
                            <br />
                            <Text type="quaternary">{__('Number of FAQs to skip before displaying.', 'mos-faqs')}</Text>
                        </div>
                    </Col>
                </Row>
            </div>  

            <div className="setting-unit py-4">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton
                            placeholder={<SkeletonPlaceholder />}
                            loading={isLoadingUsers}
                            active
                        >
                            <Title heading={4}>
                                {__(
                                    "Select authors",
                                    "mos-faqs"
                                )}
                            </Title>
                            <Text className="p-0">
                                {__(
                                    "Select the authors to filter FAQs displayed on the product page.",
                                    "mos-faqs"
                                )}
                            </Text>
                        </Skeleton>
                    </Col>
                    <Col xs={24} lg={12} xl={10}>
                        <div className="setting-unit">
                            <Select
                                multiple
                                placeholder={__('Select authors...', 'mos-faqs')}
                                value={selectedAuthors}
                                optionList={userOptions}
                                onChange={(value) => {
                                    setAttributes({ ...attributes, author: value.join(',') });
                                }}
                                style={{ width: '100%' }}
                                loading={isLoadingUsers}
                                filter
                                searchPosition='dropdown'
                                className="w-full"
                            />
                        </div>
                    </Col>
                </Row>
            </div> 

            <div className="setting-unit py-4">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton
                            placeholder={<SkeletonPlaceholder />}
                            loading={isLoadingUsers}
                            active
                        >
                            <Title heading={4}>
                                {__(
                                    "Order By",
                                    "mos-faqs"
                                )}
                            </Title>
                            <Text className="p-0">
                                {__(
                                    "Select the order for displaying FAQs.",
                                    "mos-faqs"
                                )}
                            </Text>
                        </Skeleton>
                    </Col>
                    <Col xs={24} lg={12} xl={10}>
                        <div className="setting-unit">
                            <Select
                                value={attributes.orderby||'ID'}
                                optionList={orderbyOptions}
                                onChange={(value) => setAttributes({ ...attributes, orderby: value })}
                                filter
                                className="w-full"
                            />
                        </div>
                    </Col>
                </Row>
            </div> 

            <div className="setting-unit py-4">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton
                            placeholder={<SkeletonPlaceholder />}
                            loading={isLoadingUsers}
                            active
                        >
                            <Title heading={4}>
                                {__(
                                    "Order",
                                    "mos-faqs"
                                )}
                            </Title>
                            <Text className="p-0">
                                {__(
                                    "Select the sorting order for FAQs displayed on the product page.",
                                    "mos-faqs"
                                )}
                            </Text>
                        </Skeleton>
                    </Col>
                    <Col xs={24} lg={12} xl={10}>
                        <div className="setting-unit">
                            <Select
                                value={attributes.order||'DESC'}
                                optionList={orderOptions}
                                onChange={(value) => setAttributes({ ...attributes, order: value })}
                                filter
                                className="w-full"
                            />
                        </div>
                    </Col>
                </Row>
            </div> 

            <div className="setting-unit py-4">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton
                            placeholder={<SkeletonPlaceholder />}
                            loading={isLoadingUsers}
                            active
                        >
                            <Title heading={4}>
                                {__(
                                    "View",
                                    "mos-faqs"
                                )}
                            </Title>
                            <Text className="p-0">
                                {__(
                                    "Select the view for FAQs displayed on the product page.",
                                    "mos-faqs"
                                )}
                            </Text>
                        </Skeleton>
                    </Col>
                    <Col xs={24} lg={12} xl={10}>
                        <div className="setting-unit">
                            <Select
                                value={attributes.view || 'accordion'}
                                optionList={viewOptions}
                                onChange={(value) => setAttributes({ ...attributes, view: value })}
                                filter
                                className="w-full"
                            />
                        </div>
                    </Col>
                </Row>
            </div> 

            <div className="setting-unit py-4">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton
                            placeholder={<SkeletonPlaceholder />}
                            loading={isLoadingUsers}
                            active
                        >
                            <Title heading={4}>
                                {__(
                                    "Show Pagination",
                                    "mos-faqs"
                                )}
                            </Title>
                            <Text className="p-0">
                                {__(
                                    "Toggle to show or hide pagination for FAQs displayed on the product page.",
                                    "mos-faqs"
                                )}
                            </Text>
                        </Skeleton>
                    </Col>
                    <Col xs={24} lg={12} xl={10}>
                        <div className="setting-unit">
                            <Switch
                                loading={isLoadingPosts}
                                checked={attributes.pagination}
                                onChange={(value) => setAttributes({ ...attributes, pagination: value })}
                            />
                        </div>
                    </Col>
                </Row>
            </div> 
        </div>
    );
};

export default ProductApp;