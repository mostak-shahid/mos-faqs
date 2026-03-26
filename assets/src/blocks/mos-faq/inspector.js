import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { Select } from '@douyinfe/semi-ui';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function InspectorControls({ attributes, setAttributes }) {
	const [faqPosts, setFaqPosts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [users, setUsers] = useState([]);
	const [isLoadingPosts, setIsLoadingPosts] = useState(false);
	const [isLoadingCategories, setIsLoadingCategories] = useState(false);
	const [isLoadingUsers, setIsLoadingUsers] = useState(false);

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

	const selectedPosts = attributes.posts
		? attributes.posts.split(',').map((id) => id.trim())
		: [];

	const selectedCategories = attributes.category
		? attributes.category.split(',').map((id) => id.trim())
		: [];

	const selectedAuthors = attributes.author
		? attributes.author.split(',').map((id) => id.trim())
		: [];

	return (
		<>
			<PanelBody title={__('FAQ Settings', 'mos-faqs')} initialOpen={true}>
				<div style={{ marginBottom: '16px' }}>
					<label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
						{__('Source', 'mos-faqs')}
					</label>
					<Select
						value={attributes.source}
						optionList={[
							{ label: __('Recent Posts', 'mos-faqs'), value: 'recent' },
							{ label: __('Selected Posts', 'mos-faqs'), value: 'selected_posts' },
							{ label: __('Selected Categories', 'mos-faqs'), value: 'selected_categories' },
						]}
						onChange={(value) => setAttributes({ source: value })}
						style={{ width: '100%' }}
					/>
				</div>

				{attributes.source === 'selected_posts' && (
					<div style={{ marginBottom: '16px' }}>
						<label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
							{__('Select Posts', 'mos-faqs')}
						</label>
						<Select
							multiple
							placeholder={__('Select posts...', 'mos-faqs')}
							value={selectedPosts}
							optionList={postsOptions}
							onChange={(value) => {
								setAttributes({ posts: value.join(',') });
							}}
							style={{ width: '100%' }}
							loading={isLoadingPosts}
							filter
							// maxTagCount={3}
						/>
					</div>
				)}

				{attributes.source === 'selected_categories' && (
					<div style={{ marginBottom: '16px' }}>
						<label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
							{__('Select Categories', 'mos-faqs')}
						</label>
						<Select
							multiple
							placeholder={__('Select categories...', 'mos-faqs')}
							value={selectedCategories}
							optionList={categoryOptions}
							onChange={(value) => {
								setAttributes({ category: value.join(',') });
							}}
							style={{ width: '100%' }}
							loading={isLoadingCategories}
							filter
							// maxTagCount={3}
						/>
					</div>
				)}

				<TextControl
					label={__('Count', 'mos-faqs')}
					type="number"
					value={attributes.count}
					onChange={(value) => setAttributes({ count: parseInt(value) || -1 })}
					help={__('Number of FAQs to display. Use -1 for all.', 'mos-faqs')}
				/>

				<TextControl
					label={__('Offset', 'mos-faqs')}
					type="number"
					value={attributes.offset}
					onChange={(value) => setAttributes({ offset: parseInt(value) || 0 })}
				/>

				<div style={{ marginBottom: '16px' }}>
					<label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
						{__('Author', 'mos-faqs')}
					</label>
					<Select
						multiple
						placeholder={__('Select authors...', 'mos-faqs')}
						value={selectedAuthors}
						optionList={userOptions}
						onChange={(value) => {
							setAttributes({ author: value.join(',') });
						}}
						style={{ width: '100%' }}
						loading={isLoadingUsers}
						filter
						// maxTagCount={3}
					/>
				</div>

				<div style={{ marginBottom: '16px' }}>
					<label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
						{__('Order By', 'mos-faqs')}
					</label>
					<Select
						value={attributes.orderby}
						optionList={[
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
						]}
						onChange={(value) => setAttributes({ orderby: value })}
						style={{ width: '100%' }}
					/>
				</div>

				<div style={{ marginBottom: '16px' }}>
					<label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
						{__('Order', 'mos-faqs')}
					</label>
					<Select
						value={attributes.order}
						optionList={[
							{ label: __('Default', 'mos-faqs'), value: '' },
							{ label: __('Ascending', 'mos-faqs'), value: 'asc' },
							{ label: __('Descending', 'mos-faqs'), value: 'desc' },
						]}
						onChange={(value) => setAttributes({ order: value })}
						style={{ width: '100%' }}
					/>
				</div>

				<div style={{ marginBottom: '16px' }}>
					<label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
						{__('View', 'mos-faqs')}
					</label>
					<Select
						value={attributes.view}
						optionList={[
							{ label: __('Accordion', 'mos-faqs'), value: 'accordion' },
							{ label: __('Collapsible', 'mos-faqs'), value: 'collapsible' },
							{ label: __('Block', 'mos-faqs'), value: 'block' },
						]}
						onChange={(value) => setAttributes({ view: value })}
						style={{ width: '100%' }}
					/>
				</div>

				<ToggleControl
					label={__('Show Pagination', 'mos-faqs')}
					checked={attributes.pagination}
					onChange={(value) => setAttributes({ pagination: value })}
				/>
			</PanelBody>
		</>
	);
}
