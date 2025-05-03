import { __ } from "@wordpress/i18n";
import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";
import React, { useEffect, useRef, useState } from "react";
import "./TagInput.scss";

const TagInput = ({ type = 'tag', initialTags, whitelist=[], name, handleChange }) => {
    const tagifyInputRef = useRef(null);
    const tagifyInstanceRef = useRef(null);
    
    
    // Whitelist with objects
    // const whitelist = type === "country" ? countries : type === "type" ? rolesArray : [];

    // Regex for validating IPv4 address and Email
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Ensure initialTags is always an array
    const formattedInitialTags = Array.isArray(initialTags) ? initialTags.map(item => (item.value && item.code ? { value: item.value, code: item.code }: item)) : [];
    

    const [currentTags, setCurrentTags] = useState(formattedInitialTags);

    useEffect(() => {
        // Initialize Tagify
        tagifyInstanceRef.current = new Tagify(tagifyInputRef.current, {
            whitelist: whitelist.map(item => (item.value && item.code ? { value: item.value, code: item.code }: item)), // Convert whitelist for Tagify
            dropdown: {
                maxItems: whitelist.length,
                enabled: 0,
            },
        });

        // Set initial tags properly
        tagifyInstanceRef.current.addTags(formattedInitialTags);

        // Listen for tag changes
        tagifyInstanceRef.current.on("change", (e) => {
            // console.log("Name:", name, ", Value:", e.detail.value);

            let parsedTags;
            try {
                parsedTags = JSON.parse(e.detail.value); // Convert JSON string to array
            } catch (error) {
                parsedTags = [];
            }

            setCurrentTags(parsedTags);
            handleChange(name, parsedTags); // Pass updated tags to parent
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
    }, [initialTags]);

    useEffect(() => {
        if (tagifyInstanceRef.current) {
            tagifyInstanceRef.current.removeAllTags();
            tagifyInstanceRef.current.addTags(formattedInitialTags);
        }
    }, [initialTags]);

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
            <input 
                type="text" 
                ref={tagifyInputRef} 
                placeholder={`Add ${type}...`}
            />
            {
                whitelist.length ?
                <div className="tagify-button-group mt-2">
                    <button className="tagify-button select-all-buton pl-heading-1 fw-600 text-purple-40" onClick={handleSelectAll}>
                        {__("Select All", "mos-faqs")}
                    </button>
                    <button className="tagify-button remove-all-button pl-heading-1 fw-600 text-extra" onClick={handleRemoveAll}>
                        {__("Remove All", "mos-faqs")}
                    </button>
                </div> : null
            }
        </div>
    );
};

export default TagInput;
