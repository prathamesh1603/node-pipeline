import React, { useState, useEffect } from "react";

const SingleLineProperties = ({ field, onPropertiesChange }) => {
  const [fieldLabel, setFieldLabel] = useState(field?.label || "");
  const [charactersAllowed, setCharactersAllowed] = useState(
    field?.charactersAllowed || ""
  );
  const [isRequired, setIsRequired] = useState(field?.isRequired || false);
  const [noDuplicate, setNoDuplicate] = useState(field?.noDuplicate || false);

  // Update local state when the `field` prop changes
  useEffect(() => {
    if (field) {
      setFieldLabel(field?.label || "");
      setCharactersAllowed(field?.charactersAllowed || "");
      setIsRequired(field?.isRequired || false);
      setNoDuplicate(field?.noDuplicate || false);
    }
  }, [field]);

  // Handle "Done" button click
  const handleDone = () => {
    const updatedProperties = {
      ...field,
      label: fieldLabel,
      charactersAllowed,
      isRequired,
      noDuplicate,
    };
    onPropertiesChange(updatedProperties); // Pass updated properties to the parent
  };

  return (
    <>
      {/* Modal for SingleLine Properties */}
      <div
        className="modal fade"
        tabIndex="-1"
        id="singleLineProperties"
        aria-labelledby="singleLinePropertiesModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
          style={{ maxWidth: "400px" }}
        >
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title" id="singleLinePropertiesModalLabel">
                SingleLine Properties
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
                    value={fieldLabel} // Bind the state to input
                    onChange={(e) => setFieldLabel(e.target.value)}
                    required
                  />
                </div>

                {/* Number of Characters Allowed */}
                <div className="mb-3">
                  <label htmlFor="charactersAllowed" className="form-label">
                    Number of Characters Allowed{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="charactersAllowed"
                    value={charactersAllowed} // Bind the state to input
                    onChange={(e) => setCharactersAllowed(e.target.value)}
                    required
                  />
                </div>

                {/* Required Checkbox */}
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isRequired"
                    checked={isRequired} // Bind the state to checkbox
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
                    checked={noDuplicate} // Bind the state to checkbox
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
                data-bs-dismiss="modal"
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

export default SingleLineProperties;
