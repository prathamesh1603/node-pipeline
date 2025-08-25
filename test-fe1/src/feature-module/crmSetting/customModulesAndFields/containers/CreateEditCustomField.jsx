import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import { all_routes } from "../../../router/all_routes";
import { useNavigate, useSearchParams } from "react-router-dom";
import useModuleData from "../hooks/useModuleData";
import { Button, message } from "antd";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import SelectNewField from "../../../../core/common/crmComponents/SelectNewField";
import FieldGroupSections from "../components/FieldGroupSections";
import { useDispatch, useSelector } from "react-redux";
import {
  setFields,
  updateField,
  resetFields,
} from "../../../../core/data/redux/fieldSlice";
import useUpdateModule from "../hooks/useUpdateModule";

const CreateEditCustomField = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const route = all_routes;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const dispatch = useDispatch();
  const { fields, hasChanges } = useSelector((state) => state.field);

  const { data, isLoading } = useModuleData(id);

  const updateModule = useUpdateModule((status) => {
    if (!status) {
      dispatch({ type: "field/resetHasChanges" });
    }
  });

  useEffect(() => {
    if (id && data?.moduleName) {
      dispatch(setFields(data?.fields)); // Initialize fields when data is fetched
    }
  }, [id, data, dispatch]);

  const handleFieldSelect = (fieldType) => {
    const newField = {
      _id: Date.now().toString(), // Temporary unique ID
      name: `New ${fieldType} Field`,
      type: fieldType,
    };
    dispatch(
      updateField({
        fieldGroupId: "defaultGroupId",
        fieldId: newField._id,
        updatedProperties: newField,
      })
    );
  };

  const handleCancel = () => {
    if (hasChanges) {
      setIsModalVisible(true); // Show the modal
    } else {
      dispatch(resetFields()); // Reset Redux state
      navigate(-1); // Navigate back if no changes
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Close the modal
  };

  const handleConfirmLeave = () => {
    dispatch(resetFields()); // Reset Redux state on confirm leave
    setIsModalVisible(false); // Close the modal
    navigate(-1); // Navigate back
  };

  const handleSave = () => {
    updateModule.mutate({ id, updatedData: { fields } });
  };

  const handleSaveAndClose = () => {
    updateModule.mutate(
      { id, updatedData: { fields } },
      {
        onSuccess: () => {
          dispatch(resetFields()); // Reset Redux state after successful save
          navigate(-1);
        },
      }
    );
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <PageHeader pageName={data?.moduleName || "Module"}>
              <button
                className="p-2 btn btn-outline-none"
                onClick={() => navigate(route.settings)}
              >
                <IoIosArrowRoundBack className="d-inline" size={20} />
              </button>
            </PageHeader>
            {isLoading ? (
              <LoaderComponent />
            ) : (
              <div className="card">
                <div className="card-header">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    <SelectNewField onFieldSelect={handleFieldSelect} />
                    <div className="d-flex gap-3 text-sm-end">
                      <Button onClick={handleCancel}>Cancel</Button>
                      <Button
                        disabled={!hasChanges}
                        onClick={handleSaveAndClose}
                      >
                        Save and Close
                      </Button>
                      <Button
                        disabled={!hasChanges}
                        type="primary"
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="card-body p-3">
                  <FieldGroupSections />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bootstrap Modal */}
      {isModalVisible && (
        <div
          className={`modal fade show`}
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">You have not saved your changes</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleModalClose}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to move away from this page?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={handleConfirmLeave}
                  className="btn btn-danger"
                >
                  Yes, Leave Page
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="btn btn-light"
                >
                  Stay Here
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEditCustomField;
