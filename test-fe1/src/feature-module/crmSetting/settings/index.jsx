import React from "react";
import { Link, useLocation } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import PageHeader from "../../../core/common/crmComponents/PageHeader";
import { useSelector } from "react-redux";
import { MODULES } from "../../../core/data/constants/moduleConstants";

const Settings = () => {
  const route = all_routes;
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const control = user?.role?.control || {};

  // Define dynamic sections and their links
  const settingsSections = [
    {
      title: "CRM Settings",
      links: [
        {
          name: "Stages",
          icon: "ti ti-steam",
          module: MODULES.STAGES,
          routeKey: "stages",
        },
      ],
    },
    {
      title: "User Management",
      links: [
        {
          name: "Users",
          icon: "ti ti-file-invoice",
          module: MODULES.USERS,
          routeKey: "manageusers",
        },
        {
          name: "Roles",
          icon: "ti ti-navigation-cog",
          module: MODULES.ROLES,
          routeKey: "rolesPermissions",
        },
      ],
    },
    {
      title: "Customization",
      links: [
        {
          name: "Modules and Fields",
          icon: "ti ti-file-invoice",
          module: MODULES.CUSTOMMODULES,
          routeKey: "customModule",
        },
      ],
    },
  ];

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <PageHeader pageName="Settings" />
              <div className="row">
                {settingsSections.map((section, index) => {
                  // Check if any link in the section has permission
                  const hasVisibleLinks = section.links.some(
                    (link) => control[link.module]?.includes("update") // Check for "update" permission
                  );

                  // Only render the card if at least one link has permission
                  if (!hasVisibleLinks) return null;

                  return (
                    <div
                      key={index}
                      className="col-xl-3 col-sm-6 theiaStickySidebar mb-4"
                    >
                      <div className="card h-100">
                        <div className="card-body mb-0 pb-0">
                          <div className="settings-sidebar">
                            <h4 className="fw-semibold mb-3">
                              {section.title}
                            </h4>
                            <div className="list-group list-group-flush settings-sidebar">
                              {section.links.map((link, idx) => {
                                const hasPermission =
                                  control[link.module]?.includes("update");

                                return (
                                  hasPermission && (
                                    <Link
                                      key={idx}
                                      to={route[link.routeKey]}
                                      className={`settings-link fw-medium ${
                                        location.pathname ===
                                        route[link.routeKey]
                                          ? "active"
                                          : ""
                                      }`}
                                    >
                                      <i className={link.icon}></i> {link.name}
                                    </Link>
                                  )
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
