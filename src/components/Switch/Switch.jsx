import React from "react";
import "./Switch.scss";

export default function Switch({ checked, name, onChange }) {
    // Convert numerical string value to boolean (API sends "1"/"0")
    const isChecked = checked === "1" || checked === true || checked === 1;

    return (
        <>
            {/* {console.log('component-load:','Switch is rendered')} */}
            {/* {console.log(checked, name)} */}
            <div className="position-relative mos-faqs-switcher">
                <label>
                    <input
                        data-checked={isChecked}
                        name={name}
                        type="checkbox"
                        checked={isChecked} // Ensure it's a boolean
                        onChange={(e) => {
                            onChange(name, e.target.checked ? "1" : "0"); // Convert back to "1"/"0"
                        }}
                    />
                    <em data-on="Active" data-off="Inactive"></em>
                    <span></span>
                </label>
            </div>        
        </>
    );
}

