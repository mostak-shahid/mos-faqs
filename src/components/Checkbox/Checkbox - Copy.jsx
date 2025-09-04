import React, { useEffect, useState } from 'react';
import './Checkbox.scss';

export default function Checkbox({ defaultValues = [], options = [], name, type = '', handleChange }) {

  const [selectedOptions, setSelectedOptions] = useState([]);  

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    
    setSelectedOptions(prevSelected =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter(option => option !== value)
    );
  };

  useEffect(() => {
    handleChange(name, selectedOptions);
  }, [selectedOptions]); // Include all dependencies

  return (
    <div className={`checkbox-group ${type === 'inline' ? "checkbox-group-inline" : "checkbox-group-block"}`}>
      {options.map((option, index) => (
        <div className="form-check" key={option.value}>
          <input
            id={`${name}-${index}`}
            type="checkbox"
            value={option.value}
            checked={selectedOptions.includes(option.value)}
            onChange={handleCheckboxChange}
            className="form-check-input"
            name={name}
          />
          <label className="form-check-label" htmlFor={`${name}-${index}`}>
            {option.label}
          </label>
        </div>
      ))}
      <p>Selected Options: {selectedOptions.join(', ')}</p>
      <p>default Options: {defaultValues.join(', ')}</p>
    </div>
  );
}

/*
import React, { useState } from 'react';
import { cn } from "@/lib/utils"; // Tailwind class merging utility

// Basic Checkbox Group
const BasicCheckboxGroup = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    
    setSelectedOptions(prevSelected => 
      checked 
        ? [...prevSelected, value]
        : prevSelected.filter(option => option !== value)
    );
  };

  const options = [
    { value: 'reading', label: 'Reading' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'sports', label: 'Sports' },
    { value: 'music', label: 'Music' }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Basic Checkbox Group</h2>
      <div className="space-y-2">
        {options.map((option) => (
          <label 
            key={option.value} 
            className="inline-flex items-center"
          >
            <input
              type="checkbox"
              value={option.value}
              checked={selectedOptions.includes(option.value)}
              onChange={handleCheckboxChange}
              className="form-checkbox"
            />
            <span className="ml-2">{option.label}</span>
          </label>
        ))}
      </div>
      <p>Selected Options: {selectedOptions.join(', ')}</p>
    </div>
  );
};

// Advanced Styled Checkbox Group
const StyledCheckboxGroup = () => {
  const [selectedSkills, setSelectedSkills] = useState([]);

  const skillOptions = [
    { 
      value: 'javascript', 
      label: 'JavaScript', 
      icon: '💻',
      color: 'yellow'
    },
    { 
      value: 'python', 
      label: 'Python', 
      icon: '🐍',
      color: 'blue'
    },
    { 
      value: 'rust', 
      label: 'Rust', 
      icon: '🦀',
      color: 'orange'
    },
    { 
      value: 'typescript', 
      label: 'TypeScript', 
      icon: '🔷',
      color: 'indigo'
    }
  ];

  const handleSkillChange = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Skills Checkbox Group</h2>
      <div className="grid grid-cols-2 gap-4">
        {skillOptions.map((skill) => (
          <div 
            key={skill.value}
            className={cn(
              "border rounded-lg p-3 flex items-center cursor-pointer transition-all",
              selectedSkills.includes(skill.value)
                ? `border-${skill.color}-500 bg-${skill.color}-50 ring-2 ring-${skill.color}-300`
                : "border-gray-200 hover:bg-gray-100"
            )}
            onClick={() => handleSkillChange(skill.value)}
          >
            <input
              type="checkbox"
              checked={selectedSkills.includes(skill.value)}
              onChange={() => handleSkillChange(skill.value)}
              className="form-checkbox mr-3"
            />
            <div className="flex items-center">
              <span className="text-2xl mr-3">{skill.icon}</span>
              <span>{skill.label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <strong>Selected Skills:</strong>
        <ul className="list-disc list-inside">
          {selectedSkills.map(skill => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Controlled Checkbox Group with Select All
const ControlledCheckboxGroup = () => {
  const [selectedFruits, setSelectedFruits] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  const fruitOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' }
  ];

  const handleSelectAll = () => {
    setIsSelectAll(!isSelectAll);
    setSelectedFruits(isSelectAll ? [] : fruitOptions.map(fruit => fruit.value));
  };

  const handleFruitChange = (fruit) => {
    setSelectedFruits(prev => 
      prev.includes(fruit)
        ? prev.filter(f => f !== fruit)
        : [...prev, fruit]
    );

    // Update select all state based on individual selections
    setIsSelectAll(
      selectedFruits.length + 1 === fruitOptions.length
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Fruits Checkbox Group</h2>
      <label className="inline-flex items-center font-medium">
        <input
          type="checkbox"
          checked={isSelectAll}
          onChange={handleSelectAll}
          className="form-checkbox"
        />
        <span className="ml-2">Select All</span>
      </label>
      <div className="space-y-2">
        {fruitOptions.map((fruit) => (
          <label 
            key={fruit.value} 
            className="block"
          >
            <input
              type="checkbox"
              value={fruit.value}
              checked={selectedFruits.includes(fruit.value)}
              onChange={() => handleFruitChange(fruit.value)}
              className="form-checkbox mr-2"
            />
            {fruit.label}
          </label>
        ))}
      </div>
      <div className="mt-4">
        <strong>Selected Fruits:</strong>
        <p>{selectedFruits.length === 0 ? 'None' : selectedFruits.join(', ')}</p>
      </div>
    </div>
  );
};

// Combine all checkbox group examples
const CheckboxGroupShowcase = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <BasicCheckboxGroup />
      <StyledCheckboxGroup />
      <ControlledCheckboxGroup />
    </div>
  );
};

export default CheckboxGroupShowcase;
*/