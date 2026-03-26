export const blockAttributes = {
	count: {
		type: 'number',
		default: -1,
	},
	offset: {
		type: 'number',
		default: 0,
	},
	author: {
		type: 'string',
		default: '1',
	},
	source: {
		type: 'string',
		default: 'recent',
	},
	posts: {
		type: 'string',
		default: '',
	},
	category: {
		type: 'string',
		default: '',
	},
	orderby: {
		type: 'string',
		default: '',
	},
	order: {
		type: 'string',
		default: '',
	},
	pagination: {
		type: 'boolean',
		default: false,
	},
	view: {
		type: 'string',
		default: 'accordion',
	},
};
