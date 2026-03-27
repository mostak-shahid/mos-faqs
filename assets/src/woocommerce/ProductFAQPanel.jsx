import { __ } from '@wordpress/i18n';
import { TextControl, ToggleControl, SelectControl } from '@wordpress/components';
import { Select } from '@douyinfe/semi-ui';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function ProductFAQPanel() {
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

	useEffect(() => {
		if (typeof mosFaqProductData !== 'undefined') {
			setAttributes(mosFaqProductData);
		}
	}, []);

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

	return (
		<div className="mos-faq-woocommerce-panel">
			<div className="setting-unit">
				<ToggleControl
					label={__('Enable FAQs', 'mos-faqs')}
					checked={attributes.enabled}
					onChange={(value) => setAttributes({ ...attributes, enabled: value })}
				/>
			</div>

			{attributes.enabled && (
				<>
					<div className="setting-unit">
						<SelectControl
							label={__('Source', 'mos-faqs')}
							value={attributes.source}
							options={sourceOptions}
							onChange={(value) => setAttributes({ ...attributes, source: value })}
						/>
					</div>

					{attributes.source === 'selected_posts' && (
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
							/>
						</div>
					)}

					{attributes.source === 'selected_categories' && (
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
							/>
						</div>
					)}

					<div className="setting-unit">
						<TextControl
							label={__('Count', 'mos-faqs')}
							type="number"
							value={attributes.count}
							onChange={(value) => setAttributes({ ...attributes, count: parseInt(value) || -1 })}
							help={__('Number of FAQs to display. Use -1 for all.', 'mos-faqs')}
						/>
					</div>

					<div className="setting-unit">
						<TextControl
							label={__('Offset', 'mos-faqs')}
							type="number"
							value={attributes.offset}
							onChange={(value) => setAttributes({ ...attributes, offset: parseInt(value) || 0 })}
						/>
					</div>

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
						/>
					</div>

					<div className="setting-unit">
						<SelectControl
							label={__('Order By', 'mos-faqs')}
							value={attributes.orderby}
							options={orderbyOptions}
							onChange={(value) => setAttributes({ ...attributes, orderby: value })}
						/>
					</div>

					<div className="setting-unit">
						<SelectControl
							label={__('Order', 'mos-faqs')}
							value={attributes.order}
							options={orderOptions}
							onChange={(value) => setAttributes({ ...attributes, order: value })}
						/>
					</div>

					<div className="setting-unit">
						<SelectControl
							label={__('View', 'mos-faqs')}
							value={attributes.view}
							options={viewOptions}
							onChange={(value) => setAttributes({ ...attributes, view: value })}
						/>
					</div>

					<div className="setting-unit">
						<ToggleControl
							label={__('Show Pagination', 'mos-faqs')}
							checked={attributes.pagination}
							onChange={(value) => setAttributes({ ...attributes, pagination: value })}
						/>
					</div>
				</>
			)}

			<input type="hidden" name="mos_faq_enabled" value={attributes.enabled ? '1' : '0'} />
			<input type="hidden" name="mos_faq_source" value={attributes.source} />
			<input type="hidden" name="mos_faq_count" value={attributes.count} />
			<input type="hidden" name="mos_faq_offset" value={attributes.offset} />
			<input type="hidden" name="mos_faq_author" value={attributes.author} />
			<input type="hidden" name="mos_faq_posts" value={attributes.posts} />
			<input type="hidden" name="mos_faq_category" value={attributes.category} />
			<input type="hidden" name="mos_faq_orderby" value={attributes.orderby} />
			<input type="hidden" name="mos_faq_order" value={attributes.order} />
			<input type="hidden" name="mos_faq_pagination" value={attributes.pagination ? '1' : '0'} />
			<input type="hidden" name="mos_faq_view" value={attributes.view} />
		</div>
	);
}
