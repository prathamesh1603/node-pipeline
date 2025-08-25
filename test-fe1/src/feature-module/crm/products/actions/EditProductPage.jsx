import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import ProductApi from "../api/productApi";
import {
  EDITED_SUCCESS_MSG,
  ERROR_MSG,
  MIN_LENGTH_VALIDATION,
  REQUIRED_FIELD,
} from "../../../../core/data/constants/constant";
import { useSelector } from "react-redux";
import { useProductData } from "../hooks/useProductData";
import { Product } from "../model/productModel";
import { isSuperAdmin } from "../../../../utils/helpers/helper";
import RenderCompanyList from "../../../../core/common/crmComponents/RenderCompanyList";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import { all_routes } from "../../../router/all_routes";

const EditProductPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.auth);
  const route = all_routes;
  const { id: productId } = useParams();
  const { productData, isLoading } = useProductData(productId);
  const { companyId: companyName } = useSelector((state) => state?.crms);

  const [editIndex, setEditIndex] = useState(null);

  const mutationUpdateProduct = useMutation({
    mutationFn: ({ id, productData }) =>
      ProductApi.updateproduct(id, productData),
    onSuccess: () => {
      toast.success(EDITED_SUCCESS_MSG);
      queryClient.invalidateQueries("products");
      navigate(route.products); // Navigate back to the products list
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.response?.data?.msg || ERROR_MSG);
    },
  });

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required(REQUIRED_FIELD)
      .min(3, MIN_LENGTH_VALIDATION({ field: "Category name", length: 3 })),
    products: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required(REQUIRED_FIELD),
        })
      )
      .min(1, "At least one product must be added."),
  });

  const formik = useFormik({
    initialValues: productData
      ? Product.fromApiResponse(productData)
      : new Product(),
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const hasChanges =
        values.name !== formik.initialValues.name ||
        values.products.length !== formik.initialValues.products.length || // Check for product addition/removal
        !values.products.every(
          (product, index) =>
            product.name === formik.initialValues.products[index]?.name
        );

      if (!hasChanges) {
        toast.warning("No changes detected. Please update the form.");
        return; // Prevent submission
      }

      mutationUpdateProduct.mutate({ id: productId, productData: values });
    },
  });

  const addProduct = () => {
    const productName = formik.values.productName.trim();

    if (!productName) {
      toast.error("Product name is required.");
      return;
    }

    const updatedProducts = [...formik.values.products];

    if (editIndex !== null) {
      updatedProducts[editIndex] = { name: productName };
      setEditIndex(null);
    } else {
      if (
        updatedProducts.some(
          (product) => product.name.toLowerCase() === productName.toLowerCase()
        )
      ) {
        toast.error("Product name already exists.");
        return;
      }
      updatedProducts.push({ name: productName });
    }

    formik.setFieldValue("products", updatedProducts);
    formik.setFieldValue("productName", ""); // Clear productName after adding
  };

  const editProduct = (index) => {
    const product = formik.values.products[index];
    formik.setFieldValue("productName", product.name); // Set value to the selected product
    setEditIndex(index);
  };

  const removeProduct = (index) => {
    const updatedProducts = formik.values.products.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("products", updatedProducts);
    if (editIndex === index) setEditIndex(null);
  };

  useEffect(() => {
    if (productData) {
      formik.setValues({
        ...formik.initialValues,
        ...productData,
      });
    }
  }, [productData]);

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
                <PageHeader pageName="Edit Product" />
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
                        Products
                      </div>
                    </li>
                    <li className="text-capitalize">{productData?.name}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Product Category <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-control text-capitalize"
                      placeholder="Enter category name"
                    />
                    <div className="input-group-text">
                      <i className="ti ti-pencil" />
                    </div>
                  </div>
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-danger">{formik.errors.name}</div>
                  )}
                </div>

                {/* company name */}
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="col-form-label">Company</label>
                    <div className="input-group">
                      <input
                        name="ofCompany"
                        className="form-control"
                        type="text"
                        value={companyName || "N/A"}
                        disabled
                      />
                      <div className="input-group-text">
                        <i className="ti ti-lock" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Name Field */}
                <div className="mb-3">
                  <label className="form-label">
                    Add Product <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      name="productName"
                      value={formik.values.productName}
                      onChange={formik.handleChange}
                      className="form-control"
                      placeholder="Enter product name"
                    />
                    <div className="input-group-text">
                      <i className="ti ti-pencil" />
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={addProduct}
                    >
                      {editIndex !== null ? "Update" : "Add"}
                    </button>
                  </div>
                </div>

                {/* Product List */}
                {formik.values.products.length > 0 && (
                  <ul className="list-group mt-3">
                    {formik.values.products.map((product, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => editProduct(index)}
                      >
                        <span className="flex-grow-1 text-capitalize">
                          {product.name}
                        </span>

                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeProduct(index);
                          }}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {formik.touched.products && formik.errors.products && (
                  <div className="text-danger mt-2">
                    {formik.errors.products}
                  </div>
                )}

                <div className="mt-4 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={mutationUpdateProduct?.isPending}
                  >
                    {mutationUpdateProduct?.isPending ? "Updating" : "Update"}
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

export default EditProductPage;
