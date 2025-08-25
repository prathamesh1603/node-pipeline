import React, { useState, useEffect } from "react";
import { all_routes } from "../../../router/all_routes";
import LeadDetailsSidebar from "../components/LeadDetailsSidebar";
import { useLeadData } from "../hooks/useLeadData";
import AddLead from "./AddLead";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import LeadDetailsHeader from "../components/LeadDetailsHeader";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchTimelineData } from "../../../../utils/helpers/apiHelpers";
import LeadPipelineStatus from "../components/LeadPipelineStatus";
import DisplayTimeline from "../../../../core/common/crmComponents/DisplayTimeline";
import { MODULES } from "../../../../core/data/constants/moduleConstants";

const LeadsDetails = () => {
  const route = all_routes;
  const { id: leadId } = useParams();
  const { leadData, isLoading, isError, error } = useLeadData(leadId);

  const [view, setView] = useState("overview"); // State for view

  const {
    data: timelineData,
    isLoading: timelineLoading,
    isError: timelineError,
  } = useQuery({
    queryKey: ["timelineData"],
    queryFn: () => fetchTimelineData(leadData?.timeline),
    enabled: !!leadData?.timeline && view == "timeline",
  });

  if (timelineError) return <div>Error loading timeline data.</div>;

  const renderContent = () => {
    if (view === "overview") {
      return (
        <>
          <LeadPipelineStatus leadData={leadData} />
          <LeadDetailsSidebar leadData={leadData} />
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
              selectedData={leadData}
              moduleName={MODULES.LEADS}
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
            <PageHeader pageName="Lead Overview" />
          </div>
        </div>
        <div className="row">
          {isLoading ? (
            <LoaderComponent />
          ) : isError ? (
            <div className="col-md-12">
              <div className="alert alert-danger text-capitalize" role="alert">
                {error?.response?.data?.msg}
              </div>
            </div>
          ) : (
            <LeadDetailsHeader
              leadData={leadData}
              view={view}
              setView={setView} // Pass the setter function
            />
          )}
        </div>
        <div className="row">{renderContent()}</div>
      </div>
    </div>
  );
};

export default LeadsDetails;
