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
