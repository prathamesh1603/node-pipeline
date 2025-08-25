import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import UserApi from "../api/manageUserApi";
import { useFormik } from "formik";
import { User } from "../model/userModel";
import { toast } from "react-toastify";
import {
  COMPANY_EMPTY_MSG,
  CREATED_SUCCESS_MSG,
  ERROR_MSG,
  MIN_LENGTH_VALIDATION,
  REQUIRED_FIELD,
  ROLE_EMPTY_MSG,
  VALID_EMAIL_MSG,
  VALID_MOBILE_MSG,
  VALID_STATUS_MSG,
} from "../../../../core/data/constants/constant";
import { handleOffcanvasAction } from "../../../../utils/helpers/handleOffcanvasAction";
import RenderCompanyList from "../../../../core/common/crmComponents/RenderCompanyList";
import { isSuperAdmin } from "../../../../utils/helpers/helper";
import { useEffect, useState } from "react";
import CompanyApi from "../../companies/api/CompanyApi";

const AddUser = ({ roleNameArr }) => {
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("user"));
  const [ozonetelcampaignNameList, setCampaignNameList] = useState([]);

  const mutationAddUser = useMutation({
    mutationFn: UserApi.addUser,
    onSuccess: () => {
      toast.success(CREATED_SUCCESS_MSG);
      queryClient.invalidateQueries("users");
      formik.resetForm();
      handleOffcanvasAction("offcanvas_add", "hide");
    },
    onError: (error) => {
      toast.error((error.response?.data?.msg || ERROR_MSG).toUpperCase());
    },
  });

  const validationSchema = Yup.object({
    firstName: Yup.string().required(REQUIRED_FIELD),
    lastName: Yup.string().required(REQUIRED_FIELD),
    email: Yup.string().email(VALID_EMAIL_MSG).required(REQUIRED_FIELD),
    mobile: Yup.string()
      .matches(/^[0-9]+$/, VALID_MOBILE_MSG)
      .min(10)
      .max(10)
      .required(REQUIRED_FIELD),
    role: Yup.string()
      .required(REQUIRED_FIELD)
      .test("not-empty", ROLE_EMPTY_MSG, (value) => value?.trim().length > 0),
    ofCompany: isSuperAdmin(user)
      ? Yup.string().required(REQUIRED_FIELD)
      : Yup.mixed().notRequired(),
    address: Yup.object({
      street: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zipcode: Yup.string(),
    }),
    status: Yup.string()
      .oneOf(["active", "inactive"], VALID_STATUS_MSG)
      .required(REQUIRED_FIELD),
    agentId: Yup.string(),
    campaignName: Yup.string(),
    employeeCode: Yup.string()
      .min(7, MIN_LENGTH_VALIDATION({ field: "code", length: 7 }))
      .required(REQUIRED_FIELD),
  });

  const formik = useFormik({
    initialValues: new User(),
    validationSchema,
    onSubmit: (values) => {
      const combinedName = `${values.firstName} ${values.lastName}`;
      const userData = {
        ...values,
        name: combinedName,
        address: { ...values.address },
        status: values.status,
      };

      if (!isSuperAdmin(user)) {
        delete userData.ofCompany;
      }

      // Submit the userData to the API
      mutationAddUser.mutate(userData);
    },
  });

  async function getOzonetelCampaignName(params) {
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
    getOzonetelCampaignName();
  }, [formik.values.ofCompany]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large "
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="fw-semibold">Add New User</h5>
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
                            First Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
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
                            Last Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.lastName &&
                            formik.errors.lastName && (
                              <div className="text-danger">
                                {formik.errors.lastName}
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Email<span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.email && formik.errors.email && (
                            <div className="text-danger">
                              {formik.errors.email}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Phone<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="mobile"
                            value={formik.values.mobile}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            max={10}
                          />
                          {formik.touched.mobile && formik.errors.mobile && (
                            <div className="text-danger">
                              {formik.errors.mobile}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Role */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Role<span className="text-danger">*</span>
                          </label>
                          <select
                            name="role"
                            className="form-select select"
                            value={formik?.values?.role}
                            onChange={(e) => {
                              formik.setFieldValue(
                                "role",
                                e.target.value || ""
                              );
                            }}
                          >
                            <option value="">Select...</option>
                            {roleNameArr?.map((role, index) => {
                              //
                              return (
                                <option
                                  key={index}
                                  value={role?.value}
                                  className="text-capitalize"
                                >
                                  {role?.label}
                                </option>
                              );
                            })}
                          </select>

                          {formik.touched.role && formik.errors.role && (
                            <div className="text-danger">
                              {formik.errors.role}
                            </div>
                          )}
                        </div>
                      </div>

                      <RenderCompanyList
                        formik={formik}
                        user={user}
                        colClass="col-md-6"
                      />

                      {/* Employee code */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Employee Code<span className="text-danger">*</span>
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
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          OzoneTel Agent Id
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="agentId"
                          value={formik.values.agentId}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.agentId && formik.errors.agentId && (
                          <div className="text-danger">
                            {formik.errors.agentId}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Campaign List</label>
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

            <div className="d-flex align-items-center justify-content-end">
              <Link
                to="#"
                className="btn btn-light me-2"
                data-bs-dismiss="offcanvas"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={mutationAddUser.isPending}
              >
                {mutationAddUser.isPending ? "Creating" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddUser;
