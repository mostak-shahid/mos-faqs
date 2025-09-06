import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
import MediaUploader from '../MediaUploader/MediaUploader'
const Background = ({options, defaultValues = {}, name, handleChange}) => {
    // Initialize selected values with defaultValues
    const [values, setValues] = useState(defaultValues);

    const updateValue = (option, value) => {
        const updated = { ...values, [option]: value };
        setValues(updated);
        handleChange(name, updated);
    };

    // Predefined select options for background-related CSS properties
    const selectOptions = {
        position: ["left top", "left center", "left bottom", "center top", "center", "center bottom", "right top", "right center", "right bottom"],
        size: ["auto", "cover", "contain"],
        repeat: ["repeat", "repeat-x", "repeat-y", "no-repeat"],
        origin: ["padding-box", "border-box", "content-box"],
        clip: ["border-box", "padding-box", "content-box", "text"],
        attachment: ["scroll", "fixed", "local"],
    };
    return (
        <>
            <div className="background-wrapper">
                {options.map((option) => (
                    <div key={option} className={`mb-2 from-group from-group-${option}`}>
                        <label className="form-label text-capitalize">{option}</label>
                        {/* color → color picker */}
                        {option === "color" && (
                            <input
                                type="color"
                                value={values[option] || "#ffffff"}
                                onChange={(e) => updateValue(option, e.target.value)}
                                className="form-control form-control-color"
                            />
                        )}

                        {/* image → external component */}
                        {option === "image" &&  (
                            <MediaUploader 
                                data={values?.image? values.image : {id:0, url:''}} 
                                name={`${name}.image`}
                                handleChange={handleChange}
                                options = {{
                                    frame:{
                                        title: __("Select or Upload Image", "mos-faqs"),
                                    },
                                    library: {type: 'image'},
                                    buttons: {
                                        upload: __("Upload Image", "mos-faqs"),
                                        remove: __("Remove", "mos-faqs"),
                                        select: __("Use this image", "mos-faqs")                                            
                                    }
                                }}
                            />
                        )}

                        {/* rest → select dropdown */}
                        {option !== "color" && option !== "image" && (
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
                        )}
                    </div>
                ))}
                {/* {console.log(options)} */}
                {/* {console.log(defaultValues)}  */}
            </div>
        </>
    );    
}
export default Background;