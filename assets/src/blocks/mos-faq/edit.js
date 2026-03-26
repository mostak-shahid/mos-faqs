import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { ServerSideRender } from '@wordpress/editor';
import { PanelBody } from '@wordpress/components';
import Inspector from './inspector';

export default function Edit({ attributes, setAttributes, className }) {
	return (
		<>
			<InspectorControls>
				<Inspector attributes={attributes} setAttributes={setAttributes} />
			</InspectorControls>

			<div className={className}>
				<ServerSideRender
					block="mos-faqs/mos-faq"
					attributes={attributes}
				/>
			</div>
		</>
	);
}
