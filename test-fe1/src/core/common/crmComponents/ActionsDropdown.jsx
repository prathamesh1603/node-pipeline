import React, { useState } from "react";
import { TextField, Menu, MenuItem, Button, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { setCompanyId, setSelectedId } from "../../data/redux/commonSlice";
import { Link } from "react-router-dom";
import { all_routes } from "../../../feature-module/router/all_routes";
import HasPermission from "../wrapper/HasPermission";
import { MODULES_ACTIONS } from "../../data/constants/moduleConstants";

const ActionsDropdown = ({ params, path, module, showDetails, children }) => {
  const dispatch = useDispatch();
  const route = all_routes;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="dropdown-button"
        aria-controls={open ? "dropdown-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <i className="fa fa-ellipsis-v" />
      </Button>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem className="dropdown-menu dropdown-menu-right py-0">
          <HasPermission module={module} action={MODULES_ACTIONS.UPDATE}>
            <Link
              className="dropdown-item"
              to={path.replace(":id", `edit/${params?.row?._id}`)}
              onClick={() => {
                setAnchorEl(null);
                dispatch(setCompanyId(params?.row?.ofCompany?.name));
              }}
            >
              <i className="ti ti-edit text-blue pe-2" /> Edit
            </Link>
          </HasPermission>
        </MenuItem>
        {children}
        {/* <MenuItem className="dropdown-menu dropdown-menu-right py-0">
          <Link
            className="dropdown-item"
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#delete_contact"
          >
            <i className="ti ti-trash text-danger pe-2"></i> Delete
          </Link>
        </MenuItem> */}

        {showDetails && (
          <MenuItem className="dropdown-menu dropdown-menu-right py-0">
            <Link
              className="dropdown-item"
              to={path.replace(":id", params?.id)}
            >
              <i className="ti ti-eye text-blue-light pe-2"></i> Preview
            </Link>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default ActionsDropdown;
