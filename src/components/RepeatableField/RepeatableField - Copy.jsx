import { __ } from "@wordpress/i18n";
import React, { useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import accordionDelete from "../../assets/images/accordion-delete.svg";
import accordionMove from "../../assets/images/accordion-move.svg";
import "./RepeatableField.scss";
const ITEM_TYPE = "REPEATABLE_ITEM";

const RepeatableField = ({ name, options, savedData = [], handleChange }) => {
  const sectionsFirstRender = useRef(true);

  const [sections, setSections] = useState(
    savedData.length > 0
      ? savedData.map((data, index) => ({ id: index + 1, values: data }))
      : [{ id: 1, values: '' }]
  );

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
    setSections([...sections, { id: Date.now(), values: '' }]);
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
    handleChange(name, valuesArray || [])
  }, [sections])
  
  return (
    <DndProvider backend={HTML5Backend}>
      {/* {console.log('component-load:','RepeatableField is rendered')} */}
      <div className="repeatable-field-container">
        <button onClick={addSection} className="add-btn text-purple-40">{options?.addButton || __("Add New Field", "mos-faqs")}</button>
        {sections.map((section, index) => (
          <DraggableAccordionItem
            key={section.id}
            index={index}
            section={section}
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

const DraggableAccordionItem = ({ index, section, moveSection, updateField, removeSection, options }) => {
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
          <input
            type="text"
            value={section?.values || ''}
            onChange={(value) => updateField(section.id, '', value)}
          />
        </div>
        <div className="right-part">
          <span onClick={() => removeSection(section.id)} className="remove-btn"><img src={accordionDelete} alt="" /></span>
          <span className="drag-handle"><img src={accordionMove} alt="" /></span>
        </div>
      </div>
    </div>
  );
};

export default RepeatableField;

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
  

<RepeatableField 
    name='elements.advanced.addresses'
    options={{
        addButton: 'Add New Field',
        titlePrefix: 'Address',
        enabler: true,
    }}
    savedData={savedData} 
    handleChange={handleChange}
/>
*/