import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  COMPANY_ADMIN,
  SUPER_ADMIN,
  CALLER,
} from "../../core/data/constants/constant";
import { signupForm } from "../../core/data/redux/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, user, errorMsg } = useSelector((state) => state?.auth);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    mobile: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Dispatch form values to Redux action
      dispatch(signupForm(values));
      navigate("/dashboard/leads-dashboard");
    },
  });

  return (
    <div className="account-content">
      <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-02">
        <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-50 bg-backdrop">
          <form className="flex-fill" onSubmit={formik.handleSubmit}>
            <div className="mx-auto mw-450">
              <div className="text-center mb-4">
                <ImageWithBasePath
                  src="assets/img/logo.svg"
                  className="img-fluid"
                  alt="Logo"
                />
              </div>
              <div className="mb-4">
                <h4 className="mb-2 fs-20">Register</h4>
                <p>Create new CRMS account</p>
              </div>

              {/* Name */}
              <div className="mb-3">
                <label className="col-form-label">Name</label>
                <div className="position-relative">
                  <span className="input-icon-addon">
                    <i className="ti ti-user" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-danger">{formik.errors.name}</div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="col-form-label">Email Address</label>
                <div className="position-relative">
                  <span className="input-icon-addon">
                    <i className="ti ti-mail" />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-danger">{formik.errors.email}</div>
                  )}
                </div>
              </div>
              {/* Password */}
              <div className="mb-3">
                <label className="col-form-label">Password</label>
                <div className="pass-group">
                  <input
                    type={passwordVisibility.password ? "text" : "password"}
                    className="pass-input form-control"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span
                    className={`ti toggle-passwords ${
                      passwordVisibility.password ? "ti-eye" : "ti-eye-off"
                    }`}
                    onClick={() => togglePasswordVisibility("password")}
                  ></span>
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-danger">{formik.errors.password}</div>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="col-form-label">Confirm Password</label>
                <div className="pass-group">
                  <input
                    type={
                      passwordVisibility.confirmPassword ? "text" : "password"
                    }
                    className="pass-input form-control"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span
                    className={`ti toggle-passwords ${
                      passwordVisibility.confirmPassword
                        ? "ti-eye"
                        : "ti-eye-off"
                    }`}
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  ></span>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <div className="text-danger">
                        {formik.errors.confirmPassword}
                      </div>
                    )}
                </div>
              </div>

              {/* Mobile */}
              <div className="mb-3">
                <label className="col-form-label">Mobile</label>
                <div className="position-relative">
                  <span className="input-icon-addon">
                    <i className="ti ti-phone" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    name="mobile"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.mobile && formik.errors.mobile && (
                    <div className="text-danger">{formik.errors.mobile}</div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mb-3">
                <button className="btn btn-primary w-100" type="submit">
                  {status === "loading" ? "Creating account..." : "Sign Up"}
                </button>
                {status === "failed" && (
                  <div className="text-danger">{errorMsg}</div>
                )}
              </div>
              <div className="mb-3">
                <h6>
                  Already have an account?{" "}
                  <Link to={"/"} className="text-purple link-hover">
                    Sign In Instead
                  </Link>
                </h6>
              </div>

              {/* <div className="form-set-login or-text mb-3">
                <h4>OR</h4>
              </div>
              <div className="d-flex align-items-center justify-content-center flex-wrap mb-3">
                <div className="text-center me-2 flex-fill">
                  <Link
                    to="#"
                    className="br-10 p-2 px-4 btn bg-pending  d-flex align-items-center justify-content-center"
                  >
                    <ImageWithBasePath
                      className="img-fluid m-1"
                      src="assets/img/icons/facebook-logo.svg"
                      alt="Facebook"
                    />
                  </Link>
                </div>
                <div className="text-center me-2 flex-fill">
                  <Link
                    to="#"
                    className="br-10 p-2 px-4 btn bg-white d-flex align-items-center justify-content-center"
                  >
                    <ImageWithBasePath
                      className="img-fluid  m-1"
                      src="assets/img/icons/google-logo.svg"
                      alt="Facebook"
                    />
                  </Link>
                </div>
                <div className="text-center flex-fill">
                  <Link
                    to="#"
                    className="bg-dark br-10 p-2 px-4 btn btn-dark d-flex align-items-center justify-content-center"
                  >
                    <ImageWithBasePath
                      className="img-fluid  m-1"
                      src="assets/img/icons/apple-logo.svg"
                      alt="Apple"
                    />
                  </Link>
                </div>
              </div>
              <div className="text-center">
                <p className="fw-medium text-gray">Copyright © 2024 - CRMS</p>
              </div> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
