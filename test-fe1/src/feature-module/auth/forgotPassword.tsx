import React from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link } from 'react-router-dom'
import { all_routes } from "../router/all_routes";

const ForgotPassword = () => {
  const route = all_routes;
  return (
    <div className="account-content">
  <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-03">
    <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-50 bg-backdrop">
      <form className="flex-fill">
        <div className="mx-auto mw-450">
          <div className="text-center mb-4">
            <ImageWithBasePath src="assets/img/logo.svg" className="img-fluid" alt="Logo" />
          </div>
          <div className="mb-4">
            <h4 className="mb-2 fs-20">Forgot Password?</h4>
            <p>
              If you forgot your password, well, then we’ll email you
              instructions to reset your password.
            </p>
          </div>
          <div className="mb-3">
            <label className="col-form-label">Email Address</label>
            <div className="position-relative">
              <span className="input-icon-addon">
                <i className="ti ti-mail" />
              </span>
              <input type="text" defaultValue="" className="form-control" />
            </div>
          </div>
          <div className="mb-3">
            
            <Link to={route.login} className="btn btn-primary  w-100">
                  Submit
                </Link>
          </div>
          <div className="mb-3 text-center">
            <h6>
              Return to{" "}
              <Link to={route.login} className="text-purple link-hover">
                {" "}
                Login
              </Link>
            </h6>
          </div>
          <div className="form-set-login or-text mb-3">
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
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

  );
};

export default ForgotPassword;
