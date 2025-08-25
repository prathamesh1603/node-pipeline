import { useFormik } from "formik?";
import * as Yup from "yup";
import UserApi from "../api/manageUserApi";
import { useUserData } from "../hooks/useUserData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "../model/userModel";
import { toast } from "react-toastify";
import {
  COMPANY_EMPTY_MSG,
  EDITED_SUCCESS_MSG,
  ERROR_MSG,
  MIN_LENGTH_VALIDATION,
  REQUIRED_FIELD,
  ROLE_EMPTY_MSG,
  VALID_EMAIL_MSG,
  VALID_MOBILE_MSG,
  VALID_STATUS_MSG,
} from "../../../../core/data/constants/constant";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import RenderCompanyList from "../../../../core/common/crmComponents/RenderCompanyList";
import { useEffect, useState } from "react";
import CompanyApi from "../../companies/api/CompanyApi";

const EditUser = () => {
  const { id: userId } = useParams();
  const { userData, isLoading } = useUserData(userId);

  const [ozonetelcampaignNameList, setCampaignNameList] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const queryClient = useQueryClient();
  const route = all_routes;
  const navigate = useNavigate();

  const roleNameArr = JSON.parse(localStorage.getItem("roleNameArr"));

  const firstName = userData?.name?.split(" ")[0];
  const lastName = userData?.name?.split(" ")[1];

  const mutationUpdate = useMutation({
    mutationFn: ({ id, userData }) => UserApi.updateUser(id, userData),
    onSuccess: () => {
      toast.success(EDITED_SUCCESS_MSG);
      queryClient.invalidateQueries("users");
      navigate(route.manageusers);
    },
    onError: (error) => {
      toast.error((error.response?.data?.msg || ERROR_MSG).toUpperCase());
    },
  });

  const validationSchema = Yup.object({
    firstName: Yup.string(),
    lastName: Yup.string(),
    email: Yup.string().email(VALID_EMAIL_MSG),
    mobile: Yup.string()
      .matches(/^[0-9]+$/, VALID_MOBILE_MSG)
      .min(10)
      .max(10),
    role: Yup.string().test(
      "not-empty",
      ROLE_EMPTY_MSG,
      (value) => value?.trim().length > 0
    ),
    ofCompany: Yup.string().test(
      "not-empty",
      COMPANY_EMPTY_MSG,
      (value) => value?.trim().length > 0
    ),
    address: Yup.object({
      street: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zipcode: Yup.string(),
    }),
    status: Yup.string().oneOf(["active", "inactive"], VALID_STATUS_MSG),

    agentId: Yup.string(),
    campaignName: Yup.string(),
    employeeCode: Yup.string()
      .min(7, MIN_LENGTH_VALIDATION({ field: "code", length: 7 }))
      .required(REQUIRED_FIELD),
  });

  const formik = useFormik({
    initialValues: userData?.email
      ? {
          ...userData,
          firstName,
          lastName,
          role: userData?.role?._id || "", // Map role name
          ofCompany: userData?.ofCompany._id || "", // Map company name
          campaignName: userData?.campaignName || "",
          agentId: userData?.agentId || "",
          employeeCode: userData?.employeeCode || "",
        }
      : new User(), // Default values for new user

    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const combinedName = `${values.firstName} ${values.lastName}`;
      const userData = { ...values, name: combinedName };

      // Check if any field has changed by comparing with initial values
      const hasChanges = Object.keys(userData).some(
        (key) => userData[key] !== formik.initialValues[key]
      );

      // If there are changes, update the user
      if (hasChanges) {
        mutationUpdate.mutate({ id: userId, userData });
      } else {
        toast.warning("No changes detected, nothing to update");
      }
    },
  });

  async function getozonetelcampaignName(params) {
    try {
      if (formik.values.ofCompany) {
        let list = await CompanyApi.getAllCampaignNames({
          companyId: formik.values.ofCompany,
        });

        setCampaignNameList([...list.ozonetelcampaignName]);
      }
    } catch (e) {
      toast.error("error in fetching campaign names");
    }
  }

  useEffect(() => {
    getozonetelcampaignName();
  }, [formik.values.ofCompany]);

  return (
    <>
      {isLoading ? (
        <LoaderComponent />
      ) : (
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                {/* Page Header */}
                <PageHeader pageName="Edit User" />
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
                        <i className="ti ti-arrow-narrow-left" />
                        Users
                      </div>
                    </li>
                    <li>{userData?.name}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <form onSubmit={formik?.handleSubmit}>
                <div>
                  {/* Basic Info */}
                  <div className="accordion-item rounded mb-3">
                    <div
                      className={`accordion-header ${
                        (formik.errors.firstName && formik.touched.firstName) ||
                        (formik.errors.lastName && formik.touched.lastName) ||
                        (formik.errors.email && formik.touched.email) ||
                        (formik.errors.mobile && formik.touched.mobile) ||
                        (formik.errors.role && formik.touched.role) ||
                        (formik.errors.ofCompany && formik.touched.ofCompany)
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
                                  className="form-control"
                                  name="firstName"
                                  value={formik.values.firstName} // Use Formik's value
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                <div className="input-group-text">
                                  <i className="ti ti-pencil" />
                                </div>
                              </div>
                              {formik.touched.firstName &&
                                formik.errors.firstName && (
                                  <div className="text-danger">
                                    {formik.errors.firstName}
                                  </div>
                                )}
                            </div>
                          </div>

                          {/* Last Name */}
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="col-form-label">
                                Last Name <span className="text-danger">*</span>
                              </label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="lastName"
                                  value={formik.values.lastName} // Use Formik's value
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                <div className="input-group-text">
                                  <i className="ti ti-pencil" />
                                </div>
                              </div>
                              {formik.touched.lastName &&
                                formik.errors.lastName && (
                                  <div className="text-danger">
                                    {formik.errors.lastName}
                                  </div>
                                )}
                            </div>
                          </div>
                          {console.log(formik.values)}
                          {/* Email */}
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="col-form-label">Email</label>
                              <div className="input-group">
                                <input
                                  type="email"
                                  className="form-control"
                                  name="email"
                                  value={formik?.values?.email}
                                  onChange={formik?.handleChange}
                                  onBlur={formik?.handleBlur}
                                />
                                <div className="input-group-text">
                                  <i className="ti ti-pencil" />
                                </div>
                              </div>
                              {formik?.touched?.email &&
                                formik?.errors?.email && (
                                  <div className="text-danger">
                                    {formik?.errors?.email}
                                  </div>
                                )}
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
                                  value={formik?.values?.mobile}
                                  onChange={formik?.handleChange}
                                  onBlur={formik?.handleBlur}
                                />
                                <div className="input-group-text">
                                  <i className="ti ti-pencil" />
                                </div>
                              </div>
                              {formik?.touched?.mobile &&
                                formik?.errors?.mobile && (
                                  <div className="text-danger">
                                    {formik?.errors?.mobile}
                                  </div>
                                )}
                            </div>
                          </div>

                          {/* Role */}
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="col-form-label">Role</label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  name="role"
                                  className="form-control"
                                  value={
                                    roleNameArr?.find(
                                      (role) =>
                                        role.value === formik.values.role
                                    )?.label || ""
                                  }
                                  disabled
                                />
                                <div className="input-group-text">
                                  <i className="ti ti-lock" />
                                </div>
                              </div>

                              {formik?.touched?.role &&
                                formik?.errors?.role && (
                                  <div className="text-danger">
                                    {formik?.errors?.role}
                                  </div>
                                )}
                            </div>
                          </div>

                          {/* Company */}
                          <RenderCompanyList
                            formik={formik}
                            user={user?.ofCompany ? user : userData}
                            colClass="col-md-6"
                            isEdit={true}
                          />

                          {/* Employee code */}
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="col-form-label">
                                Employee Code
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="employeeCode"
                                value={formik.values.employeeCode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="BSM1234"
                              />
                              {formik.touched.employeeCode &&
                                formik.errors.employeeCode && (
                                  <div className="text-danger">
                                    {formik.errors.employeeCode}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Basic Info */}

                {/* Ozonetel Details */}
                <div className="accordion-item border-top rounded mb-3">
                  <div
                    className={`accordion-header ${
                      (formik.errors.agentId && formik.touched.agentId) ||
                      (formik.errors.campaignName &&
                        formik.touched.campaignName)
                        ? "bg-danger"
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
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              OzoneTel Agent Id
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="agentId"
                              value={formik.values.agentId}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.agentId &&
                              formik.errors.agentId && (
                                <div className="text-danger">
                                  {formik.errors.agentId}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Campaign List
                              <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <select
                                name="campaignName"
                                className="form-select"
                                value={formik.values.campaignName}
                                onChange={(e) => {
                                  // Update formik state and dispatch the filter
                                  formik.setFieldValue(
                                    "campaignName",
                                    e.target.value
                                  );
                                }}
                              >
                                <option value="">Select...</option>
                                {ozonetelcampaignNameList.map((name) => (
                                  <option key={name} value={name}>
                                    {name}
                                  </option>
                                ))}
                              </select>
                              <div className="input-group-text">
                                <i className="ti ti-pencil" />
                              </div>
                            </div>
                            {formik.touched.campaignName &&
                              formik.errors.campaignName && (
                                <div className="text-danger">
                                  {formik.errors.campaignName}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Ozonetel Details */}

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
                            <label className="col-form-label">Zipcode </label>
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

                {/* Access */}
                <div className="accordion-item border-top rounded mb-3">
                  <div
                    className={`accordion-header ${
                      formik.errors.status && formik.touched.status
                        ? "bg-danger"
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
                                  checked={
                                    formik?.values?.status === "inactive"
                                  } // Check based on current value
                                  onChange={formik?.handleChange}
                                  onBlur={formik?.handleBlur}
                                />
                                <label htmlFor="inactive">Inactive</label>
                              </div>
                            </div>
                            {formik?.touched?.status &&
                            formik?.errors?.status ? (
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

                <div className="d-flex align-items-center justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={mutationUpdate.isPending}
                  >
                    {mutationUpdate?.isPending ? "Updating" : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditUser;
