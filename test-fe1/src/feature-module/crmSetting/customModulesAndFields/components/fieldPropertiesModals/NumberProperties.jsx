import React, { useState } from "react";

const NumberProperties = () => {
  const [fieldLabel, setFieldLabel] = useState("");
  const [numbersAllowed, setNumbersAllowed] = useState(""); // Tracks selected number
  const [isRequired, setIsRequired] = useState(false);
  const [noDuplicate, setNoDuplicate] = useState(false);

  const handleDone = () => {
    // Add logic to handle "Done" button click
    console.log("Field Label:", fieldLabel);
    console.log("Characters Allowed:", numbersAllowed);
    console.log("Is Required:", isRequired);
    console.log("No Duplicate:", noDuplicate);

    // Reset form fields
    setFieldLabel("");
    setNumbersAllowed("");
    setIsRequired(false);
    setNoDuplicate(false);
  };

  return (
    <>
      {/* Modal for SingleLine Properties */}
      <div
        className={`modal fade`}
        tabIndex="-1"
        id="NumberProperties"
        aria-labelledby="NumberPropertiesModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
          style={{ maxWidth: "400px" }}
        >
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title" id="NumberPropertiesModalLabel">
                Number Properties
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <form>
                {/* Field Label */}
                <div className="mb-3">
                  <label htmlFor="fieldLabel" className="form-label">
                    Field Label <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fieldLabel"
                    value={fieldLabel}
                    onChange={(e) => setFieldLabel(e.target.value)}
                    required
                  />
                </div>

                {/* Maximum digits allowed (Dropdown) */}
                <div className="mb-3">
                  <label htmlFor="numbersAllowed" className="form-label">
                    Maximum digits allowed
                  </label>
                  <select
                    className="form-control"
                    id="numbersAllowed"
                    value={numbersAllowed}
                    onChange={(e) => setNumbersAllowed(e.target.value)}
                  >
                    <option value="">Select</option>
                    {[...Array(9).keys()].map((i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} digit{i + 1 > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Required Checkbox */}
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isRequired"
                    checked={isRequired}
                    onChange={(e) => setIsRequired(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="isRequired">
                    Required
                  </label>
                </div>

                {/* Do Not Allow Duplicate Values Checkbox */}
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="noDuplicate"
                    checked={noDuplicate}
                    onChange={(e) => setNoDuplicate(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="noDuplicate">
                    Do not allow duplicate values
                  </label>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-light"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDone}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NumberProperties;
