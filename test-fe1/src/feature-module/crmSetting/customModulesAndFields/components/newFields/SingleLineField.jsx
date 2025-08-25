import React, { useState } from "react";
import { SlOptions } from "react-icons/sl";
import SingleLineProperties from "../fieldPropertiesModals/SingleLineProperties";

const SingleLineField = ({ field, onChange, setActiveField, activeField }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [properties, setProperties] = useState(field);

  // Handle input change for the field label
  const handleInputChange = (e) => {
    const updatedProperties = { ...properties, label: e.target.value };
    setProperties(updatedProperties);
    onChange(updatedProperties); // Pass updated properties to the parent
  };

  // Handle changes from the properties modal
  const handlePropertiesChange = (updatedProperties) => {
    setProperties(updatedProperties);
    onChange(updatedProperties); // Pass updated properties to the parent
  };

  const handleEditProperties = () => {
    setActiveField(properties); // Set the active field when clicking on 'Edit properties'
  };

  return (
    <>
      <div
        className={`border rounded p-2 ${
          isHovered || (isFocused && properties?.label)
            ? "hovered-or-focused"
            : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor:
            isHovered || (isFocused && properties?.label)
              ? "#e9f5ff"
              : "transparent",
          borderColor: isFocused && properties?.label ? "#0d6efd" : "#ddd",
          transition: "background-color 0.3s, border-color 0.3s",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="col-auto">
            <input
              type="text"
              value={properties?.label}
              className="form-control form-control-sm shadow-none"
              placeholder="Enter text"
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{
                backgroundColor:
                  isFocused && properties?.label ? "#fff" : "transparent",
                borderColor:
                  isFocused && properties?.label ? "#0d6efd" : "transparent",
                transition: "background-color 0.3s, border-color 0.3s",
              }}
            />
          </div>
          <span className="text-muted">Single Line</span>
          <div className="dropdown table-action">
            <button
              className="action-icon border-0 bg-transparent px-3 shadow-none"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <i className="fa fa-ellipsis-h fs-5" />
            </button>
            <div className="dropdown-menu dropdown-menu-right">
              <button
                className="dropdown-item text-capitalize"
                onClick={handleEditProperties} // When clicked, set the active field
                data-bs-toggle="modal"
                data-bs-target="#singleLineProperties"
              >
                Edit properties
              </button>
              <button className="dropdown-item text-capitalize">
                Set permission
              </button>
              <button className="dropdown-item text-capitalize text-danger">
                Remove field
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Modal */}
      <SingleLineProperties
        field={activeField} // Pass the correct field to the modal
        onPropertiesChange={handlePropertiesChange}
      />
    </>
  );
};

export default SingleLineField;
