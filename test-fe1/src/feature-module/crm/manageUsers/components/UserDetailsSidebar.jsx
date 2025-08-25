import React, { useState } from "react";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { Link } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import { Button } from "antd";

const UserDetailsSidebar = ({ userData: user }) => {
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
              <p>{user?.email}</p>
            </div>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                <i className="ti ti-phone" />
              </span>
              <p>{user?.mobile}</p>
            </div>
            {user?.employeeCode && (
              <div className="d-flex align-items-center">
                <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                  <FaUserTie />{" "}
                </span>
                <p>{user?.employeeCode}</p>
              </div>
            )}
            {/* <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                <i className="ti ti-calendar-exclamation" />
              </span>
              <p>Created on 5 Jan 2024, 10:30 am</p>
            </div> */}
          </div>
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

          {/* <h6 className="mb-3 fw-semibold">Social Profile</h6>
          <ul className="social-info">
            <li>
              <Link to="#">
                <i className="fa-brands fa-youtube" />
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fa-brands fa-facebook-f" />
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fa-brands fa-instagram" />
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fa-brands fa-whatsapp" />
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fa-brands fa-pinterest" />
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fa-brands fa-linkedin" />
              </Link>
            </li>
          </ul> */}
          <hr />
          <h6 className="mb-3 fw-semibold">Settings</h6>
          <Button to="#" className="d-block mb-3 text-muted " disabled>
            <i className="ti ti-share-2 me-1" />
            Share user
          </Button>

          <Button
            to="#"
            className="d-block mb-0 text-muted"
            onClick={() => setOpenModal(true)}
            disabled
          >
            <i className="ti ti-trash-x me-1" />
            Delete user
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSidebar;
