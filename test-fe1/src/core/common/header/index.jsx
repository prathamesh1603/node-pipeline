import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ImageWithBasePath from "../imageWithBasePath";
import { all_routes } from "../../../feature-module/router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import {
  setExpandMenu,
  setMiniSidebar,
  setMobileSidebar,
} from "../../data/redux/commonSlice";
import { logoutUser } from "../../data/redux/authSlice";
import { QueryClient } from "@tanstack/react-query";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Header = () => {
  const route = all_routes;
  const location = useLocation();
  const dispatch = useDispatch();
  const { mobileSidebar, miniSidebar } = useSelector((state) => state.crms);
  const { user } = useSelector((state) => state?.auth);
  const queryClient = new QueryClient();

  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };
  const toggleMiniSidebar = () => {
    dispatch(setMiniSidebar(!miniSidebar));
  };
  const toggleExpandMenu = () => {
    dispatch(setExpandMenu(true));
  };
  const toggleExpandMenu2 = () => {
    dispatch(setExpandMenu(false));
  };

  const [layoutBs, setLayoutBs] = useState(localStorage.getItem("dataTheme"));
  const isLockScreen = location.pathname === "/lock-screen";

  const handleLogout = () => {
    queryClient.clear();
    dispatch(logoutUser());
    // window.location.reload();
  };

  if (isLockScreen) {
    return null;
  }
  // const LayoutDark = () => {
  //   localStorage.setItem("dataTheme", "dark");
  //   document.documentElement.setAttribute("data-theme", "dark");
  //   setLayoutBs("dark");
  // };
  // const LayoutLight = () => {
  //   localStorage.setItem("dataTheme", "light");
  //   document.documentElement.setAttribute("data-theme", "light");
  //   setLayoutBs("light");
  // };

  return (
    <>
      {/* Header */}
      <div className="header">
        {/* Logo */}
        <div
          className="header-left active"
          onMouseEnter={toggleExpandMenu}
          onMouseLeave={toggleExpandMenu2}
        >
          <Link to={route.dealsDashboard} className="logo logo-normal">
            {/* {layoutBs === "dark" ? (
              <>
                <ImageWithBasePath
                  src="assets/img/white-logo.svg"
                  className="white-logo"
                  alt="Logo"
                />
              </>
            ) : (
              <ImageWithBasePath src="assets/img/logo.svg" alt="Logo" />
            )} */}
            <ImageWithBasePath src="assets/img/bsm/logo.png" alt="Logo" />
            <ImageWithBasePath
              src="assets/img/bsm/logo.png"
              className="white-logo"
              alt="Logo"
            />
          </Link>
          <Link to={route.dealsDashboard} className="logo-small">
            <ImageWithBasePath src="assets/img/bsm/logo.png" alt="Logo" />
          </Link>
          <div id="toggle_btn" to="#" onClick={toggleMiniSidebar} role="button">
            <i className="ti ti-arrow-bar-to-left" />
          </div>
        </div>
        {/* /Logo */}
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#sidebar"
          onClick={toggleMobileSidebar}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        <div className="header-user">
          <ul className="nav user-menu">
            {/* Nav List */}
            <li className="nav-item nav-list ms-auto">
              <ul className="nav">
                {/* <li className="dark-mode-list">
                  <Link
                    to="#"
                    className={`dark-mode-toggle ${layoutBs ? "" : "active"}`}
                    id="dark-mode-toggle"
                  >
                    <i
                      className={`ti ti-sun light-mode ${
                        layoutBs === "dark" ? "" : "active"
                      }`}
                      onClick={LayoutLight}
                    >
                      {" "}
                    </i>
                    <i
                      className={`ti ti-moon dark-mode ${
                        layoutBs === "dark" ? "active" : ""
                      }`}
                      onClick={LayoutDark}
                    ></i>
                  </Link>
                </li> */}
                <li className="nav-item dropdown">
                  <Link
                    to="#"
                    className="btn btn-header-list"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-layout-grid-add" />
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end menus-info">
                    <div className="row">
                      <div className="col-md-6">
                        <ul className="menu-list">
                          <li>
                            <Link to={route.leads}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-secondary">
                                  <i className="ti ti-chart-arcs" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Leads</p>
                                  <span>Add New Leads</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.deals}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-info">
                                  <i className="ti ti-medal" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Deals</p>
                                  <span>Add New Deals</span>
                                </div>
                              </div>
                            </Link>
                          </li>

                          <li>
                            <Link to={route.companies}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-tertiary">
                                  <i className="ti ti-building-community" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Company</p>
                                  <span>Add New Company</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul className="menu-list">
                          <li>
                            <Link to={route.accounts}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-violet">
                                  <i className="ti ti-user-up" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Accounts</p>
                                  <span>Add New Account</span>
                                </div>
                              </div>
                            </Link>
                          </li>

                          <li>
                            <Link to={route.products}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-danger">
                                  <i className="ti ti-atom-2" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Products</p>
                                  <span>Add New Product</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </li>

            {/* Setting  page*/}
            <li className="nav-item ">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="collapse-tooltip">Settings</Tooltip>}
              >
                <Link
                  to={route.settings}
                  className="btn btn-header-list btn-outline-primary"
                >
                  <i className="ti ti-settings-cog" />
                </Link>
              </OverlayTrigger>
            </li>
            {/* /Setting  */}

            {/* Profile Dropdown */}
            <li className="nav-item dropdown has-arrow main-drop">
              <Link
                to="#"
                className="nav-link userset"
                data-bs-toggle="dropdown"
              >
                <span className="user-info">
                  <span className="user-letter">
                    {/* <ImageWithBasePath
                      src="assets/img/profiles/avatar-20.jpg"
                      alt="Profile"
                    /> */}
                    <div
                      className="d-flex justify-content-center align-items-center bg-primary text-white fw-bold rounded px-2"
                      style={{
                        width: "36px",
                        height: "36px",
                        fontSize: "18px",
                      }}
                    >
                      {user?.name
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase())
                        .join("")}
                    </div>
                  </span>
                  <span className="badge badge-success rounded-pill" />
                </span>
              </Link>
              <div className={`dropdown-menu  menu-drop-user`}>
                <div className="profilename">
                  <Link className="dropdown-item" to={route.dealsDashboard}>
                    <i className="ti ti-layout-2" /> Dashboard
                  </Link>
                  <Link
                    className="dropdown-item"
                    // to={route.profile}
                    to="#"
                  >
                    <i className="ti ti-user-pin" /> My Profile
                  </Link>
                  <Link
                    className="dropdown-item"
                    to={route.login}
                    onClick={handleLogout}
                  >
                    <i className="ti ti-lock" /> Logout
                  </Link>
                </div>
              </div>
            </li>
            {/* /Profile Dropdown */}
          </ul>
        </div>
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu">
          <Link
            to="#"
            className="nav-link dropdown-toggle mt-3"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" style={{ paddingLeft: "6.5px" }} />
          </Link>
          <div className={`dropdown-menu `}>
            <Link className="dropdown-item" to={route.dealsDashboard}>
              <i className="ti ti-layout-2" /> Dashboard
            </Link>
            {/* <Link className="dropdown-item" to={route.profile}>
              <i className="ti ti-user-pin" /> My Profile
            </Link> */}
            <Link to={route.settings} className="dropdown-item">
              <i className="ti ti-settings-cog" /> Settings
            </Link>
            <Link
              className="dropdown-item"
              onClick={() => {
                dispatch(logoutUser());
                queryClient.clear();
              }}
            >
              <i className="ti ti-lock" /> Logout
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>
    </>
  );
};

export default Header;
