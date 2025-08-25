import React, { useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import Select from "react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CompanyApi from "../api/CompanyApi";
import { useFormik } from "formik";
import { Company } from "../models/CompanyModel";
import * as Yup from "yup";
import {
  MOBILE_NUMERIC_MSG,
  RATING_MAX_MSG,
  RATING_MIN_MSG,
  REQUIRED_FIELD,
  SOCIAL_PROFILE_URL_MSG,
  VALID_WEBSITE_URL_MSG,
  VALID_EMAIL_MSG,
  VALID_STATUS_MSG,
  FILE_TOO_LARGE_MSG,
  CREATED_SUCCESS_MSG,
  ERROR_MSG,
  MIN_LENGTH_VALIDATION,
} from "../../../../core/data/constants/constant";
import { toast } from "react-toastify";
import { handleOffcanvasAction } from "../../../../utils/helpers/handleOffcanvasAction";
import { useDispatch } from "react-redux";
import { setFetchCompanyData } from "../../../../core/data/redux/authSlice";
import { generateOrganizationCode } from "../../../../utils/helpers/helper";
import { debounce } from "lodash";

const AddCompany = () => {
  const route = all_routes;
  const dispatch = useDispatch();
  const industries = [
    { value: "choose", label: "Choose" },
    { value: "Retail Industry", label: "Retail Industry" },
    { value: "Banking", label: "Banking" },
    { value: "Hotels", label: "Hotels" },
    { value: "Financial Services", label: "Financial Services" },
    { value: "Insurance", label: "Insurance" },
  ];

  const queryClient = useQueryClient();

  const mutationAdd = useMutation({
    mutationFn: CompanyApi.addCompany,
    onSuccess: async () => {
      toast.success(CREATED_SUCCESS_MSG);
      queryClient.invalidateQueries("companies");
      dispatch(setFetchCompanyData());
      formik.resetForm();
      handleOffcanvasAction("offcanvas_add", "hide");
    },
    onError: (error) => {
      toast.error((error.response?.data?.msg || ERROR_MSG).toUpperCase());
    },
  });

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(REQUIRED_FIELD)
      .min(2, "Organization name must have at least 2 characters."),
    code: Yup.string()
      .min(6, MIN_LENGTH_VALIDATION({ field: "code", length: 6 }))
      .required(REQUIRED_FIELD),
    // logo: Yup.mixed()
    //   .test(
    //     "fileFormat",
    //     "Unsupported file format",
    //     (value) =>
    //       value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
    //   )
    //   .test(
    //     "fileSize",
    //     FILE_TOO_LARGE_MSG,
    //     (value) => value && value.size <= 800 * 1024 // Max size 800KB
    //   ),
    email: Yup.string().email(VALID_EMAIL_MSG).required(REQUIRED_FIELD),
    website: Yup.string().url(VALID_WEBSITE_URL_MSG),
    currentTag: Yup.string(),
    tags: Yup.array().of(Yup.string()),
    industry: Yup.string(),
    address: Yup.object({
      street: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zipcode: Yup.string(),
    }),
    socialProfiles: Yup.array()
      .of(Yup.string().url(SOCIAL_PROFILE_URL_MSG))
      .nullable(), // Optional
    mobile: Yup.string()
      .matches(/^[0-9]+$/, MOBILE_NUMERIC_MSG)
      .min(10)
      .max(10),
    status: Yup.string()
      .oneOf(["active", "inactive"], VALID_STATUS_MSG)
      .required(REQUIRED_FIELD),
    ozonetelcampaignName: Yup.array().of(Yup.string()),
    ozonetelApiKey: Yup.string(),
    ozonetelUsername: Yup.string(),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: { ...new Company(), campaignName: "" },
    validationSchema,
    onSubmit: (values) => {
      mutationAdd.mutate(values); // Create company
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

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="fw-semibold">Add Organization</h5>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="offcanvas-body">
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
                    (formik.errors.description && formik.touched.description)
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
                            Organization Name{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formik.values.name}
                            onChange={(e) => {
                              formik.handleChange(e);
                              handleGenerateCode(e.target.value);
                            }}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.name && formik.errors.name ? (
                            <div className="text-danger">
                              {formik.errors.name}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Company code */}
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Organization Code{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              name="code"
                              className="form-control"
                              placeholder="BSM5367"
                              value={formik.values.code}
                              readOnly // This makes the field non-editable
                            />
                            <div className="input-group-text">
                              <i className="ti ti-lock" />
                            </div>
                          </div>
                          {formik.touched.code && formik.errors.code ? (
                            <div className="text-danger">
                              {formik.errors.code}
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
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.email && formik.errors.email ? (
                            <div className="text-danger">
                              {formik.errors.email}
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
                          <input
                            type="text"
                            name="mobile"
                            className="form-control"
                            value={formik.values.mobile}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            min={10}
                          />
                          {formik.touched.mobile && formik.errors.mobile ? (
                            <div className="text-danger">
                              {formik.errors.mobile}
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
                          <input
                            type="text"
                            name="website"
                            className="form-control"
                            value={formik.values.website}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.website && formik.errors.website ? (
                            <div className="text-danger">
                              {formik.errors.website}
                            </div>
                          ) : null}
                        </div>
                      </div>

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
                                  option.value === formik.values.industry
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              formik.setFieldValue(
                                "industry",
                                selectedOption?.value
                              )
                            }
                            onBlur={() =>
                              formik.setFieldTouched("industry", true)
                            }
                          />
                          {formik.touched.industry && formik.errors.industry ? (
                            <div className="text-danger">
                              {formik.errors.industry}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* description */}
                      <div className="col-md-12">
                        <div className="mb-0">
                          <label className="col-form-label">Description</label>
                          <textarea
                            className="form-control"
                            name="description"
                            rows={5}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
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

              {/* Ozonetel details */}
              <div className="accordion-item border-top rounded mb-3">
                <div
                  className={`accordion-header ${
                    (formik.errors.ozonetelApiKey &&
                      formik.touched.ozonetelApiKey) ||
                    (formik.errors.ozonetelUsername &&
                      formik.touched.ozonetelUsername) ||
                    (formik.errors.campaignName && formik.touched.campaignName)
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
                        <input
                          type="text"
                          className="form-control"
                          name="ozonetelApiKey"
                          value={formik.values.ozonetelApiKey}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
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
                        <input
                          type="text"
                          className="form-control"
                          name="ozonetelUsername"
                          value={formik.values.ozonetelUsername}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
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
              {/* /Ozonetel deatils*/}

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
                          <input
                            type="text"
                            name="address.street"
                            className="form-control"
                            value={formik.values.address.street}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched?.address?.street &&
                          formik.errors?.address?.street ? (
                            <div className="text-danger">
                              {formik.errors?.address?.street}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">City </label>
                          <input
                            type="text"
                            name="address.city"
                            className="form-control"
                            value={formik.values.address.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched?.address?.city &&
                          formik.errors?.address?.city ? (
                            <div className="text-danger">
                              {formik.errors?.address?.city}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            State / Province{" "}
                          </label>
                          <input
                            type="text"
                            name="address.state"
                            className="form-control"
                            value={formik.values.address.state}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched?.address?.state &&
                          formik.errors?.address?.state ? (
                            <div className="text-danger">
                              {formik.errors?.address?.state}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-0">
                          <label className="col-form-label">Zipcode </label>
                          <input
                            type="text"
                            name="address.zipcode"
                            className="form-control"
                            value={formik.values.address.zipcode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched?.address?.zipcode &&
                          formik.errors?.address?.zipcode ? (
                            <div className="text-danger">
                              {formik.errors?.address?.zipcode}
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
                            <label className="col-form-label">{platform}</label>
                            <input
                              type="text"
                              name={`socialProfiles[${index}]`}
                              className="form-control"
                              value={formik.values.socialProfiles[index]}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
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
                              <input
                                type="radio"
                                className="status-radio"
                                id="active"
                                name="status"
                                value="active" // Set a fixed value
                                checked={formik?.values?.status === "active"} // Check based on current value
                                onChange={formik?.handleChange}
                                onBlur={formik?.handleBlur}
                              />
                              <label htmlFor="active">Active</label>
                            </div>
                            <div>
                              <input
                                type="radio"
                                className="status-radio"
                                id="inactive"
                                name="status"
                                value="inactive" // Set a fixed value
                                checked={formik?.values?.status === "inactive"} // Check based on current value
                                onChange={formik?.handleChange}
                                onBlur={formik?.handleBlur}
                              />
                              <label htmlFor="inactive">Inactive</label>
                            </div>
                          </div>
                          {formik?.touched?.status && formik?.errors?.status ? (
                            <div className="text-danger">
                              {formik?.errors?.status}
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
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCompany;
