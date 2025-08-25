import React, { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";

const AccountDealsDetails = ({
  accountData,
  onDealClick,
  setSelectedDeal,
  setView,
}) => {
  const [expandedDeals, setExpandedDeals] = useState({}); // Track expanded state for each deal

  const toggleAccordion = (dealId) => {
    setExpandedDeals((prevState) => ({
      ...prevState,
      [dealId]: !prevState[dealId], // Toggle expanded state for the specific deal
    }));
  };

  const handleDealClick = (deal) => {
    setSelectedDeal(deal); // Set the selected deal
    onDealClick(deal?.timeline); // Call the onDealClick function with the timeline (if needed)
  };

  return (
    <div className="account-details-sidebar">
      <h5>Deals</h5>
      {accountData?.dealsDetails && accountData.dealsDetails.length > 0 ? (
        <ul className="list-group my-3">
          {accountData.dealsDetails.map((deal) => (
            <li key={deal?._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-capitalize">
                    <span className="me-2">Name:</span>
                    <strong>
                      {deal?.firstName} {deal?.lastName}
                    </strong>
                  </div>

                  <div className="mt-1">
                    <span className="me-2">Status:</span>
                    <span
                      className={`badge badge-pill badge-status text-capitalize`}
                      style={{
                        backgroundColor: `${deal?.currentStatus?.color}`,
                      }}
                    >
                      {" "}
                      {deal?.currentStatus?.name}
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <button
                    className="badge bg-outline-primary"
                    onClick={() => {
                      setView("timeline");
                      handleDealClick(deal);
                    }}
                  >
                    View Timeline
                  </button>

                  <Tooltip
                    title={
                      expandedDeals[deal?._id]
                        ? "Collapse Details"
                        : "Expand Details"
                    }
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAccordion(deal?._id);
                      }}
                    >
                      {expandedDeals[deal?._id] ? (
                        <FiChevronUp size={18} />
                      ) : (
                        <FiChevronDown size={18} />
                      )}
                    </div>
                  </Tooltip>
                </div>
              </div>
              {expandedDeals[deal?._id] && (
                <div className="row mt-3">
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between mb-1">
                      <strong>Email</strong>
                      <span>{deal?.email || "N/A"}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1 text-capitalize">
                      <strong>Assigned To</strong>
                      <span>{deal?.assignedTo?.name || "N/A"}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1 text-capitalize">
                      <strong>Status</strong>
                      <span>{deal?.assignedTo?.status || "N/A"}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <strong>Created At</strong>
                      <span>
                        {new Date(deal?.createdTime).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex justify-content-between mb-1">
                      <strong>Mobile</strong>
                      <span>{deal?.mobile || "N/A"}</span>
                    </div>

                    <div className="d-flex justify-content-between mb-1 text-capitalize">
                      <strong>Probability</strong>
                      <span>{deal?.probability || "N/A"}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1 text-capitalize">
                      <strong>Product Interested</strong>
                      <span>{deal?.productInterested?.name || "N/A"}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1 text-capitalize">
                      <strong>Updated At</strong>
                      <div className="d-flex flex-column align-items-end">
                        <span>{deal?.lastUpdationBy?.name || "N/A"}</span>

                        <span className="text-muted">
                          {new Date(deal?.lastActivityDate).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No deals available</p>
      )}
    </div>
  );
};

export default AccountDealsDetails;
