import { __ } from '@wordpress/i18n';
import {useState} from 'react';
import {ColorPickerControl, UnitControl} from '../../components';
import { Switch, Space, Typography } from '@douyinfe/semi-ui';
const units = [
    { value: 'px', label: 'px' },
    // { value: '%', label: '%' },
    // { value: 'em', label: 'em' },
    // { value: 'rem', label: 'rem' },
    // { value: 'vw', label: 'vw' },
];
const BoxShadowControl = ({ value = {}, onChange, className='' }) => {
    const [shadow, setShadow] = useState(value);

    const update = (key, val) => {
        const newShadow = { ...shadow, [key]: val };
        setShadow(newShadow);
        onChange(newShadow);
    };

    return (
        <div className={`box-shadow-wrapper ${className}`}>
            <Space align='center'>
                <Switch 
                    aria-label={__('Enable Box Shadow', 'mos-faqs')}
                    checked={!!shadow.enabled}
                    onChange={(enabled) => update('enabled', enabled)}
                />
                <Typography.Title heading={6} style={{ margin: 8 }}>
                    {shadow.enabled ? __('Enabled', 'mos-faqs') : __('Disabled', 'mos-faqs')}
                </Typography.Title>
            </Space>
            {shadow.enabled && (
                <Space vertical align='start' className='w-full'>
                    <UnitControl
                        label={__('Horizontal Offset (px)', 'mos-faqs')}
                        onChange={(x) => update('x', x)}
                        value={shadow.x}
                        units={units}
                        className="w-full"
                    />
                    <UnitControl
                        label={__('Vertical Offset (px)', 'mos-faqs')}
                        onChange={(y) => update('y', y)}
                        value={shadow.y}
                        units={units}
                        className="w-full"
                    />
                    <UnitControl
                        label={__('Blur (px)', 'mos-faqs')}
                        onChange={(blur) => update('blur', blur)}
                        value={shadow.blur}
                        units={units}
                        className="w-full"
                    />
                    <UnitControl
                        label={__('Spread (px)', 'mos-faqs')}
                        onChange={(spread) => update('spread', spread)}
                        value={shadow.spread}
                        units={units}
                        className="w-full"
                    />
                    <ColorPickerControl
                        defaultValue={shadow.color || "#000000"}
                        handleChange={(color) => update('color', color)}
                        mode='color'
                        label={__('Shadow Color', 'mos-faqs')}
                        className="w-full"
                    /> 
                    <div>
                        <label className='font-semibold block mb-1'><Typography.Text>{__('Inset', 'mos-faqs')}</Typography.Text></label>
                        <Switch 
                            aria-label={__('Inset', 'mos-faqs')}
                            checked={!!shadow.inset}
                            onChange={(enabled) => update('inset', enabled)}
                        />
                    </div>
                </Space>
            )}
        </div>
    );
};

export default BoxShadowControl;
// Usage Example

// <BoxShadowControl
//     value={attributes.boxShadow}
//     onChange={(boxShadow) => setAttributes({ boxShadow })}
// />