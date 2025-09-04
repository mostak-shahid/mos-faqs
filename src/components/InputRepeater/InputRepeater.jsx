import React, { useEffect, useState } from 'react';

const InputRepeater = ({ defaultValue = [], inputType = 'text', name }) => {
    const [items, setItems] = useState([]);

    // Initialize with default values
    useEffect(() => {
        if (defaultValue && defaultValue.length > 0) {
            setItems(defaultValue.map((value, index) => ({ 
                id: `item-${index}`, 
                value 
            })));
        }
    }, [defaultValue]);

    const handleChange = (newValues) => {
        setItems(newValues);
        // console.log('Current values:', newValues);
    };
    // Add a new item
    const handleAddItem = () => {
        const newItem = {
            id: `item-${Date.now()}`,
            value: ''
        };
        setItems([...items, newItem]);
        if (handleChange) {
            handleChange([...items, newItem].map(item => item.value));
        }
    };

    // Remove an item
    const handleRemoveItem = (id) => {
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
        if (handleChange) {
            handleChange(updatedItems.map(item => item.value));
        }
    };

    // Handle value change
    const handleValueChange = (id, newValue) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                return { ...item, value: newValue };
            }
            return item;
        });
        setItems(updatedItems);
        if (handleChange) {
            handleChange(updatedItems.map(item => item.value));
        }
    };

    // Move item up
    const moveItemUp = (index) => {
        if (index === 0) return;
        const updatedItems = [...items];
        const temp = updatedItems[index];
        updatedItems[index] = updatedItems[index - 1];
        updatedItems[index - 1] = temp;
        setItems(updatedItems);
        if (handleChange) {
            handleChange(updatedItems.map(item => item.value));
        }
    };

    // Move item down
    const moveItemDown = (index) => {
        if (index === items.length - 1) return;
        const updatedItems = [...items];
        const temp = updatedItems[index];
        updatedItems[index] = updatedItems[index + 1];
        updatedItems[index + 1] = temp;
        setItems(updatedItems);
        if (handleChange) {
            handleChange(updatedItems.map(item => item.value));
        }
    };

    return (
        <div className="p-4 border rounded shadow">
            <div className="mb-4">
                <button 
                onClick={handleAddItem}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                Add More
                </button>
            </div>
            
            {items.length === 0 && (
                <div className="text-gray-500 my-4">No items added yet.</div>
            )}
            
            {items.map((item, index) => (
                <div key={item.id} className="flex items-center mb-2">
                <input
                    type={inputType}
                    value={item.value}
                    onChange={(e) => handleValueChange(item.id, e.target.value)}
                    className="border p-2 rounded flex-grow mr-2"
                />
                <div className="flex space-x-2">
                    <button
                    onClick={() => moveItemUp(index)}
                    disabled={index === 0}
                    className={`py-2 px-3 rounded ${index === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-700 text-white'}`}
                    title="Move Up"
                    >
                    ↑
                    </button>
                    <button
                    onClick={() => moveItemDown(index)}
                    disabled={index === items.length - 1}
                    className={`py-2 px-3 rounded ${index === items.length - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-700 text-white'}`}
                    title="Move Down"
                    >
                    ↓
                    </button>
                    <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded"
                    title="Remove"
                    >
                    ×
                    </button>
                </div>
                </div>
            ))}
        </div>
    );
};

export default InputRepeater;
