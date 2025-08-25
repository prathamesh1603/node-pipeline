import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { all_routes } from "../../../router/all_routes";
import ActionsDropdown from "../../../../core/common/crmComponents/ActionsDropdown";
import {
  MODULES,
  MODULES_ACTIONS,
} from "../../../../core/data/constants/moduleConstants";
import axios from "axios";
import UserApi from "../../manageUsers/api/manageUserApi";
import LeadApi from "../api/LeadApi";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import HasPermission from "../../../../core/common/wrapper/HasPermission";
import api from "../../../../utils/api";

const LeadList = ({ leadsData, selectedCompany }) => {
  const route = all_routes;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(10);

  const queryClient = useQueryClient();

  const fetchUsers = async () => {
    try {
      const data = await UserApi.fetchUsers({
        page,
        limit,
        ofCompany: selectedCompany,
        status: "active",
        populate: "role",
        selectPopulate: "name",
      });

      const usersData = data?.data?.data;
      setUsers((prev) => [...prev, ...usersData]);
      setHasMore(usersData.length > 0);
      setPage(page + 1);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleSelectionChange = (id, callerid) => {
    setSelectedLeadIds((prev) =>
      prev.some((el) => el.id === id)
        ? prev.filter((el) => el.id !== id)
        : [...prev, { id, callerid }]
    );
  };

  const openChangeOwnerDialog = () => {
    setIsDialogOpen(true);
    setPage(1);
    setUsers([]);
    fetchUsers();
  };

  const changeLeadOwner = async () => {
    try {
      const leadIds = selectedLeadIds
        .filter((el) => el.callerid !== selectedUserId)
        .map((el) => el.id);

      if (leadIds.length === 0) {
        toast.warning("Selected leads already belong to this caller.");
        setIsDialogOpen(false);
        setPage(1);
        setHasMore(true);
        setSelectedUserId(null);
        setSelectedLeadIds([]);
        return;
      }
      if (selectedLeadIds.length > leadIds.length) {
        toast.warning(
          "Some selected leads belong to the same caller and won't be updated."
        );
      }

      const res = await LeadApi.changleLeadOwner(leadIds, selectedUserId);
      toast.success(res.msg || "Leads reassigned successfully.");
      queryClient.invalidateQueries("lead");

      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to change lead owner.");
      console.error("Error:", error.message);
    } finally {
      setPage(1);
      setHasMore(true);
      setSelectedUserId(null);
      setSelectedLeadIds([]);
    }
  };

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

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      renderCell: (params) => (
        <HasPermission module={MODULES.USERS} action={MODULES_ACTIONS.UPDATE}>
          <input
            type="checkbox"
            checked={selectedLeadIds.some((el) => el.id === params.row._id)}
            onChange={() =>
              handleSelectionChange(params.row._id, params.row.assignedTo?._id)
            }
          />
        </HasPermission>
      ),
      renderHeader: () => (
        <Tooltip title="ID" arrow>
          <span>ID</span>
        </Tooltip>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 100,
      renderCell: (params) => (
        <Link
          to={route.leadsDetails.replace(":id", params.row._id)}
          className="text-capitalize text-primary active-link"
        >
          {params.row.firstName} {params.row.lastName}
        </Link>
      ),
    },
    {
      field: "assignedTo",
      headerName: "Caller",
      width: 130,
      renderCell: (params) => (
        <div className="text-capitalize">{params.row.assignedTo?.name}</div>
      ),
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
    { field: "email", headerName: "Email", width: 210 },
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
          module={MODULES.LEADS}
          path={route.leadsDetails}
        />
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      {selectedLeadIds.length > 0 && (
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={openChangeOwnerDialog}
          >
            Change Lead Owner
          </Button>
        </Box>
      )}
      <DataGrid
        rows={leadsData}
        columns={columns}
        getRowId={(row) => row._id}
        autoHeight
        hideFooter
        disableExtendRowFullWidth
      />
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Select New Owner</DialogTitle>
        <DialogContent dividers>
          <List className="">
            {users.map((user) => (
              <ListItem
                key={user._id}
                className={`${
                  selectedUserId === user._id
                    ? "bg-primary p-2 rounded-pill"
                    : ""
                }`}
                disablePadding
              >
                <ListItemButton onClick={() => setSelectedUserId(user._id)}>
                  <ListItemText primary={user.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {hasMore && (
            <Box mt={2} textAlign="left">
              <Button variant="outlined" onClick={fetchUsers} color="primary">
                Load More
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsDialogOpen(false);
              setPage(1);
              setHasMore(true);
              setSelectedUserId(null);
              setSelectedLeadIds([]);
            }}
            color=""
          >
            Cancel
          </Button>
          <Button
            onClick={changeLeadOwner}
            disabled={!selectedUserId}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeadList;
