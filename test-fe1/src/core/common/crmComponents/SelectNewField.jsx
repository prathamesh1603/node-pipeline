import React, { useState } from "react";

const SelectNewField = ({ onFieldSelect }) => {
  const fieldOptions = ["Single Line", "Number", "Pick List", "New Section"];
  const [selectedField, setSelectedField] = useState("");

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue !== "") {
      onFieldSelect(selectedValue);
      setSelectedField("");
    } else {
      setSelectedField(selectedValue);
    }
  };

  return (
    <div className="">
      <select
        id="fieldSelect"
        className="form-select"
        value={selectedField}
        onChange={(e) => {
          setSelectedField(e.target.value);
          handleSelectChange(e);
        }}
      >
        <option value="" disabled>
          New Fields
        </option>
        {fieldOptions.map((field, index) => (
          <option key={index} value={field}>
            {field}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectNewField;
