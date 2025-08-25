import React from "react";

const PickListField = ({ field, onChange }) => {
  return (
    <div className="form-group">
      <label>{field.label || "Pick List"}</label>
      <select className="form-control" onChange={onChange}>
        {field.options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PickListField;
