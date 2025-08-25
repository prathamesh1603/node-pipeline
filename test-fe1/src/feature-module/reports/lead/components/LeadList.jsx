import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { all_routes } from "../../../router/all_routes";

const LeadList = ({ leadsData }) => {
  const route = all_routes;

  // Columns definition for the DataGrid
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 160,
      sortable: true,
      renderCell: (params) => (
        <span className=" text-capitalize">
          {params.row.firstName} {params.row.lastName}
        </span>
      ),
    },

    {
      field: "assignedTo",
      headerName: "Caller",
      width: 130,
      renderCell: (params) => (
        <div className="text-capitalize">{params?.row?.assignedTo?.name}</div>
      ),
      sortable: true,
    },
    { field: "mobile", headerName: "Phone", width: 100, sortable: true },
    { field: "email", headerName: "Email", width: 210, sortable: true },
    {
      field: "probability",
      headerName: "Probability",
      width: 90,
      renderCell: (params) => (
        <div className="text-capitalize">
          {params?.row?.probability ? params?.row?.probability : "medium"}
        </div>
      ),
      sortable: true,
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      sortable: true,
      renderCell: (params) => (
        <span
          className={`badge badge-pill badge-status text-capitalize`}
          style={{ backgroundColor: `${params?.row?.currentStatus?.color}` }}
        >
          {params.row.currentStatus?.name}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 100,
      renderCell: (params) => (
        <div>
          {params?.value
            ? new Date(params.createdTime).toLocaleDateString()
            : new Date(params?.row?.lastActivityDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 100,
      renderCell: (params) => (
        <div>
          {params?.value
            ? new Date(params.createdTime).toLocaleDateString()
            : new Date(params?.row?.lastActivityDate).toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      {/* DataGrid Table */}
      <DataGrid
        rows={leadsData}
        columns={columns.map((column) => ({
          ...column,
          headerClassName: "bg-light-200",
        }))}
        getRowId={(row) => row._id}
        autoHeight
        hideFooter
        disableExtendRowFullWidth
      />
    </div>
  );
};

export default LeadList;
