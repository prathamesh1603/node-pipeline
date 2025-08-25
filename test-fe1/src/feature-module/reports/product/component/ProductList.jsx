import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useSearchParams } from "react-router-dom";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import ActionsDropdown from "../../../../core/common/crmComponents/ActionsDropdown";
import { MODULES } from "../../../../core/data/constants/moduleConstants";
import { all_routes } from "../../../router/all_routes";
import CompanyFilter from "../../../../core/common/crmComponents/CompanyFilter";

const ProductList = ({
  productsData,
  isLoading,
  isError,
  error,
  filteredRows,
}) => {
  const columns = [
    {
      field: "productName",
      headerName: "Product Name",
      flex: 1,
      renderCell: (params) => (
        <div className="text-capitalize">{params.value || "N/A"}</div>
      ),
    },
    {
      field: "category",
      headerName: "Product Category",
      flex: 1,
      renderCell: (params) => (
        <div className="text-capitalize">
          {params.value ? params.value.split("-").join(" ") : "N/A"}
        </div>
      ),
    },
    {
      field: "ofCompany",
      headerName: "Company",
      flex: 1.5,
      renderCell: (params) => (
        <div className="text-capitalize">{params?.row?.ofCompany?.name}</div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: (params) => (
        <div>
          {params?.value
            ? new Date(params.value).toLocaleDateString()
            : new Date(params?.row?.updatedAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1,
      renderCell: (params) => (
        <div>
          {params?.value
            ? new Date(params.value).toLocaleDateString()
            : new Date(params?.row?.createdAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Page Wrapper */}

      <div className="row">
        <div className="col-md-12">
          {/* Products List */}
          <div>
            {isLoading ? (
              <LoaderComponent />
            ) : isError ? (
              <div>Error: {error.message}</div>
            ) : (
              <DataGrid
                rows={filteredRows} // Use the filtered rows
                columns={columns.map((column) => ({
                  ...column,
                  headerClassName: "bg-light-200",
                }))}
                getRowId={(row) => row.id} // Use the unique ID
                autoHeight
                pagination
                pageSizeOptions={[5]} // Define the page size options
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 }, // Set the initial page size and page number
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* /Page Wrapper */}
    </>
  );
};

export default ProductList;
