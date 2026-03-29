import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { ColorPickerControl, UnitControl } from '../../components';
import { Select, Space, Typography } from '@douyinfe/semi-ui';

const units = [
    { value: 'px', label: 'px' },
    { value: '%', label: '%' },
    { value: 'em', label: 'em' },
    { value: 'rem', label: 'rem' },
];

const borderStyles = [
    { value: 'none', label: 'None' },
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' },
    { value: 'double', label: 'Double' },
    { value: 'groove', label: 'Groove' },
    { value: 'ridge', label: 'Ridge' },
    { value: 'inset', label: 'Inset' },
    { value: 'outset', label: 'Outset' },
];

const BorderControl = ({ value = {}, onChange, className = '' }) => {
    const [border, setBorder] = useState(value);

    const update = (key, val) => {
        const newBorder = { ...border, [key]: val };
        setBorder(newBorder);
        onChange(newBorder);
    };

    return (
        <div className={`border-control-wrapper ${className}`}>
            <Space vertical align="start" className="w-full">
                <ColorPickerControl
                    defaultValue={border.color || '#000000'}
                    onChange={(color) => update('color', color)}
                    mode="color"
                    label={__('Border Color', 'mos-faqs')}
                    className="w-full"
                />
                <UnitControl
                    label={__('Border Width', 'mos-faqs')}
                    onChange={(width) => update('width', width)}
                    value={border.width}
                    units={units}
                    className="w-full"
                />
                <div className="w-full">
                    <label className="font-semibold block mb-1">
                        <Typography.Text>
                            {__('Border Style', 'mos-faqs')}
                        </Typography.Text>
                    </label>
                    <Select
                        value={border.style || 'solid'}
                        onChange={(style) => update('style', style)}
                        className="w-full"
                    >
                        {borderStyles.map((style) => (
                            <Select.Option key={style.value} value={style.value}>
                                {style.label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <UnitControl
                    label={__('Border Radius', 'mos-faqs')}
                    onChange={(radius) => update('radius', radius)}
                    value={border.radius}
                    units={units}
                    className="w-full"
                />
            </Space>
        </div>
    );
};

export default BorderControl;

// Usage Example
// <BorderControl
//     value={attributes.border}
//     onChange={(border) => setAttributes({ border })}
// />
