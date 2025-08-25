import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DateRangePickerComponent from "../../../../core/common/crmComponents/DateRangePickerComponent";
import {
  getDateRange,
  incrementDateByOne,
} from "../../../../utils/helpers/helper";
import { useDealsDashboardData } from "../hooks/useDealsDashboardData";

const RecentlyCreatedDeals = ({ selectedCompany }) => {
  const route = all_routes;

  const [dateRange, setDateRange] = useState(getDateRange());

  // Fetch deals based on the selected date range
  const { data, isLoading, isError, error } = useDealsDashboardData({
    page: 1,
    limit: 5,
    fields: "firstName,lastName,ofCompany,mobile,currentStatus",
    sort: "-createdTime",
    ofCompany: selectedCompany,
    "createdTime[gt]": dateRange.startDate,
    "createdTime[lt]": incrementDateByOne(dateRange.endDate),
    populate: "ofCompany",
    selectPopulateField: "name",
  });

  const deals = data?.data?.data || [];
  const totalDeals = deals.reduce((sum, deal) => sum + deal.count, 0);

  // Define columns for DataGrid
  const columns = [
    {
      field: "dealName",
      headerName: "deal Name",
      flex: 0.7,
      renderCell: (params) => (
        <Link
          to={route.dealsDetails.replace(":id", params?.row?.id)}
          className="d-flex flex-column text-capitalize"
        >
          <span className="text-capitalize">
            {params.row.firstName} {params.row.lastName}
          </span>
        </Link>
      ),
    },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 1.3,
      renderCell: (params) => (
        <Link
          to={route.companyDetails.replace(":id", params?.row?.ofCompany?._id)}
          className="d-flex flex-column text-capitalize"
        >
          {params.row.ofCompany?.name || "N/A"}
        </Link>
      ),
    },
    {
      field: "mobile",
      headerName: "Phone",
      flex: 1,
    },
    {
      field: "status",
      headerName: "deal Status",
      flex: 1,
      renderCell: (params) => (
        <span
          className={`badge badge-pill badge-status py-1`}
          style={{
            backgroundColor: params.row.currentStatus?.color || "#ccc",
          }}
        >
          {params.row.currentStatus?.name || "Unknown"}
        </span>
      ),
    },
  ];

  // Map deals to rows for DataGrid
  const rows = deals?.map((deal) => ({
    id: deal?._id, // Use a unique identifier for each row
    firstName: deal?.firstName || "",
    lastName: deal?.lastName || "",
    ofCompany: deal?.ofCompany,
    mobile: deal?.mobile || "N/A",
    currentStatus: deal?.currentStatus || {},
  }));

  return (
    <div className="col-md-6">
      <div className="card">
        <div className="card-header border-0 pb-0">
          <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <h4>
              <i className="ti ti-grip-vertical me-1" />
              Recently Created Deals
            </h4>
            <DateRangePickerComponent
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>
        </div>
        <div className="card-body">
          {isLoading ? (
            <p>Loading deals...</p>
          ) : isError ? (
            <p>Error loading deals: {error.message}</p>
          ) : totalDeals === 0 ? (
            <p>No data available for this chart.</p>
          ) : (
            <DataGrid
              rows={rows || []}
              columns={columns}
              loading={!deals}
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

export default RecentlyCreatedDeals;
