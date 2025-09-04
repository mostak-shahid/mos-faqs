import { useEffect, useState } from 'react';
import Hint from '../Hint/Hint';
import './Checkbox.scss';

const Checkbox = ({defaultValues, options = [], name = "checkbox-group", type = '', handleChange, hasMedia='0'}) => {
  // Initialize selected values with defaultValues
  const [selectedValues, setSelectedValues] = useState([]);
  useEffect(() => {
    setSelectedValues(defaultValues);
  }, [defaultValues]); // Include all dependencies

  // Handle individual checkbox changes
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    
    // Update the selected values based on checkbox state
    const newSelectedValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter(val => val !== value);
    
    setSelectedValues(newSelectedValues);
    handleChange(name, newSelectedValues);
  };
  
  // Call parent onChange whenever selected values change
  // useEffect(() => {
  //     handleChange(name, selectedValues);
  // }, [selectedValues]); // Include all dependencies

  return (
    <div className={`checkbox-group ${type == 'inline'?"checkbox-group-inline":"checkbox-group-block"} ${hasMedia == '1' ? 'has-media' : ''}`}>

            {options.map((option, index) => (
                <div className={`form-check ${option?.hint?'with-hints':'without-hints' }`} key={index}>
                    <input
                        value={option.value}
                        className="form-check-input"
                        type='checkbox' // Use the `type` prop
                        name={name}
                        id={`${name}-${index}`}
                        checked={selectedValues.includes(option.value)}
                        onChange={handleCheckboxChange}
                        disabled={option?.disabled}
                    />
                    <div className="content">
                        <label className="form-check-label" htmlFor={`${name}-${index}`} dangerouslySetInnerHTML={{ __html: option.label }}/>
                        {
                            option?.hint && 
                            <Hint content={option.hint} />
                        }
                    </div>
                </div>
            ))}


      
    </div>
  );
};

export default Checkbox;