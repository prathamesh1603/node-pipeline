import React, { useState } from "react";
import { all_routes } from "../../../router/all_routes";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { FiChevronsDown, FiChevronsUp } from "react-icons/fi";
import { useSelector } from "react-redux";
import api from "../../../../utils/api";
import { toast } from "react-toastify";

const DealDetailsSidebar = ({ dealData: deal }) => {
  const [openAccordion, setOpenAccordion] = useState(false);
  const { user } = useSelector((state) => state?.auth);

  const toggleAccordion = () => {
    setOpenAccordion(!openAccordion);
  };

  async function handleCall() {
    try {
      const res = await api.post("/system-call/agentManualDial", {
        customerPhone: deal.mobile,
      });

      toast.success(res.data?.msg);
    } catch (e) {
      toast.error(e.response?.data?.msg);
    }
  }

  return (
    <div className="col-12 theiaStickySidebar">
      <div className="card">
        <div className="card-body p-3">
          {/* Basic Information */}
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-3 fw-semibold">Basic Information</h6>
            <Tooltip
              title={openAccordion ? "Collapse Details" : "Expand Details"}
            >
              <div style={{ cursor: "pointer" }} onClick={toggleAccordion}>
                {openAccordion ? (
                  <FiChevronsUp size={18} />
                ) : (
                  <FiChevronsDown size={18} />
                )}
              </div>
            </Tooltip>
          </div>
          <div className="">
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                <i className="ti ti-mail" />
              </span>
              <p>{deal?.email || "N/A"}</p>
            </div>
            {deal?.mobile && (
              <div className="d-flex align-items-center mb-3">
                {user?.role?.name === "caller" &&
                user?.agentId &&
                user?.campaignName ? (
                  <div className="">
                    <Tooltip placement="bottom" title="Click To Call">
                      <div
                        className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-primary me-2 fs-5"
                        onClick={handleCall}
                      >
                        <i className="ti ti-phone" />
                      </div>
                    </Tooltip>
                  </div>
                ) : (
                  <div className="">
                    <div className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-black me-2">
                      <i className="ti ti-phone" />
                    </div>
                  </div>
                )}

                <p>{deal?.mobile || "N/A"}</p>
              </div>
            )}
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                <i className="ti ti-calendar-exclamation" />
              </span>
              <p>Created on {new Date(deal?.createdTime).toLocaleString()}</p>
            </div>
          </div>

          {openAccordion && (
            <>
              {/* Status Information */}
              <h6 className="mb-3 fw-semibold ">Status</h6>
              <div className="mb-3">
                {deal?.currentStatus?.name && (
                  <div className="d-flex justify-content-between">
                    <span>Current Status</span>
                    <span className="text-capitalize">
                      {deal?.currentStatus?.name}
                    </span>
                  </div>
                )}
                <div className="d-flex justify-content-between">
                  <span className="text-capitalize">Probability</span>
                  <span className="text-capitalize">
                    {deal?.probability || "N/A"}
                  </span>
                </div>
              </div>
              <hr />

              {/* Interested Product */}
              <h6 className="mb-3 fw-semibold">Interested Product</h6>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Product Name</span>
                  <span className="text-capitalize">
                    {deal?.productInterested?.name ||
                      deal?.productInterested ||
                      "N/A"}
                  </span>
                </div>
              </div>
              <hr />

              {/* Additional Information */}
              <h6 className="mb-3 fw-semibold">Additional Information</h6>
              <ul>
                <li className="row mb-3">
                  <span className="col-6">Assigned To</span>
                  <span className="col-6 text-capitalize">
                    {deal?.assignedTo?.name}
                  </span>
                </li>
                <li className="row mb-3">
                  <span className="col-6">Company</span>
                  <span className="col-6 text-capitalize">
                    {deal?.ofCompany?.name}
                  </span>
                </li>
                <li className="row mb-3">
                  <span className="col-6">Last Modified</span>
                  <span className="col-6 ">
                    {new Date(deal?.lastActivityDate).toLocaleString()}
                  </span>
                </li>
              </ul>
              <hr />

              {/* Settings */}
              {/* <h6 className="mb-3 fw-semibold">Settings</h6>
          <Link to="#" className="d-block mb-3" disabled>
            <i className="ti ti-share-2 me-1" />
            Share deal
          </Link>
          <Link
            to="#"
            className="d-block mb-0"
            disabled
            onClick={() => setOpenModal(true)}
          >
            <i className="ti ti-trash-x me-1" />
            Delete deal
          </Link> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealDetailsSidebar;
