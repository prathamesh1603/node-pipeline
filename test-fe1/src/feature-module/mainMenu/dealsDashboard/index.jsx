import ApexCharts from "apexcharts";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import CollapseHeader from "../../../core/common/collapse-header";
import RecentlyCreatedDeals from "./components/RecentlyCreatedDeals";
import CompanyFilter from "../../../core/common/crmComponents/CompanyFilter";
import DealsByDateBarChart from "./components/DealsByDateBarChart";
import DealsByStagesBarChart from "./components/DealsByStagesBarChart";
import DealsByStagePieChart from "./components/DealsByStagePieChart";
import DealsByMonthBarChart from "./components/DealsByMonthBarChart";
import { useStages } from "../../crmSetting/stages/hooks/useStages";
import { useSelector } from "react-redux";
import { MODULES } from "../../../core/data/constants/moduleConstants";
import DealsByYearGraph from "./components/DealsByYearGraph";
import { all_routes } from "../../router/all_routes";

const DealsDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { companyNameArr } = useSelector((state) => state.auth);
  const route = all_routes;

  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (location.pathname === route.dealsDashboard) {
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
    module: MODULES.DEALS,
  });

  const stages = stagesData?.data?.data;

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="page-header">
                <div className="row align-items-center ">
                  <div className="col-md-4">
                    <h3 className="page-title">Deals Dashboard</h3>
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
            <RecentlyCreatedDeals selectedCompany={selectedCompany} />
            <DealsByDateBarChart
              stages={stages}
              selectedCompany={selectedCompany}
            />
          </div>
          <div className="row">
            <DealsByStagesBarChart
              stages={stages}
              selectedCompany={selectedCompany}
            />

            <DealsByStagePieChart
              stages={stages}
              selectedCompany={selectedCompany}
            />
          </div>
          <div className="row">
            <DealsByYearGraph selectedCompany={selectedCompany} />
            <DealsByMonthBarChart selectedCompany={selectedCompany} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DealsDashboard;
