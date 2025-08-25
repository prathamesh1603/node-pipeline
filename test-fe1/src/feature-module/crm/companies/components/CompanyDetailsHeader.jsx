import React, { useState } from "react";
import { all_routes } from "../../../router/all_routes";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const CompanyDetailsHeader = ({ companyData: company }) => {
  const route = all_routes;

  return (
    <div className="col-md-12">
      {/* Contact User */}
      <div className="contact-head">
        <div className="row align-items-center">
          <div className="col-sm-6">
            <ul className="contact-breadcrumb">
              <li>
                <Link to={route.companies}>
                  <i className="ti ti-arrow-narrow-left" />
                  Companies
                </Link>
              </li>
              <li>{company?.name}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body pb-2">
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div className="d-flex align-items-center mb-2">
              {/* <div className="avatar avatar-xxl me-3 flex-shrink-0 border p-2">
                <ImageWithBasePath src={company?.logo} alt="Image" />
              </div> */}
              <div>
                <h5 className="mb-1">{company?.name}</h5>
                {company?.address?.street &&
                  company?.address?.city &&
                  company?.address?.state &&
                  company?.address?.zipcode && (
                    <p className="mb-2">
                      <i className="ti ti-map-pin-pin me-1"></i>
                      {`${company.address.street}, ${company.address.city} ${company.address.state}, ${company.address.zipcode}`}
                    </p>
                  )}

                {company?.rating && (
                  <p className="d-inline-flex align-items-center mb-0">
                    <i className="fa-solid fa-star text-warning me-1"></i>{" "}
                    {company?.rating}
                  </p>
                )}
              </div>
            </div>
            <div className="contacts-action">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="collapse-tooltip">Edit</Tooltip>}
              >
                <Link
                  to={route.companyDetails.replace(
                    ":id",
                    `edit/${company?._id}`
                  )}
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

export default CompanyDetailsHeader;
