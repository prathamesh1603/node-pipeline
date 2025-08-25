import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import RoleApi from "../api/manageRoleApi";
import { toast } from "react-toastify";
import { EDITED_SUCCESS_MSG } from "../../../../core/data/constants/constant";
import { all_routes } from "../../../router/all_routes";

const Permission = () => {
  const location = useLocation();
  const route = all_routes;
  const navigate = useNavigate();

  const actions = ["create", "update", "delete", "read"]; // Common actions

  const [permissions, setPermissions] = useState({
    ...location?.state?.controls,
  });

  const [readVisibility, setReadVisibility] = useState({
    ...location?.state?.readVisibility,
  });

  const [initialPermissions, setInitialPermissions] = useState({});
  const [initialReadVisibility, setInitialReadVisibility] = useState({});

  useEffect(() => {
    // Store the initial state when the component mounts
    setInitialPermissions(location?.state?.controls || {});
    setInitialReadVisibility(location?.state?.readVisibility || {});
  }, [location?.state]);

  const modules = Object.keys(location?.state?.controls);
  const name = location?.state?.name;

  const queryClient = useQueryClient();

  const mutationAdd = useMutation({
    mutationFn: RoleApi.updateRole,
    onSuccess: () => {
      toast.success(EDITED_SUCCESS_MSG);
      navigate(route.rolesPermissions);
      queryClient.invalidateQueries("roles");
    },
  });

  function handleRoleUpdation() {
    // Compare current permissions and readVisibility with initial states
    const permissionsChanged =
      JSON.stringify(permissions) !== JSON.stringify(initialPermissions);
    const readVisibilityChanged =
      JSON.stringify(readVisibility) !== JSON.stringify(initialReadVisibility);

    if (!permissionsChanged && !readVisibilityChanged) {
      // Show warning if no changes
      toast.warn("No changes detected. Please make changes before saving.");
      return;
    }

    // Proceed with saving if changes are detected
    mutationAdd.mutate({
      id: location.state.id,
      roleData: {
        control: { ...permissions },
        readVisibility: { ...readVisibility },
      },
    });
  }

  const renderRow = (module) => {
    return (
      <tr key={module}>
        <td>{module?.charAt(0).toUpperCase() + module?.slice(1)}</td>
        {actions.map((action) => {
          if (action === "read") {
            return (
              <td key={action}>
                <div className="d-flex align-items-center">
                  <label className="checkboxs me-2">
                    <input
                      type="checkbox"
                      checked={permissions[module]?.includes(action) || false}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setPermissions((prev) => ({
                          ...prev,
                          [module]: isChecked
                            ? [...(prev[module] || []), action]
                            : [
                                ...(prev[module] || []).filter(
                                  (a) => a !== action
                                ),
                              ],
                        }));
                        if (!isChecked) {
                          setReadVisibility((prev) => ({
                            ...prev,
                            [module]: "", // Reset visibility selection when unchecked
                          }));
                        } else {
                          setReadVisibility((prev) => ({
                            ...prev,
                            [module]: prev[module] || "own", // Default to "own" if not set
                          }));
                        }
                      }}
                    />
                    <span className="checkmarks"></span>
                  </label>
                  {permissions[module]?.includes(action) && (
                    <select
                      value={readVisibility[module] || "own"} // Default to "own" if no value is set
                      onChange={(e) => {
                        setReadVisibility((prev) => ({
                          ...prev,
                          [module]: e.target.value, // Update visibility selection
                        }));
                      }}
                      className="form-select form-select-sm"
                      style={{ width: "auto" }} // Adjust width to fit content
                    >
                      {["own", "company", "team", "assigned", "everything"].map(
                        (option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        )
                      )}
                    </select>
                  )}
                </div>
              </td>
            );
          } else {
            return (
              <td key={action}>
                <label className="checkboxs">
                  <input
                    type="checkbox"
                    checked={permissions[module]?.includes(action) || false}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setPermissions((prev) => ({
                        ...prev,
                        [module]: isChecked
                          ? [...(prev[module] || []), action]
                          : [
                              ...(prev[module] || []).filter(
                                (a) => a !== action
                              ),
                            ],
                      }));
                    }}
                  />
                  <span className="checkmarks"></span>
                </label>
              </td>
            );
          }
        })}
      </tr>
    );
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <PageHeader pageName="Permission" />

        <div className="contact-head">
          <div className="row align-items-center">
            <div className="col-sm-6">
              <ul className="contact-breadcrumb">
                <li>
                  <div onClick={() => navigate(-1)} className="navigate-link">
                    <i className="ti ti-arrow-narrow-left" />
                    Roles
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-md-5 col-sm-4">
                <div className="mb-3 mb-sm-0">
                  <h4>
                    Role Name :{" "}
                    <span className="text-danger text-capitalize">
                      {name.split("-").join(" ")}
                    </span>
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="card-body">
            {/* Permissions Table */}
            <div className="table-responsive custom-table">
              <table className="table" id="permission_list">
                <thead className="thead-light">
                  <tr>
                    <th>Modules</th>
                    {actions.map((action) => (
                      <th key={action}>
                        {action.charAt(0).toUpperCase() + action.slice(1)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{modules.map((module) => renderRow(module))}</tbody>
              </table>
            </div>
          </div>
          <div className="d-flex justify-content-center py-2">
            <button
              onClick={handleRoleUpdation}
              className="btn btn-primary "
              disabled={mutationAdd.isPending}
            >
              <i className="ti ti-square-rounded-plus me-2" />
              {mutationAdd.isPending ? "Saving" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permission;
