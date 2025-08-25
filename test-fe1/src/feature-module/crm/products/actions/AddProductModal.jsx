import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import ProductApi from "../api/productApi";
import {
  CREATED_SUCCESS_MSG,
  ERROR_MSG,
  MIN_LENGTH_VALIDATION,
  REQUIRED_FIELD,
} from "../../../../core/data/constants/constant";
import { handleModalAction } from "../../../../utils/helpers/handleModalAction";
import RenderCompanyList from "../../../../core/common/crmComponents/RenderCompanyList";
import { isSuperAdmin } from "../../../../utils/helpers/helper";

const AddProductModal = () => {
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("user"));

  const mutationAddProduct = useMutation({
    mutationFn: ProductApi.addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries("products");
      toast.success(CREATED_SUCCESS_MSG);
      formik.resetForm(); // Reset form after successful submission
      handleModalAction("add_product", "hide");
    },
    onError: (error) => {
      console.error(error);
      toast.error((error.response?.data?.msg || ERROR_MSG).toUpperCase());
    },
  });

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required(REQUIRED_FIELD)
      .min(3, MIN_LENGTH_VALIDATION({ field: "Category name", length: 3 })),
    ofCompany: isSuperAdmin(user)
      ? Yup.string().required(REQUIRED_FIELD)
      : Yup.mixed().notRequired(),
    products: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required(REQUIRED_FIELD),
        })
      )
      .min(1, "At least one product must be added."),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      ofCompany: isSuperAdmin(user) ? "" : undefined,
      productName: "",
      products: [],
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      const submissionData = { ...values };
      if (!isSuperAdmin(user)) {
        delete submissionData.ofCompany;
      }

      mutationAddProduct.mutate(submissionData);
    },
  });

  const addProduct = () => {
    const productName = formik.values.productName?.trim();

    if (!productName) {
      toast.error("Product name is required.");
      return;
    }

    const isDuplicate = formik.values.products.some(
      (product) => product.name.toLowerCase() === productName.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("Product name already exists.");
      return;
    }

    // Add product to the array
    const updatedProducts = [
      ...formik.values.products,
      { name: productName }, // Add a valid product object
    ];
    formik.setFieldValue("products", updatedProducts); // Update `products` array
    formik.setFieldValue("productName", ""); // Clear the input field
    formik.setFieldTouched("products", true); // Mark products as touched
  };

  const removeProduct = (index) => {
    const updatedProducts = formik.values.products.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("products", updatedProducts);
  };

  return (
    <div className="modal fade" id="add_product" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Product</h5>
            <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
              <i className="ti ti-x" />
            </Link>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              {/* Category Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Product Category <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="form-control"
                  placeholder="Enter category name"
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-danger">{formik.errors.name}</div>
                )}
              </div>

              {/* Company List */}
              <RenderCompanyList
                formik={formik}
                user={user}
                colClass="col-12"
              />

              {/* Add Product */}
              <div className="mb-3">
                <label className="col-form-label">
                  Add Product <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    name="productName"
                    value={formik.values.productName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="form-control"
                    placeholder="Enter product name"
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addProduct}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Product List */}
              {formik?.values?.products?.length > 0 && (
                <ul className="list-group mt-3">
                  {formik.values.products.map((product, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {product?.name}
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => removeProduct(index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {formik.touched.products?.length === 0 &&
                formik.errors.products && (
                  <div className="text-danger mt-2">
                    {formik.errors.products}
                  </div>
                )}
            </div>

            <div className="modal-footer">
              <div className="d-flex align-items-center justify-content-end m-0">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={mutationAddProduct.isPending}
                >
                  {mutationAddProduct?.isPending ? "Creating" : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
