import Table from "../../../../core/common/dataTable/index";
import React, { useState } from "react";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { useUsersData } from "../hooks/useUsersData";
import PaginationControls from "../../../../core/common/pagination";
import { useDispatch, useSelector } from "react-redux";
import { all_routes } from "../../../router/all_routes";
import { DataGrid } from "@mui/x-data-grid";
import ActionsDropdown from "../../../../core/common/crmComponents/ActionsDropdown";
import { MODULES } from "../../../../core/data/constants/moduleConstants";

const UserList = ({ usersData }) => {
  const route = all_routes;
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Link
          className="text-decoration-underline text-capitalize"
          to={route?.userDetails.replace(":id", params?.row?._id)}
        >
          {params.row.name}
        </Link>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <div className="text-capitalize">
          {params?.row?.role?.name?.split("-").join(" ")}
        </div>
      ),
    },

    { field: "email", headerName: "Email", flex: 1, sortable: true },
    { field: "mobile", headerName: "Phone", flex: 1, sortable: true },
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <div className="text-capitalize">
          {params?.row?.ofCompany?.name?.split("-").join(" ")}
        </div>
      ),
    },

    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      sortable: true,
      renderCell: (params) => (
        <span
          className={`badge badge-pill badge-status ${
            params.row.status === "active" ? "bg-success" : "bg-danger"
          }`}
        >
          {params.row.status}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <ActionsDropdown
          params={params}
          path={route.userDetails}
          module={MODULES.USERS}
        />
      ),
      sortable: false,
    },
  ];

  return (
    <>
      <div>
        <DataGrid
          rows={usersData}
          columns={columns.map((column) => ({
            ...column,
            headerClassName: "bg-light-200",
            minWidth: 150,
          }))}
          getRowId={(row) => row._id}
          autoHeight
          hideFooter
        />
      </div>
    </>
  );
};

export default UserList;
