import React, { useState } from "react";
import { SlOptions } from "react-icons/sl";
import { Link } from "react-router-dom";
import SingleLineProperties from "../fieldPropertiesModals/SingleLineProperties";

const NumberField = ({ field, onChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!field?.label);

  const handleInputChange = (e) => {
    setHasValue(!!e.target.value); // Check if input has value
    onChange(e); // Propagate the change event
  };

  return (
    <>
      <div
        className={`border rounded p-2 ${
          isHovered || (isFocused && hasValue) ? "hovered-or-focused" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor:
            isHovered || (isFocused && hasValue) ? "#e9f5ff" : "transparent", // Light primary color
          borderColor: isFocused && hasValue ? "#0d6efd" : "#ddd", // Primary border color
          transition: "background-color 0.3s, border-color 0.3s", // Smooth transition
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="col-auto">
            <input
              type="number"
              value={field?.label}
              className="form-control form-control-sm shadow-none"
              placeholder="Enter number"
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{
                backgroundColor: isFocused && hasValue ? "#fff" : "transparent", // White background when focused and has value
                borderColor: isFocused && hasValue ? "#0d6efd" : "transparent", // Primary border color
                transition: "background-color 0.3s, border-color 0.3s", // Smooth transition
              }}
            />
          </div>
          <span className="text-muted">Number</span>
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
              <button className="dropdown-item text-capitalize">
                Mark as required
              </button>
              <button className="dropdown-item text-capitalize">
                Set permission
              </button>
              <button
                className="dropdown-item text-capitalize"
                data-bs-toggle="modal"
                data-bs-target="#singleLineProperties"
              >
                Edit properties
              </button>
              <button className="dropdown-item text-capitalize text-danger">
                Remove field
              </button>
            </div>
          </div>
        </div>
      </div>
      <SingleLineProperties />
    </>
  );
};

export default NumberField;
