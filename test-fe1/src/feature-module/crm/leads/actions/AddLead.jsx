import { Link } from "react-router-dom";
import Select from "react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  CREATED_SUCCESS_MSG,
  ERROR_MSG,
  REQUIRED_FIELD,
  SELECT_PRODUCT_CATEGORY_MSG,
  SELECT_PRODUCT_INTERESTED_MSG,
  VALID_EMAIL_MSG,
  VALID_MOBILE_MSG,
} from "../../../../core/data/constants/constant";
import { toast } from "react-toastify";
import LeadApi from "../api/LeadApi";
import { all_routes } from "../../../router/all_routes";
import { Lead } from "../models/LeadModel";
import { handleOffcanvasAction } from "../../../../utils/helpers/handleOffcanvasAction";
import RenderCompanyList from "../../../../core/common/crmComponents/RenderCompanyList";
import { isSuperAdmin } from "../../../../utils/helpers/helper";
import { useProductsData } from "../../products/hooks/useProductsData";

const AddLead = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const queryClient = useQueryClient();

  const mutationAdd = useMutation({
    mutationFn: LeadApi.addLead,
    onSuccess: () => {
      toast.success(CREATED_SUCCESS_MSG);
      queryClient.invalidateQueries("companies");
      formik.resetForm();
      handleOffcanvasAction("offcanvas_add", "hide");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || ERROR_MSG);
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
    leadSource: Yup.string(),
    description: Yup.string(),
    probability: Yup.string(),
    ofCompany: isSuperAdmin(user)
      ? Yup.string().required(REQUIRED_FIELD)
      : Yup.mixed().notRequired(),
    productInterested: Yup.object()
      .shape({
        name: Yup.string().required(SELECT_PRODUCT_INTERESTED_MSG),
        id: Yup.number(),
        _id: Yup.string(),
      })
      .required(REQUIRED_FIELD),
    mannualForm: Yup.string(),
    address: Yup.object({
      street: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zipcode: Yup.string(),
    }),
    leadSource: Yup.string(),
    referenceSource: Yup.string(),
    clientCode: Yup.string(),
    businessType: Yup.string(),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: new Lead(),
    validationSchema,
    onSubmit: (values) => {
      //
      mutationAdd.mutate(values); // Create lead
    },
  });

  const { data: products } = useProductsData({
    ofCompany: formik?.values?.ofCompany,
  });

  const productsData = products?.data?.data || [];

  const productCategories = productsData.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  const productNamesByCategory = productsData.reduce((acc, category) => {
    acc[category._id] = category.products.map((product) => ({
      name: product.name, // Display in the dropdown
      id: parseInt(product._id),
      _id: product._id,
    }));
    return acc;
  }, {});

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="fw-semibold">Add Lead</h5>
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
                    (formik.errors.firstName && formik.touched.firstName) ||
                    (formik.errors.lastName && formik.touched.lastName) ||
                    (formik.errors.email && formik.touched.email) ||
                    (formik.errors.mobile && formik.touched.mobile)
                      ? "bg-danger"
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
                            placeholder="John"
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
                            Last Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            placeholder="Doe"
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
                            placeholder="john@gmail.com"
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
                            placeholder="1234567890"
                            value={formik.values.mobile}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.mobile && formik.errors.mobile && (
                            <div className="text-danger">
                              {formik.errors.mobile}
                            </div>
                          )}
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
                            value={formik.values.leadSource}
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
                          <label className="col-form-label">Probability</label>
                          <select
                            name="probability"
                            className="form-select"
                            value={formik.values.probability}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            <option value="">Select Probability</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                          {formik.touched.probability &&
                          formik.errors.probability ? (
                            <div className="text-danger">
                              {formik.errors.probability}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Company List */}
                      <RenderCompanyList
                        formik={formik}
                        user={user}
                        colClass="col-md-6"
                      />

                      {/* Product Category Select Box */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Product Category
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            className="select2"
                            classNamePrefix="react-select"
                            options={productCategories} // Options for product categories
                            placeholder="Choose a product category"
                            name="productCategory"
                            value={
                              productCategories?.find(
                                (option) =>
                                  option.value === formik.values.productCategory
                              ) || null
                            }
                            onChange={(selectedOption) => {
                              formik.setFieldValue(
                                "productCategory",
                                selectedOption?.value
                              );
                              formik.setFieldValue("productInterested", null); // Reset productInterested on category change
                            }}
                            onBlur={() =>
                              formik.setFieldTouched("productCategory", true)
                            }
                          />
                          {formik.touched.productCategory &&
                          formik.errors.productCategory ? (
                            <div className="text-danger">
                              {formik.errors.productCategory &&
                                SELECT_PRODUCT_CATEGORY_MSG}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Product Name Select Box */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Product Name<span className="text-danger">*</span>
                          </label>
                          <Select
                            className="select2"
                            classNamePrefix="react-select"
                            options={
                              (productNamesByCategory &&
                              formik?.values?.productCategory
                                ? productNamesByCategory[
                                    formik.values.productCategory
                                  ]
                                : []) || []
                            }
                            placeholder="Choose a product name"
                            name="productInterested"
                            value={formik.values.productInterested || null} // Pass the full object to Select
                            onChange={(selectedOption) =>
                              formik.setFieldValue(
                                "productInterested",
                                selectedOption
                              )
                            } // Save the full object on selection
                            onBlur={() =>
                              formik.setFieldTouched("productInterested", true)
                            }
                            getOptionLabel={(option) => option.name} // Show product name in dropdown
                            getOptionValue={(option) => option._id} // Ensure unique value is used internally
                          />

                          {/* Show validation error */}
                          {formik.touched.productInterested &&
                          formik.errors.productInterested ? (
                            <div className="text-danger">
                              {formik.errors.productInterested.name}
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
                            placeholder="Enter additional details or notes here..."
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
                          <label className="col-form-label">Lead Source</label>
                          <select
                            name="leadSource"
                            className="form-select"
                            value={formik.values.leadSource}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            <option value="">-None-</option>
                            <option value="Google Ads">Google Ads</option>
                            <option value="Facebook Ads">Facebook Ads</option>
                            <option value="Website Lead">Website Lead</option>
                            <option value="Google Adwards">
                              Google Adwards
                            </option>
                            <option value="Youtube Channel Leads">
                              Youtube Channel Leads
                            </option>
                            <option value="User Create">User Create</option>
                            <option value="YTC Lead">YTC Lead</option>

                            <option value="BSR Lead Youtube Channel Lead">
                              BSR Lead Youtube Channel Lead
                            </option>
                          </select>
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
                          <select
                            name="businessType"
                            className="form-select"
                            value={formik.values.businessType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            <option value="">-None-</option>
                            <option value="B2C">B2C</option>
                          </select>
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
                          <input
                            type="text"
                            name="referenceSource"
                            className="form-control"
                            value={formik.values.referenceSource}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
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
                          <label className="col-form-label">Client Code </label>
                          <input
                            type="text"
                            name="clientCode"
                            className="form-control"
                            value={formik.values.clientCode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
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
            </div>

            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={mutationAdd.isPending}
              >
                {mutationAdd.isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddLead;
