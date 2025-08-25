import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Tooltip, tooltipClasses } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedId } from "../../../../core/data/redux/commonSlice";
import { all_routes } from "../../../router/all_routes";
import ActionsDropdown from "../../../../core/common/crmComponents/ActionsDropdown";
import { MODULES } from "../../../../core/data/constants/moduleConstants";
import { toast } from "react-toastify";
import api from "../../../../utils/api";

const DealList = ({ dealsData }) => {
  const route = all_routes;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth);

  // Columns definition for the DataGrid
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 160,
      sortable: true,
      renderCell: (params) => (
        <Link
          className="text-primary text-capitalize active-link"
          to={route.dealsDetails.replace(":id", params?.row?._id)}
        >
          {params.row.firstName} {params.row.lastName}
        </Link>
      ),
    },
    {
      field: "ofCompany",
      headerName: "Company",
      width: 130,
      renderCell: (params) => (
        <div className="text-capitalize">{params?.row?.ofCompany?.name}</div>
      ),
      sortable: true,
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
    {
      field: "mobile",
      headerName: "Phone",
      width: 160,
      renderCell: (params) => (
        <div className="d-flex align-items-center mb-3">
          {user?.role?.name === "caller" &&
            user?.agentId &&
            user?.campaignName && (
              <div className="">
                <Tooltip
                  placement="bottom"
                  title="Click To Call"
                  slotProps={{
                    popper: {
                      sx: {
                        [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                          {
                            marginTop: "0px",
                          },
                      },
                    },
                  }}
                >
                  <div
                    className="p-0 flex-shrink-0 text-primary me-2 fs-5"
                    onClick={() => handleCall(params?.row?.mobile)}
                  >
                    <i className="ti ti-phone" />
                  </div>
                </Tooltip>
              </div>
            )}
          <p>{params?.row?.mobile || "N/A"}</p>
        </div>
      ),
    },
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
      width: 160,
      renderCell: (params) => (
        <div>
          {params?.value
            ? new Date(params.createdTime).toLocaleString()
            : new Date(params?.row?.lastActivityDate).toLocaleString()}
        </div>
      ),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 160,
      renderCell: (params) => (
        <div>
          {params?.value
            ? new Date(params.createdTime).toLocaleString()
            : new Date(params?.row?.lastActivityDate).toLocaleString()}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 70,
      renderCell: (params) => (
        <ActionsDropdown
          params={params}
          module={MODULES.DEALS}
          path={route.dealsDetails}
        />
      ),
      sortable: false,
    },
  ];

  async function handleCall(mobileNo) {
    try {
      const res = await api.post("/system-call/agentManualDial", {
        customerPhone: mobileNo,
      });

      toast.success(res.data?.msg);
    } catch (e) {
      toast.error(e.response?.data?.msg);
    }
  }

  return (
    <div style={{ width: "100%" }}>
      {/* DataGrid Table */}
      <DataGrid
        rows={dealsData}
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

export default DealList;
