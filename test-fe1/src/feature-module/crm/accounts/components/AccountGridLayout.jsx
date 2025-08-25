import React from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import { useDispatch } from "react-redux";
import { setSelectedId } from "../../../../core/data/redux/commonSlice";

const AccountGridLayout = ({ accountsData }) => {
  const route = all_routes;

  const dispatch = useDispatch();
  return (
    <div className="row">
      {accountsData?.map((account) => {
        return (
          <div className="col-xxl-3 col-xl-4 col-md-6">
            <div className="card border">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="d-flex flex-column">
                      <h6 className="text-black d-inline-flex align-items-center">
                        {account?.firstName} <span className="mx-1"></span>
                        {account?.lastName}
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
                        to={route.accountDetails.replace(
                          ":id",
                          `edit/${account?._id}`
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
                        to={route.accountDetails.replace(":id", account?._id)}
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
                      {account?.email}
                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-phone text-dark me-1" />
                      {account?.mobile}
                    </p>
                    <div
                      className={`badge badge-pill badge-status p-2`}
                      style={{
                        backgroundColor: `${account?.currentStatus?.color}`,
                      }}
                    >
                      {account?.currentStatus?.name}
                    </div>
                    {/* <p className="text-default d-inline-flex align-items-center">
                      <i className="ti ti-map-pin-pin text-dark me-1" />
                      {account?.address}
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

export default AccountGridLayout;
