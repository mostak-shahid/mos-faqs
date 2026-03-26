import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { icon, blockIcon } from '@wordpress/icons';
import Edit from './edit';
import Save from './save';
import { blockAttributes } from './attributes';

registerBlockType('mos-faqs/mos-faq', {
	title: __('Mos FAQs', 'mos-faqs'),
	description: __('Display FAQs with various options and styles.', 'mos-faqs'),
	icon: 'editor-help',
	category: 'widgets',
	keywords: [__('faq', 'mos-faqs'), __('questions', 'mos-faqs'), __('help', 'mos-faqs')],
	attributes: blockAttributes,
	edit: Edit,
	save: Save,
	supports: {
		html: false,
		className: true,
		anchor: true,
	},
});
