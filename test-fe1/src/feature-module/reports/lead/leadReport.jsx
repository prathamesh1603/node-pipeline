import React, { useEffect, useState } from "react";
import ReportsModal from "../../../core/modals/reports_modal";
import { Link, useSearchParams } from "react-router-dom";
import { useLeadsData } from "../../crm/leads/hooks/useLeadsData";
import PageHeader from "../../../core/common/crmComponents/PageHeader";
import LeadList from "./components/LeadList";
import LoaderComponent from "../../../core/common/crmComponents/LoaderComponent";
import PaginationControls from "../../../core/common/pagination";
import CompanyFilter from "../../../core/common/crmComponents/CompanyFilter";
import Filter from "../common-components/Filter";
import api from "../../../utils/api";
import LeadsByYearBarChart from "./components/LeadsByYearBarChart";
import LeadsBySourceChart from "./components/LeadsBySourceChart";
import { useSelector } from "react-redux";

const LeadReport = () => {
  const user = JSON.parse(localStorage.getItem("user") || []);
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(1); // Manage current page state
  const [limit, setLimit] = useState(25);

  const [layout, setLayout] = useState("list");
  const { companyNameArr } = useSelector((state) => state.auth);

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

  const [filterData, setFilterData] = useState({
    searchKeys: ["firstName", "lastName", "mobile", "email"],
    searchOnKey: "firstName",
    searchValue: "",
  });
  const toggleLayout = () => {
    setLayout((prevLayout) => (prevLayout === "list" ? "grid" : "list"));
  };

  const { data, isLoading, isError, error, isFetching } = useLeadsData({
    page,
    limit,
    ofCompany: selectedCompany,
    searchKey: filterData.searchOnKey,
    searchValue: filterData.searchValue,
  });

  const [reportDataFilter, setReportDataFilter] = useState({
    format: "excel",
    fromDate: "",
    toDate: "",
    filters: {},
  });

  const leadsData = data?.data?.data;

  const totalCount = data?.data?.totalResult;

  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage) => {
    setPage(newPage); // Update page state to trigger refetch
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(
        `/file-export/downlode-lead-report?createdTime[gt]=${reportDataFilter.fromDate}&createdTime[lte]=${reportDataFilter.toDate}`,
        {
          params: {
            format: reportDataFilter.format,
            ofCompany: selectedCompany,
          },
          responseType: "blob", // Important for handling binary data
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  useEffect(() => {
    // Reset page to 1 whenever the filter changes
    setPage(1);
  }, [filterData]);

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <PageHeader
                pageName="Leads Report"
                totalCount={totalCount || 0}
              />
              <div className="card">
                <div className="card-header">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    {/* Left Section */}
                    <div className="d-flex flex-wrap gap-3">
                      {/* Company Filter */}
                      <CompanyFilter
                        selectedCompany={selectedCompany}
                        setSelectedCompany={setSelectedCompany}
                        user={user}
                      />

                      {/* Filter Component */}
                      <Filter
                        layout={layout}
                        toggleLayout={toggleLayout}
                        filterData={filterData}
                        setFilterData={setFilterData}
                      />
                    </div>

                    {/* Right Section */}
                    <div className="d-flex align-items-center gap-3">
                      {/* Add Lead Button */}
                      <Link
                        to="download_report"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#download_report"
                      >
                        <i className="ti ti-file-download me-2" />
                        Download Report
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <LeadsByYearBarChart selectedCompany={selectedCompany} />
                    {/* <LeadsBySourceChart
                      user={user}
                      selectedCompany={selectedCompany}
                    /> */}
                  </div>

                  {isLoading ? (
                    <LoaderComponent />
                  ) : isError ? (
                    <div>Error: {error.message}</div>
                  ) : layout === "list" ? (
                    <LeadList leadsData={leadsData} />
                  ) : (
                    <></>
                  )}

                  {limit !== 5 && (
                    <PaginationControls
                      totalPages={totalPages}
                      totalCount={totalCount}
                      currentPageDataCount={leadsData?.length || 0}
                      onPageChange={handlePageChange}
                      isFetching={isFetching}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* /Page Wrapper */}
      <ReportsModal
        handleDownload={handleDownload}
        reportDataFilter={reportDataFilter}
        setReportDataFilter={setReportDataFilter}
      />
    </div>
  );
};

export default LeadReport;
