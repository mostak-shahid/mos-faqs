import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
const Font = ({options, defaultValues = {}, name, handleChange}) => {
    // Initialize selected values with defaultValues
    const [values, setValues] = useState(defaultValues);

    const updateValue = (option, value) => {
        const updated = { ...values, [option]: value };
        setValues(updated);
        handleChange(name, updated);
    };
    // Predefined select options for background-related CSS properties
    const selectOptions = {
        "font-weight": [100,200,300,400,500,600,700,800,900],
        "font-style": ["normal", "italic", "oblique"],
        "font-variant": ["normal", "small-caps"],
        "font-stretch": ["normal", "condensed", "expanded"],
        "text-align": ["left", "right", "center", "justify"],
        "text-decoration": ["none", "underline", "overline", "line-through"],
        "text-transform": ["none", "uppercase", "lowercase", "capitalize"],
    };

    return (
        <>
            <div className="font-wrapper">
                {options.map((option) => (
                    <div key={option} className={`mb-2 from-group from-group-${option}`}>
                        <label className="form-label text-capitalize">{option}</label>
                        {/* font-family → text input */}
                        {
                            option === "color" ? (
                                <input
                                    type="color"
                                    value={values[option] || "#ffffff"}
                                    onChange={(e) => updateValue(option, e.target.value)}
                                    className="form-control form-control-color"
                                />
                            ) : option === "font-size" ? 
                            (
                                <div class="input-group">
                                    <input 
                                        type="number" 
                                        className="form-control"
                                        value={values[option] || ""}
                                        min="0"
                                        onChange={(e) => updateValue(option, e.target.value)}
                                    />
                                    <span className="input-group-text">px</span>
                                </div>
                            ) : (option === "font-weight" || option === "font-style" || option === "font-variant" || option === "font-stretch" || option === "text-align" || option === "text-decoration" || option === "text-transform") ? 
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
                            ) : 
                            (
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
export default Font;
/*
// Uses
<Font 
    data={settingData?.elements?.advanced?.media_uploader} 
    name='elements.advanced.media_uploader' 
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
Core Font Attributes:
font-family: Specifies the typeface to be used. Multiple font names can be provided as a fallback system, e.g., font-family: "Arial", sans-serif;.
font-size: Sets the size of the text. Values can be absolute (e.g., px, pt) or relative (e.g., em, rem, %).
font-weight: Controls the thickness or boldness of the font. Values include keywords like normal, bold, bolder, lighter, or numerical values from 100 to 900.
font-style: Determines the slant of the text, typically normal, italic, or oblique.
font-variant: Specifies whether a text should be displayed in a small-caps font (normal or small-caps). 
line-height: Sets the distance between lines of text.
font-stretch: Allows for the adjustment of the font's width, with values like normal, condensed, expanded, etc.

Additional Font-Related Attributes:
letter-spacing: Adjusts the spacing between characters.
word-spacing: Modifies the spacing between words.
text-align: Controls the horizontal alignment of text within its container (e.g., left, right, center, justify).
text-decoration: Adds decorative lines to text, such as underline, overline, or line-through.
text-transform: Controls the capitalization of text (e.g., uppercase, lowercase, capitalize).
color: Sets the color of the text.

Shorthand Property:
The font shorthand property allows for setting multiple font-related attributes in a single declaration, following a specific order: font-style font-variant font-weight font-stretch font-size/line-height font-family. For example:
//font: italic small-caps bold 16px/1.5 "Times New Roman", serif;
*/