import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import Select from "react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CompanyApi from "../api/CompanyApi";
import { useFormik } from "formik";
import { Company } from "../models/CompanyModel";
import * as Yup from "yup";
import { useCompanyData } from "../hooks/useCompanyData";
import { MdCancel, MdAdd } from "react-icons/md";
import { toast } from "react-toastify";
import {
  EDITED_SUCCESS_MSG,
  ERROR_MSG,
  RATING_MAX_MSG,
  RATING_MIN_MSG,
  SOCIAL_PROFILE_URL_MSG,
  VALID_WEBSITE_URL_MSG,
  VALID_EMAIL_MSG,
  VALID_MOBILE_MSG,
  VALID_STATUS_MSG,
  MIN_LENGTH_VALIDATION,
  REQUIRED_FIELD,
} from "../../../../core/data/constants/constant";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import { all_routes } from "../../../router/all_routes";
import { generateOrganizationCode } from "../../../../utils/helpers/helper";
import { debounce } from "lodash";


const EditCompany = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const industries = [
    { value: "choose", label: "Choose" },
    { value: "Retail Industry", label: "Retail Industry" },
    { value: "Banking", label: "Banking" },
    { value: "Hotels", label: "Hotels" },
    { value: "Financial Services", label: "Financial Services" },
    { value: "Insurance", label: "Insurance" },
  ];

  const queryClient = useQueryClient();

  const { id: companyId } = useParams();
  const { companyData, isLoading } = useCompanyData(companyId);

  const mutationUpdate = useMutation({
    mutationFn: ({ id, companyData }) =>
      CompanyApi.updateCompany(id, companyData),
    onSuccess: () => {
      toast.success(EDITED_SUCCESS_MSG);
      navigate(route.companies);
      queryClient.invalidateQueries("companies");
    },
    onError: (error) => {
      toast.error((error.response?.data?.msg || ERROR_MSG).toUpperCase());
    },
  });

  const validationSchema = Yup.object({
    name: Yup.string(),
    code: Yup.string().min(
      6,
      MIN_LENGTH_VALIDATION({ field: "code", length: 6 })
    ),
    email: Yup.string().email(VALID_EMAIL_MSG),
    website: Yup.string().url(VALID_WEBSITE_URL_MSG),
    tags: Yup.array().of(Yup.string()),
    industry: Yup.string(),
    address: Yup.object({
      street: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zipcode: Yup.string(),
    }),
    socialProfiles: Yup.array().of(
      Yup.string().url(SOCIAL_PROFILE_URL_MSG).nullable().notRequired()
    ),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, VALID_MOBILE_MSG)
      .min(10)
      .max(10),
    status: Yup.string().oneOf(["active", "inactive"], VALID_STATUS_MSG),

    ozonetelcampaignName: Yup.array().of(Yup.string()),
    ozonetelApiKey: Yup.string(),
    ozonetelUsername: Yup.string(),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: companyData?.name
      ? { ...companyData, campaignName: "" }
      : { ...new Company(), campaignName: "" },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (JSON.stringify(values) === JSON.stringify(formik.initialValues)) {
        toast.warning("No changes detected. Please update the form.");
        return; // Prevent submission
      }

      mutationUpdate.mutate({ id: companyId, companyData: values }); // Update company
    },
  });

  const addCampaignName = () => {
    const campaignName = formik.values.campaignName?.trim();

    if (!campaignName) {
      toast.error("Campaign name is required.");
      return;
    }

    const isDuplicate = formik.values.ozonetelcampaignName.some(
      (campaign) => campaign.toLowerCase() === campaignName.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("Campaign name already exists.");
      return;
    }

    // Add product to the array
    const updatedozonetelcampaignName = [
      ...formik.values.ozonetelcampaignName,
      campaignName, // Add a valid product object
    ];
    formik.setFieldValue("ozonetelcampaignName", updatedozonetelcampaignName); // Update `products` array
    formik.setFieldValue("campaignName", ""); // Clear the input field
    formik.setFieldTouched("ozonetelcampaignName", true); // Mark products as touched
  };

  const removeCampaignName = (index) => {
    const updatedProducts = formik.values.ozonetelcampaignName.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("ozonetelcampaignName", updatedProducts);
  };

  // Handler to generate organization code
  const handleGenerateCode = useCallback(
    debounce((organizationName) => {
      if (organizationName.trim().length >= 2) {
        try {
          const generatedCode = generateOrganizationCode(organizationName);
          formik.setFieldValue("code", generatedCode); // Update the `code` field
        } catch (error) {
          console.error(error.message);
        }
      }
    }, 300), // Wait 300ms after the user stops typing
    []
  );

  useEffect(() => {
    if (companyData?.data) {
      formik.setValues({
        ...formik.initialValues,
        ...companyData.data,
      });
    }
  }, [companyData]);

  return (
    <div>
      {isLoading ? (
        <LoaderComponent />
      ) : (
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                {/* Page Header */}
                <PageHeader pageName="Edit Company" />
                {/* /Page Header */}
              </div>
            </div>
            <div className="contact-head">
              <div className="row align-items-center">
                <div className="col-sm-6">
                  <ul className="contact-breadcrumb">
                    <li>
                      <Link to={route.companies}>
                        <i className="ti ti-arrow-narrow-left" />
                        Company
                      </Link>
                    </li>
                    <li>{companyData?.name}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <form onSubmit={formik.handleSubmit}>
                <div className="accordion" id="main_accordion">
                  {/* Basic Info */}
                  <div className="accordion-item rounded mb-3">
                    <div
                      className={`accordion-header ${
                        (formik.errors.name && formik.touched.name) ||
                        (formik.errors.code && formik.touched.code) ||
                        (formik.errors.email && formik.touched.email) ||
                        (formik.errors.mobile && formik.touched.mobile) ||
                        (formik.errors.website && formik.touched.website) ||
                        (formik.errors.rating && formik.touched.rating) ||
                        (formik.errors.industry && formik.touched.industry) ||
                        (formik.errors.description &&
                          formik.touched.description)
                          ? "border border-1 border-danger rounded"
                          : ""
                      }`}
                    >
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
                          {/* Company logo */}

                          {/* <div className="col-md-12">
                        <div className="mb-3">
                          <div className="profile-upload">
                            <div className="profile-upload-img">
                              <span>
                                <i className="ti ti-photo" />
                              </span>
                              {formik.values.logo && (
                                <img
                                  src={URL.createObjectURL(formik.values.logo)}
                                  alt="Preview"
                                  className="preview1"
                                />
                              )}
                              <button
                                type="button"
                                className="profile-remove"
                                onClick={() =>
                                  formik.setFieldValue("logo", null)
                                }
                              >
                                <i className="ti ti-x" />
                              </button>
                            </div>
                            <div className="profile-upload-content">
                              <label className="profile-upload-btn">
                                <i className="ti ti-file-broken" /> Upload File{" "}
                                <span className="text-danger">*</span>
                                <input
                                  type="file"
                                  className="input-img"
                                  name="logo"
                                  onChange={(event) => {
                                    formik.setFieldValue(
                                      "logo",
                                      event.target.files[0]
                                    );
                                  }}
                                  onBlur={formik.handleBlur}
                                />
                              </label>
                              <p>JPG, GIF or PNG. Max size of 800K</p>
                            </div>
                          </div>
                          {formik.touched.logo && formik.errors.logo ? (
                            <div className="text-danger">
                              {formik.errors.logo}
                            </div>
                          ) : null}
                        </div>
                      </div> */}

                          {/* Company name */}
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="col-form-label">
                                Company Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="name"
                                  value={
                                    formik?.values?.name || companyData?.name
                                  }
                                  onChange={(e) => {
                                    formik.handleChange(e);
                                    handleGenerateCode(e.target.value);
                                  }}
                                  onBlur={formik?.handleBlur}
                                />
                                <div className="input-group-text">
                                  <i className="ti ti-pencil" />
                                </div>
                              </div>
                              {formik?.touched?.name && formik?.errors?.name ? (
                                <div className="text-danger">
                                  {formik?.errors?.name}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          {/* Company code */}
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="col-form-label">
                                Company Code{" "}
                              </label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  name="code"
                                  className="form-control"
                                  value={
                                    formik?.values?.code || companyData?.code
                                  }
                                  readOnly // This makes the field non-editable
                                />
                                <div className="input-group-text">
                                  <i className="ti ti-lock" />
                                </div>
                              </div>
                              {formik?.touched?.code && formik?.errors?.code ? (
                                <div className="text-danger">
                                  {formik?.errors?.code}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          {/* Email */}
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="col-form-label">
                                Email <span className="text-danger">*</span>
                              </label>
                              <div className="input-group">
                                <input
                                  type="email"
                                  name="email"
                                  className="form-control"
                                  value={
                                    formik?.values?.email || companyData?.email
                                  }
                                  onChange={formik?.handleChange}
                                  onBlur={formik?.handleBlur}
                                />
                                <div className="input-group-text">
                                  <i className="ti ti-pencil" />
                                </div>
                              </div>
                              {formik?.touched?.email &&
                              formik?.errors?.email ? (
                                <div className="text-danger">
                                  {formik?.errors?.email}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          {/* Phone */}
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="col-form-label">
                                Phone <span className="text-danger">*</span>
                              </label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  name="mobile"
                                  className="form-control"
                                  min={10}
                                  value={
                                    formik?.values?.mobile ||
                                    companyData?.mobile
                                  }
                                  onChange={formik?.handleChange}
                                  onBlur={formik?.handleBlur}
                                />
                                <div className="input-group-text">
                                  <i className="ti ti-pencil" />
                                </div>
                              </div>
                              {formik?.touched?.mobile &&
                              formik?.errors?.mobile ? (
                                <div className="text-danger">
                                  {formik?.errors?.mobile}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          {/* website */}
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="col-form-label">
                                Website <span className="text-danger">*</span>
                              </label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  name="website"
                                  className="form-control"
                                  value={
                                    formik?.values?.website ||
                                    companyData?.website
                                  }
                                  onChange={formik?.handleChange}
                                  onBlur={formik?.handleBlur}
                                />
                                <div className="input-group-text">
                                  <i className="ti ti-pencil" />
                                </div>
                              </div>
                              {formik?.touched?.website &&
                              formik?.errors?.website ? (
                                <div className="text-danger">
                                  {formik?.errors?.website}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          {/* tags */}
                          {/* <div className="col-md-6"> */}
                          {/* <div className="mb-3">
                          <label className="col-form-label">Tags</label> */}
                          {/* <div className="d-flex">
                            <input
                              className="form-control"
                              type="text"
                              name="currentTag"
                              value={formik?.values?.currentTag || ""}
                              onChange={(e) =>
                                formik?.setFieldValue(
                                  "currentTag",
                                  e.target.value
                                )
                              }
                              placeholder="Enter a tag"
                            />
                            <button
                              type="button"
                              className="btn btn-primary ms-2"
                              onClick={() => {
                                const currentTag =
                                  formik?.values?.currentTag?.trim();
                                if (currentTag) {
                                  const tags = formik?.values?.tags || [];
                                  if (!tags.includes(currentTag)) {
                                    // Add tag only if it's not already in the array
                                    const updatedTags = [...tags, currentTag];
                                    formik?.setFieldValue("tags", updatedTags);
                                    formik?.setFieldValue("currentTag", ""); // Clear input
                                  } else {
                                    alert("Tag already exists!");
                                  }
                                }
                              }}
                            >
                              <MdAdd size={20} />
                            </button>
                          </div> */}
                          {/* Display Tags */}
                          {/* <div className="mt-2">
                            {Array.isArray(formik?.values?.tags).length > 0 &&
                              formik?.values?.tags.map((tag, index) => {
                                // Define an array of badge color classes
                                const badgeColors = [
                                  "badge-soft-primary",
                                  "badge-soft-success",
                                  "badge-soft-danger",
                                  "badge-soft-warning",
                                  "badge-soft-info",
                                  "badge-soft-dark",
                                ];
                                // Pick a color based on the index
                                const colorClass =
                                  badgeColors[index % badgeColors.length];
                                return (
                                  <span
                                    key={index}
                                    className={`badge ${colorClass} me-2 d-inline-flex align-items-center`}
                                    style={{
                                      gap: "0.5rem",
                                      width: "auto",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {tag}
                                    <button
                                      type="button"
                                      className="btn p-0 btn-sm"
                                      aria-label="Remove"
                                      onClick={() => {
                                        const updatedTags =
                                          formik?.values?.tags.filter(
                                            (_, i) => i !== index
                                          );
                                        formik?.setFieldValue(
                                          "tags",
                                          updatedTags
                                        );
                                      }}
                                    >
                                      <MdCancel size={15} />
                                    </button>
                                  </span>
                                );
                              })}
                          </div> */}

                          {/* {formik?.touched?.tags && formik?.errors?.tags ? (
                            <div className="text-danger">
                              {formik?.errors?.tags}
                            </div>
                          ) : null} */}
                          {/* </div> */}
                          {/* </div> */}

                          {/* industry */}
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="col-form-label">Industry</label>
                              <Select
                                className="select2"
                                classNamePrefix="react-select"
                                options={industries}
                                placeholder="Choose"
                                name="industry"
                                value={
                                  industries.find(
                                    (option) =>
                                      option.value ===
                                        formik?.values?.industry ||
                                      option.value === companyData?.industry
                                  ) || null
                                }
                                onChange={(selectedOption) =>
                                  formik?.setFieldValue(
                                    "industry",
                                    selectedOption?.value
                                  )
                                }
                                onBlur={() =>
                                  formik?.setFieldTouched("industry", true)
                                }
                              />
                              {formik?.touched?.industry &&
                              formik?.errors?.industry ? (
                                <div className="text-danger">
                                  {formik?.errors?.industry}
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
                                  value={
                                    formik?.values?.description ||
                                    companyData?.description
                                  }
                                  onChange={formik?.handleChange}
                                  onBlur={formik?.handleBlur}
                                />
                                <div className="input-group-text">
                                  <i className="ti ti-pencil" />
                                </div>
                              </div>
                            </div>
                            {formik?.touched?.description &&
                            formik?.errors?.description ? (
                              <div className="text-danger">
                                {formik?.errors?.description}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Basic Info */}

                  {/* Ozonetel details */}
                  <div className="accordion-item border-top rounded mb-3">
                    <div
                      className={`accordion-header ${
                        (formik.errors.ozonetelApiKey &&
                          formik.touched.ozonetelApiKey) ||
                        (formik.errors.ozonetelUsername &&
                          formik.touched.ozonetelUsername) ||
                        (formik.errors.campaignName &&
                          formik.touched.campaignName)
                          ? "border border-1 border-danger rounded"
                          : ""
                      }`}
                    >
                      <Link
                        to="#"
                        className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                        data-bs-toggle="collapse"
                        data-bs-target="#ozonetel"
                      >
                        <span className="avatar avatar-md rounded text-dark border me-2">
                          <i className="ti ti-headset fs-20" />
                        </span>
                        Ozonetel Details
                      </Link>
                    </div>
                    <div
                      className="accordion-collapse collapse"
                      id="ozonetel"
                      data-bs-parent="#main_accordion"
                    >
                      <div className="accordion-body border-top">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Ozonetel Api key{" "}
                            </label>
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                name="ozonetelApiKey"
                                value={formik.values.ozonetelApiKey}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              <div className="input-group-text">
                                <i className="ti ti-pencil" />
                              </div>
                            </div>
                            {formik.touched.ozonetelApiKey &&
                            formik.errors.ozonetelApiKey ? (
                              <div className="text-danger">
                                {formik.errors.ozonetelApiKey}
                              </div>
                            ) : null}
                          </div>
                          <div className="mb-3">
                            <label className="col-form-label">
                              Ozonetel username{" "}
                            </label>
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                name="ozonetelUsername"
                                value={formik.values.ozonetelUsername}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              <div className="input-group-text">
                                <i className="ti ti-pencil" />
                              </div>
                            </div>
                            {formik.touched.ozonetelUsername &&
                            formik.errors.ozonetelUsername ? (
                              <div className="text-danger">
                                {formik.errors.ozonetelUsername}
                              </div>
                            ) : null}
                          </div>

                          {/* Add Campaign */}
                          <div className="mb-3">
                            <label className="col-form-label">
                              Add Campaign Name{" "}
                            </label>
                            <div className="input-group">
                              <input
                                type="text"
                                name="campaignName"
                                value={formik.values.campaignName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-control"
                                placeholder="Enter campaign name"
                              />
                              <div className="input-group-text">
                                <i className="ti ti-pencil" />
                              </div>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={addCampaignName}
                              >
                                Add
                              </button>
                            </div>
                          </div>

                          {/* Campaign List */}
                          {formik?.values?.ozonetelcampaignName?.length > 0 && (
                            <ul className="list-group mt-3">
                              {formik.values.ozonetelcampaignName.map(
                                (name, index) => (
                                  <li
                                    key={index}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                  >
                                    {name}
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-danger"
                                      onClick={() => removeCampaignName(index)}
                                    >
                                      Remove
                                    </button>
                                  </li>
                                )
                              )}
                            </ul>
                          )}

                          {formik.touched.ozonetelcampaignName?.length === 0 &&
                            formik.errors.ozonetelcampaignName && (
                              <div className="text-danger mt-2">
                                {formik.errors.ozonetelcampaignName}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Ozonetel details */}

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
                                  value={
                                    formik?.values?.address?.street ||
                                    companyData?.address?.street
                                  }
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
                                  value={
                                    formik?.values?.address?.city ||
                                    companyData?.address?.city
                                  }
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
                                <input
                                  type="text"
                                  name="address.state"
                                  className="form-control"
                                  value={
                                    formik?.values?.address?.state ||
                                    companyData?.address?.state
                                  }
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
                              <label className="col-form-label">Zipcode </label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  name="address.zipcode"
                                  className="form-control"
                                  value={
                                    formik?.values?.address?.zipcode ||
                                    companyData?.address?.zipcode
                                  }
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

                  {/* Social Profile */}
                  <div className="accordion-item border-top rounded mb-3">
                    <div className="accordion-header">
                      <Link
                        to="#"
                        className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                        data-bs-toggle="collapse"
                        data-bs-target="#social"
                      >
                        <span className="avatar avatar-md rounded text-dark border me-2">
                          <i className="ti ti-social fs-20" />
                        </span>
                        Social Profile
                      </Link>
                    </div>
                    <div
                      className="accordion-collapse collapse"
                      id="social"
                      data-bs-parent="#main_accordion"
                    >
                      <div className="accordion-body border-top">
                        <div className="row">
                          {[
                            "Facebook",
                            "Skype",
                            "LinkedIn",
                            "Twitter",
                            "WhatsApp",
                            "Instagram",
                          ].map((platform, index) => (
                            <div className="col-md-6" key={platform}>
                              <div className="mb-3">
                                <label className="col-form-label">
                                  {platform}
                                </label>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    name={`socialProfiles[${index}]`}
                                    className="form-control"
                                    value={
                                      formik?.values?.socialProfiles[index] ||
                                      companyData?.socialProfiles[index] ||
                                      ""
                                    }
                                    onChange={formik?.handleChange}
                                    onBlur={formik?.handleBlur}
                                  />
                                  <div className="input-group-text">
                                    <i className="ti ti-pencil" />
                                  </div>
                                </div>
                                {formik?.touched?.socialProfiles?.[index] &&
                                  formik?.errors?.socialProfiles?.[index] && (
                                    <div className="text-danger">
                                      {formik?.errors?.socialProfiles[index]}
                                    </div>
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Social Profile */}

                  {/* Access */}
                  <div className="accordion-item border-top rounded mb-3">
                    <div
                      className={`accordion-header ${
                        formik.errors.status && formik.touched.status
                          ? "border border-1 border-danger rounded"
                          : ""
                      }`}
                    >
                      <Link
                        to="#"
                        className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                        data-bs-toggle="collapse"
                        data-bs-target="#access-info"
                      >
                        <span className="avatar avatar-md rounded text-dark border me-2">
                          <i className="ti ti-accessible fs-20" />
                        </span>
                        Access
                      </Link>
                    </div>
                    <div
                      className="accordion-collapse collapse"
                      id="access-info"
                      data-bs-parent="#main_accordion"
                    >
                      <div className="accordion-body border-top">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="col-form-label">
                                Status <span className="text-danger">*</span>
                              </label>
                              <div className="d-flex flex-wrap">
                                <div className="me-2">
                                  <label>
                                    <input
                                      type="radio"
                                      id="active"
                                      name="status"
                                      value="active"
                                      checked={
                                        formik.values.status === "active"
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                    />{" "}
                                    Active
                                  </label>
                                </div>
                                <div>
                                  <label>
                                    {" "}
                                    <input
                                      type="radio"
                                      id="inactive"
                                      name="status"
                                      value="inactive"
                                      checked={
                                        formik.values.status === "inactive"
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                    />{" "}
                                    Inactive
                                  </label>
                                </div>
                              </div>
                              {formik?.touched.status &&
                              formik?.errors.status ? (
                                <div className="text-danger">
                                  {formik?.errors.status}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Access */}
                </div>
                <div className="d-flex align-items-center justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {isLoading ? "Updating" : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCompany;
