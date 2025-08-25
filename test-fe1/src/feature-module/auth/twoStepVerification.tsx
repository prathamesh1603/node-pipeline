import React from 'react'
import ImageWithBasePath from '../../core/common/imageWithBasePath'
import { all_routes } from '../router/all_routes';
import { Link } from 'react-router-dom';

const TwoStepVerification = () => {
  const route = all_routes;
  return (
    <div className="account-content">
  <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-04">
    <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-50 bg-backdrop">
      <form
        method="get"
        className="digit-group login-form-control"
        data-group-name="digits"
        data-autosubmit="false"
        autoComplete="off"
      >
        <div className="mx-auto mw-450">
          <div className="text-center mb-4">
            <ImageWithBasePath src="assets/img/logo.svg" className="img-fluid" alt="Logo" />
          </div>
          <div className="mb-4">
            <h4 className="mb-2 fs-20">Login With Your Email Address</h4>
            <p>
              We sent a verification code to your email. Enter the code from the
              email in the field below
            </p>
          </div>
          <div className="d-flex align-items-center mb-4">
            <input
              type="text"
              className="border rounded w-100 py-sm-3 py-2 text-center fs-26 hw-bold me-3"
              id="digit-1"
              name="digit-1"
              data-next="digit-2"
              maxLength={1}
            />
            <input
              type="text"
              className="border rounded w-100 py-sm-3 py-2 text-center fs-26 hw-bold me-3"
              id="digit-2"
              name="digit-2"
              data-next="digit-3"
              data-previous="digit-1"
              maxLength={1}
            />
            <input
              type="text"
              className="border rounded w-100 py-sm-3 py-2 text-center fs-26 hw-bold me-3"
              id="digit-3"
              name="digit-3"
              data-next="digit-4"
              data-previous="digit-2"
              maxLength={1}
            />
            <input
              type="text"
              className="border rounded w-100 py-sm-3 py-2 text-center fs-26 hw-bold"
              id="digit-4"
              name="digit-4"
              data-next="digit-5"
              data-previous="digit-3"
              maxLength={1}
            />
          </div>
          <div className="text-center mb-3">
            <p className="badge badge-soft-purple shadow-none">
              Otp will expire in 09 :10
            </p>
          </div>
          <div className="mb-3">
            <Link to={route.dealsDashboard} className="btn btn-primary w-100">Verify My Account</Link>
          </div>
          <div className="text-center">
            <p className="fw-medium text-gray">Copyright © 2024 - CRMS</p>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

  )
}

export default TwoStepVerification