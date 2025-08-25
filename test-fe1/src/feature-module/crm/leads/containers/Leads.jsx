import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardHeader from "../components/CardHeader";
import Filter from "../components/Filter";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import PaginationControls from "../../../../core/common/pagination";
import AddLead from "../actions/AddLead";
import EditLead from "../actions/EditLead";
import DeleteLead from "../actions/DeleteLead";
import LeadList from "../components/LeadList";
import LeadGridLayout from "../components/LeadGridLayout";
import { useLeadsData } from "../hooks/useLeadsData";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import { useDebounce } from "use-debounce";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import {
  MODULES,
  MODULES_ACTIONS,
} from "../../../../core/data/constants/moduleConstants";
import { useUsersData } from "../../manageUsers/hooks/useUsersData";
import HasPermission from "../../../../core/common/wrapper/HasPermission";

const Leads = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = JSON.parse(localStorage.getItem("user") || []);
  const [layout, setLayout] = useState("list");
  const [page, setPage] = useState(1); // Manage current page state
  const [limit, setLimit] = useState(25);
  const [filterData, setFilterData] = useState({
    searchKeys: ["firstName", "lastName", "mobile", "email"],
    searchOnKey: "firstName",
    searchValue: "",
  });

  useEffect(() => {
    // Reset page to 1 whenever the filter changes
    setPage(1);
  }, [filterData]);

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

  const [debouncedSearchTerm] = useDebounce(filterData.searchValue, 1500);

  const toggleLayout = () => {
    setLayout((prevLayout) => (prevLayout === "list" ? "grid" : "list"));
  };

  const { data, isLoading, isError, error, isFetching } = useLeadsData({
    page,
    limit,
    searchKey: filterData.searchOnKey,
    searchValue: debouncedSearchTerm,
    ofCompany: selectedCompany,
  });

  const leadsData = data?.data?.data;

  const totalCount = data?.data?.totalResult;
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage) => {
    setPage(newPage); // Update page state to trigger refetch
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <PageHeader pageName="Leads" totalCount={totalCount || 0} />
              <div className="card">
                <CardHeader
                  layout={layout}
                  toggleLayout={toggleLayout}
                  filterData={filterData}
                  setFilterData={setFilterData}
                  selectedCompany={selectedCompany}
                  setSelectedCompany={setSelectedCompany}
                />
                <div className="card-body">
                  {isLoading ? (
                    <LoaderComponent />
                  ) : isError ? (
                    <div>Error: {error.message}</div>
                  ) : layout === "list" ? (
                    <LeadList
                      leadsData={leadsData}
                      selectedCompany={selectedCompany}
                    />
                  ) : (
                    <LeadGridLayout leadsData={leadsData} />
                  )}

                  {limit !== 5 && (
                    <PaginationControls
                      totalPages={totalPages}
                      totalCount={totalCount}
                      currentPageDataCount={leadsData?.length || 0}
                      onPageChange={handlePageChange}
                      isFetching={isFetching}
                      moduleName={MODULES.LEADS}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HasPermission module={MODULES.LEADS} action={MODULES_ACTIONS.CREATE}>
        <AddLead />
      </HasPermission>

      <DeleteLead />
    </>
  );
};

export default Leads;
