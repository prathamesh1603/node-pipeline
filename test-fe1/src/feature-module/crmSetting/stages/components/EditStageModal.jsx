import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import stagesApi from "../api/stageApi";
import { EDITED_SUCCESS_MSG } from "../../../../core/data/constants/constant";
import { handleModalAction } from "../../../../utils/helpers/handleModalAction";
import { isSuperAdmin } from "../../../../utils/helpers/helper";

const EditStageModal = ({ stageData, selectedCompany, user }) => {
  const queryClient = useQueryClient();

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Stage Name is required"),
  });

  const mutationEditStage = useMutation({
    mutationFn: (updatedStageData) => {
      const requestData = {
        id: updatedStageData.id,
        name: updatedStageData.name,
        ofCompany: isSuperAdmin(user) ? selectedCompany : user?.ofCompany?._id,
        module: updatedStageData.module,
      };
      return stagesApi.updateStage(requestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("stages");
      toast.success(EDITED_SUCCESS_MSG);
      handleModalAction("edit_stage", "hide");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to update stage.");
    },
  });

  const formik = useFormik({
    initialValues: {
      name: stageData?.name || "",
      color: stageData?.color || "",
      id: stageData?.id || "",
      module: stageData?.module || "",
    },
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (
        values.name === stageData?.name &&
        values.color === stageData?.color &&
        values.module === stageData?.module
      ) {
        toast.warn("No changes detected.");
        return;
      }

      mutationEditStage.mutate(values);
    },
  });

  return (
    <div className="modal fade" id="edit_stage" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Stage</h5>
            <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="modal-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3 position-relative">
                <label className="col-form-label">
                  Stage Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className={`form-control ${
                      formik.errors.name && formik.touched.name
                        ? "is-invalid"
                        : ""
                    }`}
                  />

                  <div className="input-group-text">
                    <i className="ti ti-pencil" />
                  </div>
                </div>
                {formik.errors.name && formik.touched.name && (
                  <div className="text-danger small mt-1">
                    {formik.errors.name}
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={mutationEditStage?.isPending}
                >
                  {mutationEditStage?.isPending ? "Saving" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStageModal;
