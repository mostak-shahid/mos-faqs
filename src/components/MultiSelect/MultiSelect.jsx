import React, { useEffect, useRef, useState } from 'react';
import './MultiSelect.scss';
const MultiSelect = ({
    options = [],
    defaultValues = [],
    name = "multi-select",
    placeholder = "Select options...",
    handleChange
}) => {
    // Initialize selected values with defaultValues
    const [selectedValues, setSelectedValues] = useState([]);

    useEffect(() => {
        setSelectedValues(defaultValues);
    }, [defaultValues]);

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    // Get selected option objects for display
    const selectedOptions = options.filter(option => 
        selectedValues.includes(option.value)
    );

    // Filter options based on search term
    const filteredOptions = options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle selecting/deselecting an option
    const handleOptionClick = (optionValue) => {
        let newSelectedValues;
        
        if (selectedValues.includes(optionValue)) {
            // Remove the value if already selected
            newSelectedValues = selectedValues.filter(value => value !== optionValue);
        } else {
            // Add the value if not already selected
            newSelectedValues = [...selectedValues, optionValue];
        }
        
        setSelectedValues(newSelectedValues);
        handleChange(name, newSelectedValues);
    };

    // Handle removing a selected option
    const handleRemoveOption = (optionValue, e) => {
        e.stopPropagation();
        const newSelectedValues = selectedValues.filter(value => value !== optionValue);
        setSelectedValues(newSelectedValues);
        handleChange(name, newSelectedValues);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    

    return (
        <div className="multi-select-container" ref={dropdownRef}>
        <div 
            className={`multi-select-input ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
        >
            {selectedOptions.length > 0 ? (
            <div className="selected-options">
                {selectedOptions.map(option => (
                <span className="selected-option-badge" key={option.value}>
                    {option.label}
                    <button 
                    className="remove-option"
                    onClick={(e) => handleRemoveOption(option.value, e)}
                    >
                    ×
                    </button>
                </span>
                ))}
            </div>
            ) : (
            <div className="placeholder">{placeholder}</div>
            )}
            <div className="dropdown-arrow">▼</div>
        </div>

        {isOpen && (
            <div className="options-dropdown">
                <div className="search-container">
                    <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="search-input"
                    />
                </div>
                <div className="options-list">
                    {filteredOptions.length > 0 ? (
                    filteredOptions.map(option => (
                        <div
                        key={option.value}
                        className={`option ${selectedValues.includes(option.value) ? 'selected' : ''}`}
                        onClick={() => handleOptionClick(option.value)}
                        >
                        <div className="option-content">
                            <input
                            type="checkbox"
                            id={`${name}-${option.value}`}
                            checked={selectedValues.includes(option.value)}
                            onChange={() => handleOptionClick(option.value)}
                            onClick={(e) => e.stopPropagation()}
                            />
                            <label 
                            htmlFor={`${name}-${option.value}`}
                            onClick={(e) => {
                                e.preventDefault(); // Prevent default label behavior
                                handleOptionClick(option.value);
                            }}
                            >
                            {option.label}
                            </label>
                        </div>
                        </div>
                    ))
                    ) : (
                    <div className="no-options">No options found</div>
                    )}
                </div>
            </div>
        )}
        </div>
    );
};

export default MultiSelect;