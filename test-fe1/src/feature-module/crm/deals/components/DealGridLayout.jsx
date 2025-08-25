import React from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import { useDispatch } from "react-redux";

const DealGridLayout = ({ dealsData }) => {
  const route = all_routes;

  const dispatch = useDispatch();
  return (
    <div className="row">
      {dealsData?.map((deal) => {
        return (
          <div className="col-xxl-3 col-xl-4 col-md-6 mb-4" key={deal?._id}>
            <div className="card border h-100">
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="d-flex flex-column">
                      <h6 className="text-black d-inline-flex align-items-center">
                        <Link
                          className="text-decoration-underline text-capitalize nav-link"
                          to={route.dealsDetails.replace(":id", deal?._id)}
                        >
                          {deal?.firstName} <span className="mx-1"></span>
                          {deal?.lastName}
                        </Link>
                      </h6>
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
                        to={route.dealsDetails.replace(
                          ":id",
                          `edit/${deal?._id}`
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
                        to={route.dealsDetails.replace(":id", deal?._id)}
                      >
                        <i className="ti ti-eye text-blue-light" /> Preview
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="d-block">
                  <div className="d-flex flex-column mb-3">
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-mail text-dark me-1" />
                      {deal?.email}
                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-phone text-dark me-1" />
                      {deal?.mobile}
                    </p>
                  </div>
                </div>
                <div
                  className={`badge badge-pill badge-status p-2 mt-auto text-capitalize`}
                  style={{
                    backgroundColor: `${deal?.currentStatus?.color}`,
                  }}
                >
                  {deal?.currentStatus?.name}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DealGridLayout;
