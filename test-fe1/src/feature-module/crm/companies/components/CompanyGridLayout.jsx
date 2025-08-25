import React from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import { useDispatch } from "react-redux";

const CompanyGridLayout = ({ companiesData }) => {
  const route = all_routes;

  const dispatch = useDispatch();
  return (
    <div className="row">
      {companiesData?.map((company) => {
        return (
          <div className="col-xxl-3 col-xl-4 col-md-6">
            <div className="card border h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-3">
                  <div className="d-flex align-items-center">
                    {/* <Link
                      to={route.companyDetails}
                      className="avatar avatar-lg border rounded flex-shrink-0 me-2"
                    >
                      <ImageWithBasePath
                        src={company?.logo}
                        className="w-auto h-auto"
                        alt="img"
                      />
                    </Link> */}
                    <div>
                      <h6>
                        <Link to={route.companyDetails} className="fw-medium">
                          {company?.name}
                        </Link>
                      </h6>
                      <div className="set-star text-default">
                        <i className="fa fa-star filled me-1" />
                        {company?.rating}
                      </div>
                    </div>
                  </div>
                  <div className="dropdown table-action">
                    <Link
                      to="#"
                      className="action-icon"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa fa-ellipsis-v" />
                    </Link>
                    <div className="dropdown-menu dropdown-menu-right">
                      <Link
                        className="dropdown-item"
                        to={route.companyDetails.replace(
                          ":id",
                          `edit/${company?._id}`
                        )}
                      >
                        <i className="ti ti-edit text-blue" /> Edit
                      </Link>
                      {/* <Link
                        className="dropdown-item"
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#delete_contact"
                      >
                        <i className="ti ti-trash text-danger" /> Delete
                      </Link> */}
                      <Link
                        className="dropdown-item"
                        to={route.companyDetails.replace(":id", company?._id)}
                      >
                        <i className="ti ti-eye text-blue-light" /> Preview
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="d-block">
                  <div className="d-flex flex-column mb-3">
                    <p className="text-default d-inline-flex align-items-center mb-2 d-flex flex-wrap">
                      <i className="ti ti-mail text-dark me-1" />
                      {company?.email}
                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-phone text-dark me-1" />
                      {company?.mobile}
                    </p>
                    {/* <p className="text-default d-inline-flex align-items-center">
                      <i className="ti ti-map-pin-pin text-dark me-1" />
                      {company?.address}
                    </p> */}
                  </div>
                  {/* <div className="d-flex align-items-center">
                    <span className="badge badge-tag badge-success-light me-2">
                      Collab
                    </span>
                    <span className="badge badge-tag badge-warning-light">
                      Rated
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CompanyGridLayout;
