import { __ } from "@wordpress/i18n";
import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";
import React, { useEffect, useRef, useState } from "react";
import countries from '../../data/countries.json';
import "./TagInput.scss";
const TagInput = ({type, initialTags, name, onChange }) => {
    const tagifyInputRef = useRef(null);
    const tagifyInstanceRef = useRef(null);

    // Whitelist with objects
    const whitelist = type === 'country' ? countries : [];    

    // Regex for validating IPv4 address and Email
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const [currentTags, setCurrentTags] = useState(initialTags);

    useEffect(() => {
        // Initialize Tagify
        tagifyInstanceRef.current = new Tagify(tagifyInputRef.current, {
            whitelist: whitelist, // Convert objects to strings, enable white list for user list and countries only
            // maxTags: 4,
            dropdown: {
                maxItems: whitelist.length,
                // position: 'input',
                enabled: 0,
            },
        });

        // Set initial tags
        tagifyInstanceRef.current.addTags(initialTags);

        // Listen for tag changes
        tagifyInstanceRef.current.on("change", (e) => {
            const parsedTags = e.detail.value ? JSON.parse(e.detail.value).map(tag => tag.value) : [];
            setCurrentTags(parsedTags);
            onChange(name, e.detail.value);            
        });

        if (type == "ip") {
            tagifyInstanceRef.current.on('add', (e) => {
                const addedTag = e.detail.data;
                // Validate the IP address
                if (!ipRegex.test(addedTag.value)) {
                    tagifyInstanceRef.current.removeTag(addedTag.value); 
                }
            });
        } else if(type == "email"){
            tagifyInstanceRef.current.on('add', (e) => {
                const addedTag = e.detail.data;
                // Validate the email address
                if (!emailRegex.test(addedTag.value)) {
                    tagifyInstanceRef.current.removeTag(addedTag.value); 
                }
            });
        }

        return () => {
            tagifyInstanceRef.current.destroy(); // Cleanup on unmount
        };
    }, []);
    // useEffect(() => {
    //     console.log(currentTags)
    // }, [currentTags]);

    // Handle Select All
    const handleSelectAll = () => {
        tagifyInstanceRef.current.removeAllTags(); // Remove all tags
        tagifyInstanceRef.current.addTags(whitelist.map(item => item.value)); // Add all whitelist items
    };

    // Handle Remove All
    const handleRemoveAll = () => {
        tagifyInstanceRef.current.removeAllTags(); // Remove all tags
        setCurrentTags([]);
    };

    return (
        <div className="tagify-wrapper">
            <input type="text" ref={tagifyInputRef} placeholder="Add tags..." />
            {
                whitelist.length ?
                <div className="tagify-button-group mt-2">
                    <button className="tagify-button select-all-buton" onClick={handleSelectAll}>
                        {__("Select All", "mos-faqs")}
                    </button>
                    <button className="tagify-button remove-all-button" onClick={handleRemoveAll}>
                        {__("Remove All", "mos-faqs")}
                    </button>
                </div> : null
            }
        </div>
    );
};

export default TagInput;
