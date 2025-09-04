import { __ } from "@wordpress/i18n";
import React, { useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import accordionArrow from "../../assets/images/accordion-arrow.svg";
import accordionDelete from "../../assets/images/accordion-delete.svg";
import accordionMove from "../../assets/images/accordion-move.svg";
import "./SortableAccordion.scss";
const ITEM_TYPE = "ACCORDION_ITEM";

const SortableAccordion = ({ name, options, fields, savedData = [], handleChange }) => {
  const sectionsFirstRender = useRef(true);

  const [sections, setSections] = useState(
    savedData.length > 0
      ? savedData.map((data, index) => ({ id: index + 1, values: data }))
      : [{ id: 1, values: initializeFields(fields) }]
  );
  

  function initializeFields(fields) {
    return fields.reduce((acc, field) => {
      acc[field.name] = field.type === "checkbox" ? false : "";
      return acc;
    }, {});
  }

  const moveSection = (dragIndex, hoverIndex) => {
    const updatedSections = [...sections];
    const [movedItem] = updatedSections.splice(dragIndex, 1);
    updatedSections.splice(hoverIndex, 0, movedItem);
    setSections(updatedSections);
  };

  const updateField = (sectionId, fieldName, value) => {
    // console.log(sectionId, fieldName, value)
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? { ...section, values: { ...section.values, [fieldName]: value } }
          : section
      )
    );
  };

  const addSection = () => {
    setSections([...sections, { id: Date.now(), values: initializeFields(fields) }]);
  };

  const removeSection = (id) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  useEffect(() => {
    if (sectionsFirstRender.current) {
      sectionsFirstRender.current = false;
      return;
    }
    // Extract the `values` objects from the data
    const valuesArray = sections.map((item) => item.values);

    // console.log('sections', sections)
    // console.log('valuesArray', valuesArray)
    handleChange(name, valuesArray)
  }, [sections])
  
  return (
    <DndProvider backend={HTML5Backend}>
      {/* {console.log('component-load:','SortableAccordion is rendered')} */}
      <div className="accordion-container">
        <button onClick={addSection} className="add-btn text-purple-40">{options?.addButton || __("Add New Field", "mos-faqs")}</button>
        {sections.map((section, index) => (
          <DraggableAccordionItem
            key={section.id}
            index={index}
            section={section}
            fields={fields}
            moveSection={moveSection}
            updateField={updateField}
            removeSection={removeSection}
            options={options}
          />
        ))}
      </div>
    </DndProvider>
  );
};

const DraggableAccordionItem = ({ index, section, fields, moveSection, updateField, removeSection, options }) => {
  const [expanded, setExpanded] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveSection(draggedItem.index, index);
        draggedItem.index = index;
      }
    }
  });

  return (
    <div ref={drop} className="accordion-item" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div ref={drag} className="accordion-header" onClick={() => setExpanded(!expanded)}>
        <div className="left-part">
          {
            options?.enabler &&
            <span 
              className={`eleble ${section.values['enabler'] ? "checked":"un-checked"}`}
              onClick={()=>updateField(section.id, 'enabler', !section.values['enabler'])}
            ></span>
          }
          <span className="open-handle"><img src={accordionArrow} alt="" /></span>
          <span>{section.values['title'] || (options?.titlePrefix || __("Section", "mos-faqs")) + ' ' + (index + 1)} </span>
        </div>
        <div className="right-part">
          <span onClick={() => removeSection(section.id)} className="remove-btn"><img src={accordionDelete} alt="" /></span>
          <span className="drag-handle"><img src={accordionMove} alt="" /></span>
        </div>
      </div>
      {expanded && (
        <div className="accordion-content">
          {
            options?.enabler &&
            <div className="d-none">
              <DynamicField                
                field={{ type: "checkbox", name: "enabler", placeholder: "Enable", className: "checkbox-field", label: "Enable" }}
                value={section.values['enabler'] || ""}
                onChange={(value) => updateField(section.id, 'enabler', value)}
              />
            </div>
          }
          {fields.map((field, index) => (
            <div className="unit-accordion" key={field.name}>
              {
                field.label && <label className="field-label" htmlFor={field.name}>{field.label}</label>
              }
              <DynamicField                
                field={field}
                value={section.values[field.name] || ""}
                onChange={(value) => updateField(section.id, field.name, value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// DynamicField Component (Supports Select, Multi-Select, Checkbox Groups)
const DynamicField = ({ field, value, onChange }) => {
  switch (field.type) {
    case "input":
      return (
        <input
          type="text"
          name={field.name}
          placeholder={field.placeholder}
          className={field.className}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "textarea":
      return (
        <textarea
          name={field.name}
          placeholder={field.placeholder}
          className={field.className}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "checkbox":
      return (
        <label>
          <input
            type="checkbox"
            name={field.name}
            className={field.className}
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
          />
          {field.placeholder}
        </label>
      );
    case "radio":
      return (
        <div className={`checkbox-group-field ${field.className}`}>
          {field.options.map((option) => (
            <label key={option.key}>
              <input
                type="radio"
                name={field.name}
                value={option.key}
                checked={value === option.key}
                onChange={() => onChange(option.key)}
              />
              {option.value}
            </label>
          ))}
        </div>
      );
    case "select":
      return (
        <select
          name={field.name}
          className={field.className}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select</option>
          {field.options.map((option) => (
            <option key={option.key} value={option.key}>
              {option.value}
            </option>
          ))}
        </select>
      );
    case "multi-select":
      return (
        <select
          name={field.name}
          className={field.className}
          multiple
          value={value || []}
          onChange={(e) => onChange([...e.target.selectedOptions].map((o) => o.value))}
        >
          {field.options.map((option) => (
            <option key={option.key} value={option.key}>
              {option.value}
            </option>
          ))}
        </select>
      );
    case "checkbox-group":
      return (
        <div className={`checkbox-group-field ${field.className}`}>
          {field.options.map((option) => (
            <label key={option.key}>
              <input
                type="checkbox"
                name={field.name}
                value={option.key}
                checked={value.includes(option.key)}
                onChange={(e) =>
                  onChange(
                    e.target.checked
                      ? [...value, option.key]
                      : value.filter((v) => v !== option.key)
                  )
                }
              />
              {option.value}
            </label>
          ))}
        </div>
      );
    default:
      return null;
  }
};

export default SortableAccordion;

/*
// Uses
const savedData = [
    {
      "address-1": "123 Main St",
      note: "Leave at door",
      enable: true,
      gender: "male",
      country: "us",
      languages: ["en", "fr"],
      hobbies: ["reading", "sports"],
    },
];
  
const fields = [
    { type: "input", name: "address-1", placeholder: "Address 1", className: "input-field", label: "Address 1" },
    { type: "textarea", name: "note", placeholder: "Note", className: "textarea-field", label: "Note" },
    { type: "checkbox", name: "enable", placeholder: "Enable", className: "checkbox-field", label: "Enable" },
    { type: "radio", name: "gender", className: "radio-field", options: [{ key: "male", value: "Male" }, { key: "female", value: "Female" }] },
    { type: "select", name: "country", className: "select-field", options: [{ key: "us", value: "United States" }, { key: "ca", value: "Canada" }] },
    { type: "multi-select", name: "languages", className: "multi-select-field", options: [{ key: "en", value: "English" }, { key: "fr", value: "French" }] },
    { type: "checkbox-group", name: "hobbies", className: "checkbox-group-field", options: [{ key: "reading", value: "Reading" }, { key: "sports", value: "Sports" }] }
];
<SortableAccordion 
    name='elements.advanced.addresses'
    options={{
        addButton: 'Add New Field',
        titlePrefix: 'Address',
        enabler: true,
    }}
    fields={fields} 
    savedData={savedData} 
    handleChange={handleChange}
/>
*/