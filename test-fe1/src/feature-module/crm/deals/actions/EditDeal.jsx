import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  EDITED_SUCCESS_MSG,
  ERROR_MSG,
  REQUIRED_FIELD,
} from "../../../../core/data/constants/constant";
import { useStages } from "../../../crmSetting/stages/hooks/useStages";
import { all_routes } from "../../../router/all_routes";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import { MODULES } from "../../../../core/data/constants/moduleConstants";
import { useDealData } from "../hooks/useDealData";
import DealApi from "../api/DealApi";
import { Deal } from "../models/DealModel";

const EditDeal = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { id: dealId } = useParams();
  const { dealData, isLoading } = useDealData(dealId);

  const { stagesData } = useStages({
    ofCompany: dealData?.ofCompany?._id,
    module: MODULES.DEALS,
  });
  const stages = stagesData?.data?.data;

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState({});

  useEffect(() => {
    if (!dealData?.editable && dealData?.currentStatus?.name) {
      toast.warning(
        ` Deal is converted to ${dealData?.currentStatus?.name} stage. Now it is not editable.`
      );
    }
  }, [dealData]);

  const mutationUpdate = useMutation({
    mutationFn: ({ id, dealData }) => DealApi.updateDeal(id, dealData),
    onSuccess: () => {
      toast.success(EDITED_SUCCESS_MSG);
      navigate(route.deals);
      queryClient.invalidateQueries("deals");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || ERROR_MSG);
    },
  });

  const validationSchema = Yup.object({
    description: Yup.string(),
    probability: Yup.string(),
    textMessageAboutActivity: Yup.string(),
    currentStatus: Yup.object()
      .shape({
        name: Yup.string().required("Stage name is required."),
        id: Yup.number().required("Stage id is required."),
        color: Yup.string().required("Stage color is required."),
      })
      .required(REQUIRED_FIELD),
  });

  const formik = useFormik({
    initialValues: dealData?.firstName ? dealData : new Deal(),
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const updatedFields = {};
      const messages = [];

      // Compare values with original dealData
      for (const key in validationSchema.fields) {
        if (values[key] !== undefined && formik.dirty) {
          // Handle `currentStatus` as a special case (object comparison)
          if (key === "currentStatus") {
            const oldValue = dealData[key]?.name || "N/A";
            const newValue = values[key]?.name || "N/A";

            if (oldValue !== newValue) {
              updatedFields[key] = values[key];
              messages.push(
                `<b>${MODULES.DEALS.slice(
                  0,
                  -1
                )}  ${key}</b> updated from <b>${oldValue}</b> to <b>${newValue}</b>`
              );
            }
          } else {
            // Default case for other fields
            const oldValue = dealData[key] || "N/A";
            const newValue = values[key] || "N/A";

            if (oldValue !== newValue) {
              updatedFields[key] = newValue;
              messages.push(
                `<b>${key}</b> updated from <b>${oldValue}</b> to <b>${newValue}</b>`
              );
            }
          }
        }
      }

      // If no updates, show a toast warning
      if (Object.keys(updatedFields).length === 0) {
        toast.warn("No changes were made to the deal data.");
        return; // Stop further execution if no changes
      }

      // Log or save timeline message
      if (messages.length > 0) {
        const timelineMessage = messages.join(", ");

        // Include the timelineMessage in your API call
        mutationUpdate.mutate({
          id: dealId,
          dealData: {
            ...updatedFields,
            textMessageAboutActivity: timelineMessage,
          },
        });
      }
    },
  });

  useEffect(() => {
    if (dealData?.data) {
      formik.setValues({
        ...formik.initialValues,
        ...dealData.data,
      });
    }
  }, [dealData]);

  const statusChangeHandler = (e) => {
    const selectedOption = JSON.parse(e.target.value);
    setSelectedStage(selectedOption);
    formik.setFieldValue("currentStatus", selectedOption);
    if (selectedOption?.toDeal) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      {isLoading ? (
        <LoaderComponent />
      ) : (
        <>
          <div className="page-wrapper">
            <div className="content">
              <div className="row">
                <div className="col-md-12">
                  {/* Page Header */}
                  <PageHeader pageName="Edit Deal" />
                  {/* /Page Header */}
                </div>
              </div>
              <div className="contact-head">
                <div className="row align-items-center">
                  <div className="col-sm-6">
                    <ul className="contact-breadcrumb">
                      <li>
                        <div
                          onClick={() => navigate(-1)}
                          className="navigate-link"
                        >
                          {" "}
                          <i className="ti ti-arrow-narrow-left text-capitalize me-1" />{" "}
                          Deals
                        </div>
                      </li>
                      <li className="text-capitalize">
                        {dealData?.firstName} {dealData?.lastName}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <form onSubmit={formik?.handleSubmit}>
                  <div className="accordion" id="main_accordion">
                    {/* Basic Info */}
                    <div className="accordion-item rounded mb-3">
                      <div className="accordion-header">
                        <Link
                          to="#"
                          className="accordion-button accordion-custom-button bg-white rounded fw-medium text-dark"
                          data-bs-toggle="collapse"
                          data-bs-target="#basic"
                        >
                          <span className="avatar avatar-md rounded text-dark border me-2">
                            <i className="ti ti-user-plus fs-20" />
                          </span>
                          Basic Info
                        </Link>
                      </div>
                      <div
                        className="accordion-collapse collapse show"
                        id="basic"
                        data-bs-parent="#main_accordion"
                      >
                        <div className="accordion-body border-top">
                          <div className="row">
                            {/* First Name */}
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="col-form-label">
                                  First Name{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    className="form-control text-capitalize"
                                    name="firstName "
                                    value={dealData?.firstName}
                                    disabled
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-lock" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Last Name */}
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="col-form-label">
                                  Last Name{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    className="form-control text-capitalize"
                                    name="lastName"
                                    value={dealData?.lastName}
                                    disabled
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-lock" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Email */}
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="col-form-label">
                                  Email <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                  <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={dealData?.email}
                                    disabled
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-lock" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Phone */}
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="col-form-label">Phone</label>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="mobile"
                                    value={dealData?.mobile}
                                    disabled
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-lock" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* leadsource*/}
                            {/* <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">Lead Source</label>
                          <input
                            type="text"
                            name="leadSource"
                            className="form-control"
                            value={formik.values.leadSource || dealData?.leadSource}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.leadSource &&
                          formik.errors.leadSource ? (
                            <div className="text-danger">
                              {formik.errors.leadSource}
                            </div>
                          ) : null}
                        </div>
                      </div> */}

                            {/* probability */}
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="col-form-label">
                                  Probability
                                </label>
                                <div className="input-group">
                                  <select
                                    name="probability"
                                    className="form-select"
                                    value={
                                      formik.values.probability ||
                                      dealData?.probability
                                    }
                                    onChange={(e) => {
                                      formik.setFieldValue(
                                        "probability",
                                        e.target.value
                                      );
                                    }}
                                  >
                                    <option value="">Select Probability</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                  </select>
                                  <div className="input-group-text">
                                    <i className="ti ti-pencil" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Company List */}
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="col-form-label">
                                  Company Name
                                </label>
                                <div className="input-group">
                                  <input
                                    className="form-control"
                                    name="ofCompany"
                                    value={dealData?.ofCompany?.name || ""}
                                    disabled
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-lock" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Product Name Select Box */}
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="col-form-label">
                                  Product Name
                                </label>
                                <div className="input-group">
                                  <input
                                    className="form-control"
                                    name="productInterested"
                                    value={
                                      dealData?.productInterested?.name ||
                                      dealData?.productInterested ||
                                      "N/A"
                                    }
                                    disabled={true}
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-lock" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* current status */}
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="col-form-label">Status</label>
                                <div className="input-group">
                                  <select
                                    name="currentStatus"
                                    className="form-select text-capitalize"
                                    value={
                                      JSON.stringify(
                                        formik.values.currentStatus
                                      ) || ""
                                    }
                                    onChange={(e) => statusChangeHandler(e)}
                                    onBlur={() =>
                                      formik.setFieldTouched(
                                        "currentStatus",
                                        true
                                      )
                                    }
                                  >
                                    <option value="">Select a stage</option>
                                    {stages?.map((stage) => (
                                      <option
                                        className="text-capitalize"
                                        key={stage?.id}
                                        value={JSON.stringify(stage)} // Pass the entire stage object
                                        // style={{
                                        //   backgroundColor: `${stage?.color}`,
                                        // }}
                                      >
                                        {stage?.name}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="input-group-text">
                                    <i className="ti ti-pencil" />
                                  </div>
                                </div>

                                {formik.touched.currentStatus &&
                                formik.errors.currentStatus ? (
                                  <div className="text-danger">
                                    {formik.errors.currentStatus}
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            {/* description */}
                            <div className="col-md-12">
                              <div className="mb-0">
                                <label className="col-form-label">
                                  Description
                                </label>
                                <div className="input-group">
                                  <textarea
                                    className="form-control"
                                    name="description"
                                    rows={5}
                                    value={formik.values.description || ""}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-pencil" />
                                  </div>
                                </div>
                              </div>
                              {formik.touched.description &&
                              formik.errors.description ? (
                                <div className="text-danger">
                                  {formik.errors.description}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Basic Info */}
                  </div>
                  <div className="d-flex align-items-center justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={
                        mutationUpdate?.isPending || !dealData?.editable
                      }
                    >
                      {mutationUpdate?.isPending ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Confirmation Modal */}
          {showConfirmModal && (
            <div className="modal fade show d-block" role="dialog">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirm Stage Conversion</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowConfirmModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body ">
                    <p>
                      Are you sure you want to move this lead to the{" "}
                      <strong className="text-capitalize">
                        {selectedStage?.name}
                      </strong>{" "}
                      stage? This action will convert the lead into a deal, and
                      it cannot be undone.
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-light"
                      onClick={() => setShowConfirmModal(false)}
                    >
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleConfirm}>
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default EditDeal;
