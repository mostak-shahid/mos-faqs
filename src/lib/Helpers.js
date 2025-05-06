import axios from "axios";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// Helper function to set nested values dynamically
export const setNestedValue = (obj, path, value) => {
    const keys = path.split(".");
    const newObj = JSON.parse(JSON.stringify(obj)); // Deep copy to avoid state mutation
    let current = newObj;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        if (!current[key] || typeof current[key] !== "object") {
            current[key] = {};
        }

        current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    
    // console.log("Updated Options:", newObj);
    return newObj; // Return full new object
};
const convertToPathArray = (path) => {
    // Step 1: Split by dots (.)
    let parts = path.split(".");

    // Step 2: Find "php" in the array and modify the previous element
    let phpIndex = parts.indexOf("php");
    if (phpIndex > 0) {
        parts[phpIndex - 1] += ".php"; // Append ".php" to the previous element
        parts.splice(phpIndex, 1); // Remove the "php" element
    }
    return parts;
}

// Function to ajax post data
export const formDataPost = async (action, data = {})=> {
    try {
        const formData = new FormData();
        // Append the action
        formData.append('action', action);
        // Append the security nonce
        const _admin_nonce = mos_faqs_ajax_obj?._admin_nonce || '';
        formData.append('_admin_nonce', _admin_nonce);
        // Make the fetch request

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        // Make the POST request
        const response = await axios.post(
            mos_faqs_ajax_obj.ajax_url,
            formData
        );
        // if(action == "usfw_download_users_csv"){
        //     return response.text();
        // }
        // Check if request was successful
        if (response.data.success) {
            // return true;
            return response.data; 
        } else {
            throw new Error(response.data.data.error_message || 'Reset failed');
        }
    } catch (error) {
        console.error('API Service Error:', error);
        throw error;
    }
}
export const urlToArr = () => {
    const location = useLocation();
    const [activePath, setActivePath] = useState('');
    const [activePathArr, setActivePathArr] = useState('');
    useEffect(() => {
        // Get the path from the location
        let path = location.pathname;
        
        // If using HashRouter, the path is in location.hash (remove the leading #)
        if (location.hash) {
            path = location.hash.substring(1);
        }
        
        // Remove leading slash if present
        if (path.startsWith('/')) {
            path = path.substring(1);
        }
        setActivePath(path);
        setActivePathArr(path.split("/"));

        // Convert slashes to dots
        // const dotPath = path.replace(/\//g, '.');
        
        // Handle empty path (home page)
        // const formattedPath = dotPath || 'home';
        
        // setActivePath(formattedPath);
    }, [location]);
    return activePathArr;
}
