import React, { useEffect, useState } from "react";
import { all_routes } from "../../router/all_routes";
import CollapseHeader from "../../../core/common/collapse-header";
import RecentlyCreatedLeads from "./components/RecentlyCreatedLeads";
import { useStages } from "../../crmSetting/stages/hooks/useStages";
import { useSelector } from "react-redux";
import { MODULES } from "../../../core/data/constants/moduleConstants";
import LeadsByStagePieChart from "./components/LeadsByStagePieChart";
import LeadsByDateBarChart from "./components/LeadsByDateBarChart";
import LeadsByStagesBarChart from "./components/LeadsByStagesBarChart";
import LeadsByMonthBarChart from "./components/LeadsByMonthBarChart";
import CompanyFilter from "../../../core/common/crmComponents/CompanyFilter";
import LeadsByYearGraph from "./components/LeadsByYearGraph";
import { useLocation, useSearchParams } from "react-router-dom";

const route = all_routes;
const LeadsDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { companyNameArr } = useSelector((state) => state.auth);

  const route = all_routes;

  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (location.pathname === route.leadsDashboard) {
      setShowLoader(true);
      setTimeout(() => {
        setShowLoader(false);
      }, 3000);
    }
  }, [location.pathname]);

  const { user } = useSelector((state) => state?.auth);
  const [selectedCompany, setSelectedCompany] = useState(() => {
    const companyIdFromParams = searchParams.get("companyid");

    return companyIdFromParams
      ? companyIdFromParams
      : user?.ofCompany
      ? user?.ofCompany?._id
      : companyNameArr.length > 0
      ? companyNameArr[0].value
      : null;
  });

  const { stagesData } = useStages({
    ofCompany: selectedCompany,
    module: MODULES.LEADS,
  });

  const stages = stagesData?.data?.data;

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="page-header">
                <div className="row align-items-center ">
                  <div className="col-md-4">
                    <h3 className="page-title">Leads Dashboard</h3>
                  </div>
                  <div className="col-md-8 float-end ms-auto">
                    <div className="d-flex gap-2 title-head">
                      <CompanyFilter
                        selectedCompany={selectedCompany}
                        setSelectedCompany={setSelectedCompany}
                        user={user}
                      />
                      <div className="daterange-picker d-flex align-items-center justify-content-center">
                        <div className="head-icons mb-0">
                          <CollapseHeader />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <RecentlyCreatedLeads selectedCompany={selectedCompany} />
            <LeadsByDateBarChart
              stages={stages}
              selectedCompany={selectedCompany}
            />
          </div>
          <div className="row">
            <LeadsByStagesBarChart
              stages={stages}
              selectedCompany={selectedCompany}
            />

            <LeadsByStagePieChart
              stages={stages}
              selectedCompany={selectedCompany}
            />
          </div>
          <div className="row">
            <LeadsByYearGraph selectedCompany={selectedCompany} />
            <LeadsByMonthBarChart selectedCompany={selectedCompany} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsDashboard;
