import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SingleLineField from "./newFields/SingleLineField";
import NumberField from "./newFields/NumberField";
import PickListField from "./newFields/PickListField";
import {
  updateField,
  updateGroupName,
} from "../../../../core/data/redux/fieldSlice";

const FieldGroupSections = () => {
  const dispatch = useDispatch();
  const fields = useSelector((state) => state.field.fields);
  const [activeField, setActiveField] = useState(null);

  // Handle field changes
  const handleFieldChange = (fieldGroupId, fieldId, updatedProperties) => {
    dispatch(updateField({ fieldGroupId, fieldId, updatedProperties }));
  };

  // Handle group name changes
  const handleGroupNameChange = (fieldGroupId, newName) => {
    dispatch(updateGroupName({ fieldGroupId, newName }));
  };

  return (
    <>
      {fields?.map((fieldGroup) => {
        if (!fieldGroup?.isCustomGroup) {
          return (
            <div
              className="mb-4 border border-1 p-3 section-container"
              key={fieldGroup?._id}
            >
              {/* Section Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm shadow-none text-capitalize border-0 fw-bold fs-6 px-0"
                  value={fieldGroup?.groupName || "Module Fields"}
                  onChange={(e) =>
                    handleGroupNameChange(fieldGroup._id, e.target.value)
                  }
                />
              </div>

              {/* Section Body */}
              <div className="row">
                {fieldGroup?.groupFields?.map((field) => (
                  <div
                    className={`col-md-${
                      field?.column === 1 ? "6" : "12"
                    } mb-3`}
                    key={field?._id}
                  >
                    {field?.type === "text" && (
                      <SingleLineField
                        field={field}
                        onChange={(updatedProperties) =>
                          handleFieldChange(
                            fieldGroup._id,
                            field._id,
                            updatedProperties
                          )
                        }
                        setActiveField={setActiveField}
                        activeField={activeField}
                      />
                    )}
                    {field?.type === "number" && (
                      <NumberField field={field} onChange={() => {}} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }
      })}
    </>
  );
};

export default FieldGroupSections;
