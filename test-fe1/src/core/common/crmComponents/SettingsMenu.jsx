import React from "react";
import { Link, useLocation } from "react-router-dom";
import { all_routes } from "../../../feature-module/router/all_routes";

const SettingsMenu = () => {
  const route = all_routes;
  const location = useLocation(); // Get the current location

  return (
    <div className="card">
      <div className="card-body pb-0 pt-2">
        <ul className="nav nav-tabs nav-tabs-bottom">
          <li className="nav-item me-3">
            <Link
              to={route.stages}
              className={`nav-link px-0 ${
                location.pathname === route.stages ? "active" : ""
              }`}
            >
              <i className="ti ti-settings-cog" /> CRM Settings
            </Link>
          </li>
          <li className="nav-item me-3">
            <Link
              to={route.manageusers}
              className={`nav-link px-0 ${
                location.pathname === route.manageusers ? "active" : ""
              }`}
            >
              <i className="ti ti-world-cog" /> User Management
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsMenu;
