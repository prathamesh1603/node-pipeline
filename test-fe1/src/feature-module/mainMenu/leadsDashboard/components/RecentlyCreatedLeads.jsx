import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import { useLeadsDashboardData } from "../hooks/useLeadsDashboardData";
import DateRangePickerComponent from "../../../../core/common/crmComponents/DateRangePickerComponent";
import {
  getDateRange,
  incrementDateByOne,
} from "../../../../utils/helpers/helper";

const RecentlyCreatedLeads = ({ selectedCompany }) => {
  const route = all_routes;
  const [dateRange, setDateRange] = useState(getDateRange()); // Initialize with date range

  const { data, isLoading, isError, error } = useLeadsDashboardData({
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

  const leads = data?.data?.data || [];
  const totalLeads = leads.reduce((sum, lead) => sum + lead.count, 0);

  // Define columns for DataGrid
  const columns = [
    {
      field: "leadName",
      headerName: "Lead Name",
      flex: 0.7,
      renderCell: (params) => (
        <Link
          to={route.leadsDetails.replace(":id", params?.row?.id)}
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
      headerName: "Lead Status",
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

  // Map leads to rows for DataGrid
  const rows = leads?.map((lead) => ({
    id: lead?._id, // Use a unique identifier for each row
    firstName: lead?.firstName || "",
    lastName: lead?.lastName || "",
    ofCompany: lead?.ofCompany,
    mobile: lead?.mobile || "N/A",
    currentStatus: lead?.currentStatus || {},
  }));

  return (
    <div className="col-md-6">
      <div className="card">
        <div className="card-header border-0 pb-0">
          <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <h4>
              <i className="ti ti-grip-vertical me-1" />
              Recently Created Leads
            </h4>
            <DateRangePickerComponent
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>
        </div>
        <div className="card-body">
          {isLoading ? (
            <p>Loading leads...</p>
          ) : isError ? (
            <p>Error loading leads: {error.message}</p>
          ) : totalLeads === 0 ? (
            <p>No data available for this chart.</p>
          ) : (
            <DataGrid
              rows={rows || []}
              columns={columns}
              loading={!leads}
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

export default RecentlyCreatedLeads;
