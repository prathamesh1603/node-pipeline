import React, { useState } from "react";
import { all_routes } from "../../../router/all_routes";
import { Link, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const UserDetailsHeader = ({ userData: user }) => {
  const route = all_routes;

  const navigate = useNavigate();

  return (
    <div className="col-md-12">
      {/* Contact User */}
      <div className="contact-head">
        <div className="row align-items-center">
          <div className="col-sm-6">
            <ul className="contact-breadcrumb">
              <li>
                <div onClick={() => navigate(-1)} className="navigate-link">
                  <i className="ti ti-arrow-narrow-left" />
                  Users
                </div>
              </li>
              <li>{user?.name}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body pb-2">
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div className="d-flex align-items-center mb-2">
              {/* <div className="avatar avatar-xxl me-3 flex-shrink-0 border p-2">
                <ImageWithBasePath src={user?.logo} alt="Image" />
              </div> */}
              <div>
                <div>
                  <h5 className="mb-1">{user?.name}</h5>
                  {user?.address?.street &&
                    user?.address?.city &&
                    user?.address?.state &&
                    user?.address?.zipcode && (
                      <p className="mb-2">
                        <i className="ti ti-map-pin-pin me-1"></i>
                        {`${user.address.street}, ${user.address.city} ${user.address.state}, ${user.address.zipcode}`}
                      </p>
                    )}

                  {user?.rating && (
                    <p className="d-inline-flex align-items-center mb-0">
                      <i className="fa-solid fa-star text-warning me-1"></i>{" "}
                      {user?.rating}
                    </p>
                  )}
                </div>

                {user?.role?.name && (
                  <p className="mb-2">
                    <span className="fw-bold">Role:</span>{" "}
                    <span className="text-capitalize">
                      {user?.role?.name?.split("-").join(" ")}
                    </span>{" "}
                  </p>
                )}
                {user?.ofCompany?.name && (
                  <p className="mb-2">
                    <span className="fw-bold">Company:</span>{" "}
                    {user?.ofCompany?.name}
                  </p>
                )}
              </div>
            </div>
            <div className="contacts-action">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="collapse-tooltip">Edit User</Tooltip>}
              >
                <Link
                  to={route.userDetails.replace(":id", `edit/${user?._id}`)}
                  className="btn-icon"
                >
                  <i className="ti ti-edit-circle" />
                </Link>
              </OverlayTrigger>
            </div>
          </div>
        </div>
      </div>
      {/* /Contact User */}
    </div>
  );
};

export default UserDetailsHeader;
