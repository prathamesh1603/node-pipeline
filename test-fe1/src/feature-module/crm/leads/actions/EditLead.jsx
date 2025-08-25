import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import LeadApi from "../api/LeadApi";
import { useLeadData } from "../hooks/useLeadData";
import { Lead } from "../models/LeadModel";
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
import ConfirmModal from "../components/ConfirmModal";

const EditLead = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { id: leadId } = useParams();
  const { leadData, isLoading } = useLeadData(leadId);

  const { stagesData } = useStages({
    ofCompany: leadData?.ofCompany?._id,
    module: MODULES.LEADS,
  });
  const stages = stagesData?.data?.data;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState({});

  const mutationUpdate = useMutation({
    mutationFn: ({ id, leadData }) => LeadApi.updateLead(id, leadData),
    onSuccess: () => {
      toast.success(EDITED_SUCCESS_MSG);
      navigate(route.leads);
      queryClient.invalidateQueries("leads");
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
    clientCode: Yup.string(),
    address: Yup.object({
      street: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zipcode: Yup.string(),
    }),
  });

  const formik = useFormik({
    initialValues: leadData?.firstName ? leadData : new Lead(),
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const updatedFields = {};
      const messages = [];

      // Compare values with original leadData
      for (const key in validationSchema.fields) {
        if (values[key] !== undefined && formik.dirty) {
          // Handle `currentStatus` as a special case (object comparison)
          if (key === "currentStatus") {
            const oldValue = leadData[key]?.name || "N/A";
            const newValue = values[key]?.name || "N/A";

            if (oldValue !== newValue) {
              updatedFields[key] = values[key];
              messages.push(
                `<b> ${MODULES.LEADS.slice(
                  0,
                  -1
                )}  ${key}</b> updated from <b>${oldValue}</b> to <b>${newValue}</b>`
              );
            }
          } else {
            // Default case for other fields
            const oldValue = leadData[key] || "N/A";
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
        toast.warn("No changes were made to the lead data.");
        return; // Stop further execution if no changes
      }

      // Log or save timeline message
      if (messages.length > 0) {
        const timelineMessage = messages.join(", ");

        // Include the timelineMessage in your API call
        mutationUpdate.mutate({
          id: leadId,
          leadData: {
            ...updatedFields,
            textMessageAboutActivity: timelineMessage,
          },
        });
      }
    },
  });

  useEffect(() => {
    if (leadData?.data) {
      formik.setValues({
        ...formik.initialValues,
        ...leadData.data,
      });
    }
  }, [leadData]);

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
                  <PageHeader pageName="Edit Lead" />
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
                          <i className="ti ti-arrow-narrow-left text-capitalize me-1" />
                          Leads
                        </div>
                      </li>
                      <li className="text-capitalize">
                        {leadData?.firstName} {leadData?.lastName}
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
                                </label>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    className="form-control text-capitalize"
                                    name="firstName"
                                    value={leadData?.firstName}
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
                                </label>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    className="form-control text-capitalize"
                                    name="lastName"
                                    value={leadData?.lastName}
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
                                <label className="col-form-label">Email</label>
                                <div className="input-group">
                                  <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={leadData?.email}
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
                                    value={leadData?.mobile}
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
                            value={formik.values.leadSource || leadData?.leadSource}
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
                                      leadData?.probability
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
                                    value={leadData?.ofCompany?.name || ""}
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
                                      leadData?.productInterested?.name ||
                                      leadData?.productInterested ||
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
                                    } // Ensure the default value matches the initial state
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
                                    placeholder="Enter additional details or notes here..."
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

                    {/* Marketing Attributes */}
                    <div className="accordion-item border-top rounded mb-3">
                      <div className="accordion-header">
                        <Link
                          to="#"
                          className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                          data-bs-toggle="collapse"
                          data-bs-target="#marketing"
                        >
                          <span className="avatar avatar-md rounded text-dark border me-2">
                            <i className="ti ti-map-pin-cog fs-20" />
                          </span>
                          Marketing Attributes
                        </Link>
                      </div>
                      <div
                        className="accordion-collapse collapse"
                        id="marketing"
                        data-bs-parent="#main_accordion"
                      >
                        <div className="accordion-body border-top">
                          <div className="row">
                            {/* Lead Source */}
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="col-form-label">
                                  Lead Source
                                </label>
                                <div className="input-group">
                                  <input
                                    className="form-control text-capitalize"
                                    name="leadSource"
                                    value={leadData?.leadSource || ""}
                                    disabled
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-lock" />
                                  </div>
                                </div>
                                {formik.touched.leadSource &&
                                formik.errors.leadSource ? (
                                  <div className="text-danger">
                                    {formik.errors.leadSource}
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            {/* Business type */}
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="col-form-label">
                                  Business Type
                                </label>
                                <div className="input-group ">
                                  <input
                                    className="form-control"
                                    name="businessType"
                                    value={leadData?.businessType || ""}
                                    disabled
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-lock" />
                                  </div>
                                </div>
                                {formik.touched.businessType &&
                                formik.errors.businessType ? (
                                  <div className="text-danger">
                                    {formik.errors.businessType}
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            {/* reference source */}
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="col-form-label">
                                  Reference Source{" "}
                                </label>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    name="referenceSource"
                                    className="form-control"
                                    value={formik.values.referenceSource}
                                    onBlur={formik.handleBlur}
                                    disabled
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-lock" />
                                  </div>
                                </div>
                                {formik.touched?.referenceSource &&
                                formik.errors?.referenceSource ? (
                                  <div className="text-danger">
                                    {formik.errors?.referenceSource}
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            {/* Client code */}
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="col-form-label">
                                  Client Code{" "}
                                </label>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    name="clientCode"
                                    className="form-control"
                                    value={formik.values.clientCode}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-pencil" />
                                  </div>
                                </div>
                                {formik.touched?.clientCode &&
                                formik.errors?.clientCode ? (
                                  <div className="text-danger">
                                    {formik.errors?.clientCode}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Marketing Attributes */}

                    {/* Address Info */}
                    <div className="accordion-item border-top rounded mb-3">
                      <div className="accordion-header">
                        <Link
                          to="#"
                          className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                          data-bs-toggle="collapse"
                          data-bs-target="#address"
                        >
                          <span className="avatar avatar-md rounded text-dark border me-2">
                            <i className="ti ti-map-pin-cog fs-20" />
                          </span>
                          Address Info
                        </Link>
                      </div>
                      <div
                        className="accordion-collapse collapse"
                        id="address"
                        data-bs-parent="#main_accordion"
                      >
                        <div className="accordion-body border-top">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="col-form-label">
                                  Street Address{" "}
                                </label>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    name="address.street"
                                    className="form-control"
                                    value={formik?.values?.address?.street}
                                    onChange={formik?.handleChange}
                                    onBlur={formik?.handleBlur}
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-pencil" />
                                  </div>
                                </div>
                                {formik?.touched?.address?.street &&
                                formik?.errors?.address?.street ? (
                                  <div className="text-danger">
                                    {formik?.errors?.address?.street}
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="col-form-label">City </label>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    name="address.city"
                                    className="form-control"
                                    value={formik?.values?.address?.city}
                                    onChange={formik?.handleChange}
                                    onBlur={formik?.handleBlur}
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-pencil" />
                                  </div>
                                </div>
                                {formik?.touched?.address?.city &&
                                formik?.errors?.address?.city ? (
                                  <div className="text-danger">
                                    {formik?.errors?.address?.city}
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="col-form-label">
                                  State / Province{" "}
                                </label>
                                <div className="input-group">
                                  {" "}
                                  <input
                                    type="text"
                                    name="address.state"
                                    className="form-control"
                                    value={formik?.values?.address?.state}
                                    onChange={formik?.handleChange}
                                    onBlur={formik?.handleBlur}
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-pencil" />
                                  </div>
                                </div>
                                {formik?.touched?.address?.state &&
                                formik?.errors?.address?.state ? (
                                  <div className="text-danger">
                                    {formik?.errors?.address?.state}
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="mb-0">
                                <label className="col-form-label">
                                  Zipcode{" "}
                                </label>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    name="address.zipcode"
                                    className="form-control"
                                    value={formik?.values?.address?.zipcode}
                                    onChange={formik?.handleChange}
                                    onBlur={formik?.handleBlur}
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-pencil" />
                                  </div>
                                </div>
                                {formik?.touched?.address?.zipcode &&
                                formik?.errors?.address?.zipcode ? (
                                  <div className="text-danger">
                                    {formik?.errors?.address?.zipcode}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Address Info */}
                  </div>
                  <div className="d-flex align-items-center justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={mutationUpdate?.isPending}
                    >
                      {mutationUpdate?.isPending ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Confirmation Modal */}
          <ConfirmModal
            open={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleConfirm}
            selectedStage={selectedStage}
          />
        </>
      )}
    </>
  );
};

export default EditLead;
