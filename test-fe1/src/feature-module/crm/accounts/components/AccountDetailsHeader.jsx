import React, { useState } from "react";
import { all_routes } from "../../../router/all_routes";
import { Link } from "react-router-dom";

const AccountDetailsHeader = ({ accountData: account }) => {
  const route = all_routes;

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-body pb-2">
          <h6 className="mb-3 fw-semibold">Basic Information</h6>

          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div className="d-flex align-items-center mb-2">
              <div>
                {/* Account Owner */}
                <p className="mb-1 text-capitalize">
                  <span className="fw-smibold"> Account Owner:</span>
                  <span className="fw-bold ms-2 text-black">
                    {account?.firstName} {account?.lastName}
                  </span>
                </p>

                {/* Company Information */}
                {account?.ofCompany?.name && (
                  <p className="mb-1 text-capitalize">
                    <span className="text-semibold">Company:</span>
                    <span className="ms-2">
                      <i className="ti ti-building me-1" />
                      <span className="text-black">
                        {" "}
                        {account?.ofCompany?.name}
                      </span>
                    </span>
                  </p>
                )}

                {/* Address Information */}
                {account?.address?.street &&
                  account?.address?.city &&
                  account?.address?.state &&
                  account?.address?.zipcode && (
                    <p className="text-capitalize">
                      <span className="text-semibold">Address:</span>
                      <span className="ms-2">
                        <i className="ti ti-map-pin me-1" />
                        {`${account.address.street}, ${account.address.city} ${account.address.state}, ${account.address.zipcode}`}
                      </span>
                    </p>
                  )}

                {/* Email Information */}
                {account?.email && (
                  <div className="d-flex align-items-center">
                    <span className="text-semibold">Email:</span>
                    <span className="ms-2">
                      <i className="ti ti-mail me-1 " />
                    </span>
                    <span className="text-black">
                      {account?.email || "N/A"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <div
                className={`badge badge-pill badge-status py-2 text-capitalize`}
                style={{
                  backgroundColor: `${account?.currentStatus?.color}`,
                }}
              >
                {account?.currentStatus?.name}
              </div>
              {/* <div className="contacts-action">
                <Link
                  to={route.accountDetails.replace(
                    ":id",
                    `edit/${account?._id}`
                  )}
                  className="btn-icon"
                >
                  <i className="ti ti-edit-circle" />
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsHeader;
