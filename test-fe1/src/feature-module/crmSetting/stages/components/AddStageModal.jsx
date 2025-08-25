import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import stagesApi from "../api/stageApi";
import {
  CREATED_SUCCESS_MSG,
  REQUIRED_FIELD,
} from "../../../../core/data/constants/constant";
import { handleModalAction } from "../../../../utils/helpers/handleModalAction";
import { isSuperAdmin } from "../../../../utils/helpers/helper";
import { MODULES } from "../../../../core/data/constants/moduleConstants";

const AddStageModal = ({ selectedCompany, user }) => {
  const queryClient = useQueryClient();

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(REQUIRED_FIELD),
    color: Yup.string()
      .matches(/^#[0-9A-F]{6}$/i, "Invalid color code")
      .required(REQUIRED_FIELD),
    module: Yup.string().required(REQUIRED_FIELD),
  });

  const mutationAddStage = useMutation({
    mutationFn: (stageData) => {
      const requestData = {
        name: stageData.name,
        color: stageData.color,
        module: stageData.module,
        ...(isSuperAdmin(user)
          ? { ofCompany: selectedCompany }
          : { ofCompany: user?.ofCompany?._id }),
      };
      return stagesApi.addStage(requestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("stages");
      formik.resetForm();
      toast.success(CREATED_SUCCESS_MSG);
      handleModalAction("add_stage", "hide");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to add stage.");
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      color: "",
      module: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      mutationAddStage.mutate(values);
    },
  });

  return (
    <div className="modal fade" id="add_stage" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Stage</h5>
            <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="modal-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <label className="col-form-label">
                  Stage Name <span className="text-danger">*</span>
                </label>
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
                {formik.errors.name && formik.touched.name && (
                  <div className="text-danger small mt-1">
                    {formik.errors.name}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="col-form-label">
                  Select Module <span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      type="radio"
                      name="module"
                      value={MODULES.LEADS}
                      checked={formik.values.module.includes(MODULES.LEADS)}
                      onChange={formik.handleChange}
                      className="form-check-input"
                      id="leadsModule"
                    />
                    <label
                      className="form-check-label text-capitalize"
                      htmlFor="leadsModule"
                    >
                      {MODULES.LEADS}
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="module"
                      value={MODULES.DEALS}
                      checked={formik.values.module.includes(MODULES.DEALS)}
                      onChange={formik.handleChange}
                      className="form-check-input"
                      id="dealsModule"
                    />
                    <label
                      className="form-check-label text-capitalize"
                      htmlFor="dealsModule"
                    >
                      {MODULES.DEALS}
                    </label>
                  </div>
                </div>

                {formik.errors.module && formik.touched.module && (
                  <div className="text-danger small mt-1">
                    {formik.errors.module}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="col-form-label">
                  Color <span className="text-danger">*</span>
                </label>
                <input
                  type="color"
                  name="color"
                  value={formik.values.color}
                  onChange={formik.handleChange}
                  className={`form-control form-control-color ${
                    formik.errors.color && formik.touched.color
                      ? "is-invalid"
                      : ""
                  }`}
                />
                {formik.errors.color && formik.touched.color && (
                  <div className="text-danger small mt-1">
                    {formik.errors.color}
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
                  disabled={mutationAddStage.isPending}
                >
                  {mutationAddStage.isPending ? "Creating" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStageModal;
