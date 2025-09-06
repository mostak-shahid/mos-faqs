import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
const Border = ({options, defaultValues = {}, name, handleChange}) => {
    // Initialize selected values with defaultValues
    const [values, setValues] = useState(defaultValues);

    const updateValue = (option, value) => {
        const updated = { ...values, [option]: value };
        setValues(updated);
        handleChange(name, updated);
    };
    const selectOptions = {
        "style": ["solid", "dotted", "dashed", "double", "groove", "ridge", "inset", "outset", "none", "hidden"],
    };
    return (
        <>
            <div className="border-wrapper">
                {options.map((option) => (
                    <div key={option} className={`mb-2 from-group from-group-${option}`}>
                        <label className="form-label text-capitalize">{option}</label>
                        {/* color → color picker */}
                        {
                            option === "color" ? (
                                <input
                                    type="color"
                                    value={values[option] || "#000000"}
                                    onChange={(e) => updateValue(option, e.target.value)}
                                    className="form-control form-control-color"
                                />
                            ) : option === "width" || option === "radius" ? 
                            (
                                <div class="input-group">
                                    <span className="input-group-text"><span className="dashicons dashicons-move"></span></span>
                                    <input 
                                        type="number" 
                                        className="form-control"
                                        value={values[option] || ""}
                                        min="0"
                                        onChange={(e) => updateValue(option, e.target.value)}
                                    />
                                    <span className="input-group-text">px</span>
                                </div>
                            ) : (option === "style") ? 
                            (
                                <select
                                    value={values[option] || ""}
                                    onChange={(e) => updateValue(option, e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">Select {option}</option>
                                    {selectOptions[option]?.map((val) => (
                                        <option key={val} value={val}>
                                            {val}
                                        </option> 
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={values[option] || ""}
                                    onChange={(e) => updateValue(option, e.target.value)}
                                    className="form-control"
                                />
                            )
                        }
                    </div>
                ))}
            </div>
        </>
    );
}
export default Border;