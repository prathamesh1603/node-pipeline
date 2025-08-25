import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedId } from "../../../../core/data/redux/commonSlice";
import { all_routes } from "../../../router/all_routes";
import ActionsDropdown from "../../../../core/common/crmComponents/ActionsDropdown";
import { MODULES } from "../../../../core/data/constants/moduleConstants";

const CompanyList = ({ companiesData }) => {
  const route = all_routes;
  const dispatch = useDispatch();

  // Columns definition for the DataGrid
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Link
          className="text-decoration-underline text-capitalize"
          to={route.companyDetails.replace(":id", params?.row?._id)}
          // onClick={() => dispatch(setSelectedId(params.row._id))}
        >
          {params.row.name}
        </Link>
      ),
    },
    { field: "code", headerName: "Code", flex: 0.5, sortable: true },
    { field: "mobile", headerName: "Phone", flex: 1, sortable: true },
    { field: "email", headerName: "Email", flex: 1, sortable: true },
    { field: "website", headerName: "Website", flex: 1, sortable: true },
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
          path={route.companyDetails}
          module={MODULES.COMPANIES}
        />
      ),
      sortable: false,
    },
  ];

  return (
    <div>
      {/* DataGrid Table */}
      <DataGrid
        rows={companiesData}
        columns={columns.map((column) => ({
          ...column,
          headerClassName: "bg-light-200",
        }))}
        getRowId={(row) => row._id}
        autoHeight
        hideFooter
      />
    </div>
  );
};

export default CompanyList;
