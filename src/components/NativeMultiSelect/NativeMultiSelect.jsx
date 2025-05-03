import React, { useEffect, useState } from 'react';
import './NativeMultiSelect.scss';
const NativeMultiSelect = ({
    options = [],
    defaultValues = [],
    name = "multi-select",
    size = 5, // Number of visible options
    handleChange
}) => {
    // Initialize selected values with defaultValues
    const [selectedValues, setSelectedValues] = useState([]);

    useEffect(() => {
        setSelectedValues(defaultValues);
    }, [defaultValues]);

    // Handle selection changes
    const handleSelectionChange = (event) => {
        // Convert HTMLCollection to array of selected values
        const selectedOptions = Array.from(event.target.selectedOptions);
        const newSelectedValues = selectedOptions.map(option => option.value);
        setSelectedValues(newSelectedValues);
        handleChange(name, newSelectedValues);
    };

    return (
        <div className="native-multi-select">            
            <select
                id={name}
                name={name}
                multiple
                value={selectedValues}
                onChange={handleSelectionChange}
                size={size}
                className="multi-select-field form-select"
            >
                {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
                ))}
            </select>
            
            {/* <div className="select-info">
                <small>Hold Ctrl (or Cmd on Mac) to select multiple options</small>
            </div> */}
            
            {/* <div className="selected-values">
                <p>Selected: {selectedValues.length ? 
                options
                    .filter(option => selectedValues.includes(option.value))
                    .map(option => option.label)
                    .join(', ') : 
                'None'
                }</p>
            </div> */}
        </div>
    );
};

export default NativeMultiSelect;