import React, { useState } from "react";
import { all_routes } from "../../../router/all_routes";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import { useParams } from "react-router";
import DealDetailsHeader from "../components/DealDetailsHeader";
import DealDetailsSidebar from "../components/DealDetailsSidebar";
import { useDealData } from "../hooks/useDealData";
import DealPipelineStatus from "../components/DealPipelineStatus";
import DisplayTimeline from "../../../../core/common/crmComponents/DisplayTimeline";
import { MODULES } from "../../../../core/data/constants/moduleConstants";
import { useQuery } from "@tanstack/react-query";
import { fetchTimelineData } from "../../../../utils/helpers/apiHelpers";

const DealsDetails = () => {
  const route = all_routes;

  const { id: dealId } = useParams();

  const { dealData, isLoading, isError, error } = useDealData(dealId);

  const [view, setView] = useState("overview"); // State for view
  console.log(dealData);

  const {
    data: timelineData,
    isLoading: timelineLoading,
    isError: timelineError,
  } = useQuery({
    queryKey: ["timelineData"],
    queryFn: () => fetchTimelineData(dealData?.timeline),
    enabled: !!dealData?.timeline && view == "timeline",
  });

  if (timelineError) return <div>Error loading timeline data.</div>;

  const renderContent = () => {
    if (view === "overview") {
      return (
        <>
          <DealPipelineStatus dealData={dealData} />
          <DealDetailsSidebar dealData={dealData} />
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
              selectedData={dealData}
              moduleName={MODULES.DEALS}
            />
          )}
        </>
      );
    }
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <PageHeader pageName="Deal Overview" />
              {/* /Page Header */}
            </div>
          </div>
          <div className="row">
            {isLoading ? (
              <LoaderComponent />
            ) : isError ? (
              <div className="col-md-12">
                <div
                  className="alert alert-danger text-capitalize"
                  role="alert"
                >
                  {error?.response?.data?.msg}
                </div>
              </div>
            ) : (
              <DealDetailsHeader
                dealData={dealData}
                view={view}
                setView={setView}
              />
            )}
          </div>
          <div className="row">{renderContent()}</div>
        </div>
      </div>
    </>
  );
};

export default DealsDetails;
