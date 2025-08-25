import React, { useState } from "react";
import { all_routes } from "../../../router/all_routes";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import { useNavigate, useParams } from "react-router";
import { useAccountData } from "../hooks/useAccountData";
import AccountDetailsHeader from "../components/AccountDetailsHeader";
import { fetchTimelineData } from "../../../../utils/helpers/apiHelpers";
import AccountDealsDetails from "../components/AccountDealsDetails";
import { useQuery } from "@tanstack/react-query";
import DisplayTimeline from "../../../../core/common/crmComponents/DisplayTimeline";
import { MODULES } from "../../../../core/data/constants/moduleConstants";

const AccountsDetails = () => {
  const route = all_routes;
  const { id: accountId } = useParams();
  const { accountData, isLoading } = useAccountData(accountId);
  const navigate = useNavigate();

  const [view, setView] = useState("overview");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedTimelineId, setSelectedTimelineId] = useState(null);

  const {
    data: timelineData,
    isLoading: timelineLoading,
    isError,
  } = useQuery({
    queryKey: ["timelineData"],
    queryFn: () => fetchTimelineData(selectedTimelineId),
    enabled: !!selectedTimelineId,
  });

  const handleDealClick = (timelineId) => {
    setSelectedTimelineId(timelineId);
    setView("timeline");
  };

  if (isError) return <div>Error loading timeline data.</div>;

  const renderContent = () => {
    if (view === "overview") {
      return (
        <>
          <AccountDetailsHeader accountData={accountData} />
          <AccountDealsDetails
            accountData={accountData}
            onDealClick={handleDealClick}
            setSelectedDeal={setSelectedDeal}
            setView={setView}
          />
        </>
      );
    } else if (view === "timeline") {
      return timelineLoading ? (
        <LoaderComponent />
      ) : (
        <>
          {timelineData && Object.keys(timelineData).length > 0 && (
            <DisplayTimeline
              timeline={timelineData}
              selectedData={selectedDeal}
              moduleName={MODULES.DEALS}
            />
          )}
        </>
      );
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <PageHeader pageName="Account Details" />
          </div>
        </div>
        <div className="row mb-3">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="col-auto">
              <ul className="contact-breadcrumb m-0 p-0">
                <li>
                  <div onClick={() => navigate(-1)} className="navigate-link">
                    <i className="ti ti-arrow-narrow-left text-capitalize me-2" />
                    Accounts
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-auto">
              <div className="toggle-buttons-container">
                <button
                  className={`btn ${
                    view === "overview" ? "btn-primary" : "btn-light"
                  }`}
                  onClick={() => setView("overview")}
                >
                  Overview
                </button>

                {/* <button
                  className={`btn ${
                    view === "timeline" ? "btn-primary" : "btn-light"
                  } `}
                  onClick={() => setView("timeline")}
                  disabled={
                    !timelineData || Object.keys(timelineData).length === 0
                  }
                >
                  {!timelineData || Object.keys(timelineData).length === 0
                    ? "Select Deal To view Timeline"
                    : "Timeline"}
                </button> */}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {isLoading ? <LoaderComponent /> : renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AccountsDetails;
