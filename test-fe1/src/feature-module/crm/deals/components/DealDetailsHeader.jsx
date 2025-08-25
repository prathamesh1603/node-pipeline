import React, { useState } from "react";
import { all_routes } from "../../../router/all_routes";
import { Link, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const DealDetailsHeader = ({ dealData: deal, view, setView }) => {
  const route = all_routes;
  const navigate = useNavigate();

  return (
    <div className="col-md-12">
      <div className="row mb-3">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="col-auto">
            <ul className="contact-breadcrumb">
              <li>
                <div onClick={() => navigate(-1)} className="navigate-link">
                  <i className="ti ti-arrow-narrow-left text-capitalize me-1" />
                  Deals
                </div>
              </li>
            </ul>
          </div>
          <div className="col-auto">
            <div className="toggle-buttons-container">
              <button
                className={`btn ${
                  view === "overview" ? "btn-primary" : "btn-light"
                }`}
                onClick={() => setView("overview")} // Correctly handle view change
              >
                Overview
              </button>
              <button
                className={`btn ${
                  view === "timeline" ? "btn-primary" : "btn-light"
                }`}
                onClick={() => setView("timeline")} // Correctly handle view change
              >
                Timeline
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body pb-2">
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div className="d-flex align-items-center mb-2">
              {/* <div className="avatar avatar-xxl me-3 flex-shrink-0 border p-2">
                <ImageWithBasePath src={deal?.logo} alt="Image" />
              </div> */}
              <div>
                <h5 className="mb-1 text-capitalize">
                  <span className="text-grey">Deal Name:</span>
                  <span className="ms-1">
                    {deal?.firstName} {deal?.lastName}
                  </span>
                </h5>

                {deal?.ofCompany?.name && (
                  <p className="mb-1 text-capitalize">
                    <span className="text-grey">Company:</span>
                    <span className="ms-1">
                      <i className="ti ti-building me-1" />
                      {deal?.ofCompany?.name}
                    </span>
                  </p>
                )}

                {deal?.address?.street &&
                  deal?.address?.city &&
                  deal?.address?.state &&
                  deal?.address?.zipcode && (
                    <p className="mb-0 text-capitalize">
                      <i className="ti ti-map-pin-pin me-1" />
                      {`${deal.address.street}, ${deal.address.city} ${deal.address.state}, ${deal.address.zipcode}`}
                    </p>
                  )}
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <div
                className={`badge badge-pill badge-status py-2 text-capitalize`}
                style={{
                  backgroundColor: `${deal?.currentStatus?.color}`,
                }}
              >
                {deal?.currentStatus?.name}
              </div>
              <div className="contacts-action">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="collapse-tooltip">Edit Deal</Tooltip>}
                >
                  <Link
                    to={route.dealsDetails.replace(":id", `edit/${deal?._id}`)}
                    className="btn-icon"
                  >
                    <i className="ti ti-edit-circle" />
                  </Link>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Contact User */}
    </div>
  );
};

export default DealDetailsHeader;
