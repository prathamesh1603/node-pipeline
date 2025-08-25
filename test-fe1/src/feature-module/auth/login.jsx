import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import { loginForm, resetAuthState } from "../../core/data/redux/authSlice";
import { toast } from "react-toastify";
import {
  ERROR_MSG,
  PASSWORD_MIN_LENGTH_MSG,
  REQUIRED_FIELD,
  VALID_EMAIL_MSG,
} from "../../core/data/constants/constant";

const Login = () => {
  const route = all_routes;
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const { status, user, errorMsg, isLoggedIn } = useSelector(
    (state) => state?.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
  }, []);

  //

  useEffect(() => {
    if (isLoggedIn) {
      if (user?.autoGenratedPassword) {
        navigate(route.resetPassword);
      } else if (user?.role?.name !== "caller") {
        navigate(route.leadsDashboard);
      } else {
        navigate(route.leads);
      }
      dispatch(resetAuthState());
    } else {
      navigate(route.login);
    }
  }, [user, navigate, status]);

  useEffect(() => {
    if (status === "failed" && errorMsg) {
      toast.error(errorMsg);
    }
  }, [status, errorMsg]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(VALID_EMAIL_MSG)
        .transform((value) => value.toLowerCase())
        .required(REQUIRED_FIELD),
      password: Yup.string()
        .min(4, PASSWORD_MIN_LENGTH_MSG)
        .required(REQUIRED_FIELD),
    }),
    onSubmit: (values) => {
      dispatch(loginForm(values));
    },
  });

  return (
    <>
      <div className="account-content">
        <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-01">
          <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-50 bg-backdrop">
            <form className="flex-fill" onSubmit={formik.handleSubmit}>
              <div className="mx-auto mw-450">
                <div className="text-center mb-4">
                  <ImageWithBasePath
                    src="assets/img/bsm/crm_logo.png"
                    className="img-fluid w-50 h-50"
                    alt="Logo"
                  />
                </div>
                <div className="mb-4">
                  <h4>Sign In</h4>
                  <p>Access the CRMS panel using your email and passcode.</p>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="col-form-label">Email Address</label>
                  <div className="position-relative">
                    <span className="input-icon-addon">
                      <i className="ti ti-mail"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-danger">{formik.errors.email}</div>
                  ) : null}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="col-form-label">Password</label>
                  <div className="pass-group">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      className="pass-input form-control"
                      name="password"
                      value={formik.values.password}
                      onChange={(e) => {
                        // Trim spaces and update the formik value
                        formik.setFieldValue("password", e.target.value.trim());
                      }}
                      onBlur={formik.handleBlur}
                    />
                    <span
                      className={`ti toggle-password ${
                        isPasswordVisible ? "ti-eye" : "ti-eye-off"
                      }`}
                      onClick={togglePasswordVisibility}
                    ></span>
                  </div>
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-danger">{formik.errors.password}</div>
                  ) : null}
                </div>

                <div className="mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Logging in..." : "Sign In"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
