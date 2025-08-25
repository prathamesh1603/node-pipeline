import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { all_routes } from "../router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import { resetAuthState, resetForm } from "../../core/data/redux/authSlice";

// type PasswordField = "password" | "confirmPassword" | "newPassword";

const ResetPassword = () => {
  const route = all_routes;
  const dispatch = useDispatch();
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const { status, user, errorMsg } = useSelector((state) => state?.auth);
  const navigate = useNavigate();

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      dispatch(resetForm(values));
    },
  });

  useEffect(() => {
    if (status === "success") {
      if (user?.role?.name !== "caller") {
        navigate(route.leadsDashboard);
      } else {
        navigate(route.leads);
      }
    } else {
      navigate(route.resetPassword);
    }
  }, [status]);

  return (
    <div className="account-content">
      <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-04">
        <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-50 bg-backdrop">
          <form onSubmit={formik.handleSubmit} className="flex-fill">
            <div className="mx-auto mw-450">
              <div className="text-center mb-4">
                <ImageWithBasePath
                  src="assets/img/bsm/logo.png"
                  className="img-fluid w-50 h-50"
                  alt="Logo"
                />
              </div>
              <div className="mb-4">
                <h4 className="mb-2 fs-20">Reset Password?</h4>
                <p>Enter New Password &amp; Confirm Password to get inside</p>
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label className="col-form-label">New Password</label>
                <div className="pass-group">
                  <input
                    type={passwordVisibility.password ? "text" : "password"}
                    className={`form-control ${
                      formik.touched.password && formik.errors.password
                        ? "is-invalid"
                        : ""
                    }`}
                    name="password"
                    value={formik.values.password}
                    onChange={(e) => {
                      // Trim spaces and update the Formik state
                      formik.setFieldValue("password", e.target.value.trim());
                    }}
                    onBlur={formik.handleBlur}
                  />
                  <span
                    className={`ti toggle-passwords ${
                      passwordVisibility.password ? "ti-eye" : "ti-eye-off"
                    }`}
                    onClick={() => togglePasswordVisibility("password")}
                  ></span>
                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-feedback">
                      {formik.errors.password}
                    </div>
                  )}
                </div>
              </div>

              {/* New Confirm Password Field */}
              <div className="mb-3">
                <label className="col-form-label">Confirm New Password</label>
                <div className="pass-group">
                  <input
                    type={
                      passwordVisibility.confirmPassword ? "text" : "password"
                    }
                    className={`form-control ${
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                        ? "is-invalid"
                        : ""
                    }`}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={(e) => {
                      // Trim spaces and update the Formik state
                      formik.setFieldValue(
                        "confirmPassword",
                        e.target.value.trim()
                      );
                    }}
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
                      <div className="invalid-feedback">
                        {formik.errors.confirmPassword}
                      </div>
                    )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mb-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={status === "loading"}
                >
                  {status === "loading"
                    ? "Changing Password..."
                    : "Change Password"}
                </button>

                {status === "failed" && (
                  <div className="text-danger">{errorMsg}</div>
                )}
              </div>

              {/* Back to Login Link */}
              <div className="mb-3 text-center">
                <h6>
                  Return to{" "}
                  <Link to={route.login} className="text-purple link-hover">
                    {" "}
                    Login
                  </Link>
                </h6>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
