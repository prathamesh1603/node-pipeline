import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DateRangePickerComponent from "../../../../core/common/crmComponents/DateRangePickerComponent";
import {
  getDateRange,
  incrementDateByOne,
  isSuperAdmin,
} from "../../../../utils/helpers/helper";
import { useProductsDashboardData } from "../hooks/useProductsDashboardData";

const RecentlyCreatedProducts = ({ selectedCompany }) => {
  const route = all_routes;

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const range = getDateRange();
    setDateRange(range);
  }, []);

  // Fetch leads based on the selected date range
  const { data, isLoading, isError, error } = useProductsDashboardData({
    page: 1,
    limit: 5,
    ofCompany: selectedCompany,
    "createdAt[gt]": dateRange.startDate,
    "createdAt[lt]": incrementDateByOne(dateRange.endDate),
    populate: "ofCompany",
    selectPopulateField: "name",
  });

  const productsData = data?.data?.data || [];
  let count = 0;

  // Flatten the productsData array
  const processedRows = productsData.flatMap((row) =>
    row.products.map((product, index) => {
      count++;
      let obj = {
        ...row,
        id: `${row._id}-${index}`, // Generate a unique ID for each product
        productName: product.name, // Add the individual product name
        category: row.name, // Add category name
        createdAt: row.createdAt, // Add createdAt date for the product
        updatedAt: row.updatedAt, // Add updatedAt date for the product
      };

      return obj;
    })
  );

  const limitedRows = processedRows.slice(0, 5);

  const totalProducts = productsData.reduce(
    (sum, product) => sum + product.count,
    0
  );

  // Define columns for DataGrid
  const columns = [
    {
      field: "productName",
      headerName: "Name",
      flex: 0.6,
      renderCell: (params) => (
        <div className="text-capitalize">{params.value || "N/A"}</div>
      ),
    },
    {
      field: "category",
      headerName: "Category",
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
      flex: 1,
      renderCell: (params) => (
        <div className="text-capitalize">{params?.row?.ofCompany?.name}</div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 0.6,
      renderCell: (params) => (
        <div>
          {params?.value
            ? new Date(params.value).toLocaleDateString()
            : new Date(params?.row?.updatedAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
    <div className="col-md-7">
      <div className="card">
        <div className="card-header border-0 pb-0">
          <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <h4>
              <i className="ti ti-grip-vertical me-1" />
              Recently Created Products
            </h4>
            <DateRangePickerComponent
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>
        </div>
        <div className="card-body">
          {isLoading ? (
            <p>Loading products...</p>
          ) : isError ? (
            <p>Error loading products: {error.message}</p>
          ) : totalProducts === 0 ? (
            <p>No data available for this chart.</p>
          ) : (
            <DataGrid
              rows={limitedRows}
              columns={columns.map((column) => ({
                ...column,
                headerClassName: "bg-light-200",
              }))}
              loading={!productsData}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-row": {
                  "&:nth-of-type(even)": {
                    backgroundColor: "#f9f9f9",
                  },
                },
              }}
              autoHeight
              hideFooter
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentlyCreatedProducts;
