import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { Select } from '@douyinfe/semi-ui';
import { useState, useEffect, useCallback } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const debounce = (func, delay) => {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
};

export default function InspectorControls({ attributes, setAttributes }) {
	const [faqPosts, setFaqPosts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [users, setUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchCategory, setSearchCategory] = useState('');
	const [searchUser, setSearchUser] = useState('');
	const [loadingPosts, setLoadingPosts] = useState(false);
	const [loadingCategories, setLoadingCategories] = useState(false);
	const [loadingUsers, setLoadingUsers] = useState(false);

	const loadInitialPosts = async () => {
		setLoadingPosts(true);
		try {
			const data = await apiFetch({
				path: `/mos-faqs/v1/search-posts?page=1&per_page=10`,
			});
			setFaqPosts(data.posts || []);
		} catch (error) {
			console.error('Error loading initial posts:', error);
			setFaqPosts([]);
		} finally {
			setLoadingPosts(false);
		}
	};

	const loadInitialCategories = async () => {
		setLoadingCategories(true);
		try {
			const data = await apiFetch({
				path: `/mos-faqs/v1/search-categories?page=1&per_page=10`,
			});
			setCategories(data.categories || []);
		} catch (error) {
			console.error('Error loading initial categories:', error);
			setCategories([]);
		} finally {
			setLoadingCategories(false);
		}
	};

	const loadInitialUsers = async () => {
		setLoadingUsers(true);
		try {
			const data = await apiFetch({
				path: `/mos-faqs/v1/search-users?page=1&per_page=10`,
			});
			setUsers(data.users || []);
		} catch (error) {
			console.error('Error loading initial users:', error);
			setUsers([]);
		} finally {
			setLoadingUsers(false);
		}
	};

	useEffect(() => {
		loadInitialPosts();
		loadInitialCategories();
		loadInitialUsers();
	}, []);

	const handleSearchPosts = useCallback(debounce(async (value) => {
		setSearchTerm(value);
		if (!value) {
			loadInitialPosts();
			return;
		}

		if (value.length < 2) {
			return;
		}

		setLoadingPosts(true);
		try {
			const data = await apiFetch({
				path: `/mos-faqs/v1/search-posts?search=${encodeURIComponent(value)}&page=1`,
			});
			setFaqPosts(data.posts || []);
		} catch (error) {
			console.error('Error searching posts:', error);
			setFaqPosts([]);
		} finally {
			setLoadingPosts(false);
		}
	}, 500), []);

	const handleSearchCategories = useCallback(debounce(async (value) => {
		setSearchCategory(value);
		if (!value) {
			loadInitialCategories();
			return;
		}

		if (value.length < 2) {
			return;
		}

		setLoadingCategories(true);
		try {
			const data = await apiFetch({
				path: `/mos-faqs/v1/search-categories?search=${encodeURIComponent(value)}&page=1`,
			});
			setCategories(data.categories || []);
		} catch (error) {
			console.error('Error searching categories:', error);
			setCategories([]);
		} finally {
			setLoadingCategories(false);
		}
	}, 500), []);

	const handleSearchUsers = useCallback(debounce(async (value) => {
		setSearchUser(value);
		if (!value) {
			loadInitialUsers();
			return;
		}

		if (value.length < 2) {
			return;
		}

		setLoadingUsers(true);
		try {
			const data = await apiFetch({
				path: `/mos-faqs/v1/search-users?search=${encodeURIComponent(value)}&page=1`,
			});
			setUsers(data.users || []);
		} catch (error) {
			console.error('Error searching users:', error);
			setUsers([]);
		} finally {
			setLoadingUsers(false);
		}
	}, 500), []);

	const handlePostsChange = useCallback((value) => {
		setAttributes({ posts: Array.isArray(value) ? value.map(v => v.value || v).join(',') : '' });
	}, []);

	const handleCategoriesChange = useCallback((value) => {
		setAttributes({ category: Array.isArray(value) ? value.map(v => v.value || v).join(',') : '' });
	}, []);

	const handleUsersChange = useCallback((value) => {
		setAttributes({ author: Array.isArray(value) ? value.map(v => v.value || v).join(',') : '' });
	}, []);

	const postsOptions = faqPosts.map((post) => ({
		value: post.id.toString(),
		label: post.title,
	}));

	const categoryOptions = categories.map((cat) => ({
		value: cat.id.toString(),
		label: cat.name,
	}));

	const userOptions = users.map((user) => ({
		value: user.id.toString(),
		label: `${user.name} (${user.id})`,
	}));

	const getSelectedPostsObjects = () => {
		if (!attributes.posts) return [];
		const ids = attributes.posts.split(',').map(id => id.trim()).filter(id => id);
		return ids.map(id => {
			const option = postsOptions.find(opt => opt.value === id);
			return option || { value: id, label: id };
		});
	};

	const getSelectedCategoriesObjects = () => {
		if (!attributes.category) return [];
		const ids = attributes.category.split(',').map(id => id.trim()).filter(id => id);
		return ids.map(id => {
			const option = categoryOptions.find(opt => opt.value === id);
			return option || { value: id, label: id };
		});
	};

	const getSelectedUsersObjects = () => {
		if (!attributes.author) return [];
		const ids = attributes.author.split(',').map(id => id.trim()).filter(id => id);
		return ids.map(id => {
			const option = userOptions.find(opt => opt.value === id);
			return option || { value: id, label: id };
		});
	};

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
							remote
							onChangeWithObject
							placeholder={__('Search and select posts...', 'mos-faqs')}
							value={getSelectedPostsObjects()}
							optionList={postsOptions}
							onChange={handlePostsChange}
							onSearch={handleSearchPosts}
							style={{ width: '100%' }}
							loading={loadingPosts}
							filter
							searchPosition='dropdown'
							emptyContent={null}
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
							remote
							onChangeWithObject
							placeholder={__('Search and select categories...', 'mos-faqs')}
							value={getSelectedCategoriesObjects()}
							optionList={categoryOptions}
							onChange={handleCategoriesChange}
							onSearch={handleSearchCategories}
							style={{ width: '100%' }}
							loading={loadingCategories}
							filter
							searchPosition='dropdown'
							emptyContent={null}
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
						remote
						onChangeWithObject
						placeholder={__('Search and select authors...', 'mos-faqs')}
						value={getSelectedUsersObjects()}
						optionList={userOptions}
						onChange={handleUsersChange}
						onSearch={handleSearchUsers}
						style={{ width: '100%' }}
						loading={loadingUsers}
						filter
						searchPosition='dropdown'
						emptyContent={null}
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
