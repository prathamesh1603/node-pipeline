import React, { useEffect, useRef, useState } from "react";
import { isSuperAdmin } from "../../../utils/helpers/helper";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleFilter = ({ selectedRole, setSelectedRole, user }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { roleNamesArr } = useSelector((state) => state.auth);

  // Set the first company as default for SuperAdmin

  //   useEffect(() => {
  //     if (
  //       isSuperAdmin(user) &&
  //       roleNamesArr.length > 0 &&
  //       !selectedRole &&
  //       !searchParams.get("roleId")
  //     ) {

  //       const defaultCompany = roleNamesArr[0];
  //       setSelectedRole(defaultCompany.value);
  //       searchParams.set("roleId", defaultCompany.value);
  //       setSearchParams(searchParams);
  //     } else if (!isSuperAdmin(user)) {
  //       searchParams.set("roleId", user.ofCompany._id);
  //       setSearchParams(searchParams);
  //     }
  //   }, [selectedRole, roleNamesArr]);

  const handleRoleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedRole(selectedValue);
    // searchParams.set("roleId", selectedValue);
    // setSearchParams(searchParams);
  };

  const selectedRoleLabel =
    roleNamesArr.find((role) => role.value === selectedRole)?.label || "";

  const selectValue = isSuperAdmin(user) ? user?.role?.name : selectedRole;

  return (
    <div className="company-filter">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2">
        {isSuperAdmin(user) ? (
          <div className="input-group">
            <label className="input-group-text" htmlFor="selectRole">
              Roles
            </label>
            <select
              id="selectRole"
              className="form-select text-capitalize"
              value={selectedRole || ""}
              onChange={handleRoleChange}
            >
              <option value={selectValue} className="text-capitalize">
                {selectValue?.split("-").join(" ")}
              </option>
              {roleNamesArr.map((role, index) => (
                <option key={index} value={role.roleName}>
                  {role.label}
                </option>
              ))}
            </select>
            <span>{selectedRoleLabel}</span>
          </div>
        ) : (
          <div className="input-group">
            <label className="input-group-text">Role</label>
            <input
              type="text"
              className="form-control text-capitalize"
              value={
                user?.role?.name ? user.role.name?.split("-").join(" ") : "N/A"
              }
              disabled
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleFilter;
