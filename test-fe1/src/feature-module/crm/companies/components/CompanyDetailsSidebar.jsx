import React, { useState } from "react";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { Link } from "react-router-dom";
import { getUrlIconClass } from "../../../../utils/helpers/getUrlIconClass";

const CompanyDetailsSidebar = ({ companyData: company }) => {
  const route = all_routes;
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="col-xl-12 theiaStickySidebar">
      <div className="card">
        <div className="card-body p-3">
          <h6 className="mb-3 fw-semibold">Basic Information</h6>
          <div className="mb-3">
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                <i className="ti ti-mail" />
              </span>
              <p>{company?.email}</p>
            </div>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                <i className="ti ti-phone" />
              </span>
              <p>{company?.mobile}</p>
            </div>
            {/* <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                <i className="ti ti-calendar-exclamation" />
              </span>
              <p>Created on 5 Jan 2024, 10:30 am</p>
            </div> */}
          </div>
          <hr />
          {/* <h6 className="mb-3 fw-semibold">Other Information</h6> */}
          {/* <ul>
            <li className="row mb-3">
              <span className="col-6">Language</span>
              <span className="col-6">English</span>
            </li>
            <li className="row mb-3">
              <span className="col-6">Currency</span>
              <span className="col-6">United States dollar</span>
            </li>
            <li className="row mb-3">
              <span className="col-6">Last Modified</span>
              <span className="col-6">27 Sep 2023, 11:45 pm</span>
            </li>
            <li className="row mb-3">
              <span className="col-6">Source</span>
              <span className="col-6">Paid Campaign</span>
            </li>
          </ul> */}
          {/* <hr /> */}
          {/* <h6 className="mb-3 fw-semibold">Tags</h6> */}
          {/* <div className="mb-3">
            <Link to="#" className="badge badge-soft-success fw-medium me-2">
              Collab
            </Link>
            <Link to="#" className="badge badge-soft-warning fw-medium mb-0">
              Rated
            </Link>
          </div>
          <hr /> */}

          {company?.socialProfiles?.length > 0 && (
            <>
              <h6 className="mb-3 fw-semibold">Social Profile</h6>
              <ul className="social-info">
                {company?.socialProfiles?.map((url, index) => {
                  const iconClass = getUrlIconClass(url);
                  return (
                    iconClass && (
                      <li key={index}>
                        <Link
                          to={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className={iconClass} />
                        </Link>
                      </li>
                    )
                  );
                })}
              </ul>
            </>
          )}

          <hr />
          <h6 className="mb-3 fw-semibold">Settings</h6>
          <Link to="#" className="d-block mb-3 text-muted">
            <i className="ti ti-share-2 me-1" />
            Share Company
          </Link>

          <Link
            to="#"
            className="d-block mb-0 text-muted"
            onClick={() => setOpenModal(true)}
          >
            <i className="ti ti-trash-x me-1" />
            Delete Company
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsSidebar;
