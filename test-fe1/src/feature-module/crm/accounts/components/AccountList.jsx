import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { all_routes } from "../../../router/all_routes";

const AccountList = ({ accountsData }) => {
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
          to={route.accountDetails.replace(":id", params?.row?._id)}
        >
          {params.row.firstName} {params.row.lastName}
        </Link>
      ),
    },
    {
      field: "ofCompany",
      headerName: "Company",
      flex: 2,
      renderCell: (params) => (
        <div className="text-capitalize">{params?.row?.ofCompany?.name}</div>
      ),
      sortable: true,
    },

    { field: "email", headerName: "Email", flex: 1, sortable: true },

    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   renderCell: (params) => (
    //     <ActionsDropdown
    //       params={params}
    //       module={MODULES.DEALS}
    //       path={route.accountDetails}
    //     />
    //   ),
    //   sortable: false,
    // },
  ];

  return (
    <div style={{ width: "100%" }}>
      {/* DataGrid Table */}
      <DataGrid
        rows={accountsData}
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

export default AccountList;
