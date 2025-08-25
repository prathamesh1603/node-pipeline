import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardHeader from "../components/CardHeader";
import Filter from "../components/Filter";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import PaginationControls from "../../../../core/common/pagination";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import { useDebounce } from "use-debounce";
import DeleteDeal from "../actions/DeleteDeal";
import DealList from "../components/DealList";
import DealGridLayout from "../components/DealGridLayout";
import { useDealsData } from "../hooks/useDealsData";
import { MODULES } from "../../../../core/data/constants/moduleConstants";
import { useSearchParams } from "react-router-dom";

const Deals = () => {
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

  const { data, isLoading, isError, error, isFetching } = useDealsData({
    page,
    limit,
    searchKey: filterData.searchOnKey,
    searchValue: debouncedSearchTerm,
    ofCompany: selectedCompany,
  });

  const dealsData = data?.data?.data;

  const totalCount = data?.data?.totalResult;
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage) => {
    setPage(newPage); // Update page state to trigger refetch
  };

  useEffect(() => {
    // Reset page to 1 whenever the filter changes
    setPage(1);
  }, [filterData]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <PageHeader pageName="Deals" totalCount={totalCount || 0} />
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
                    <DealList dealsData={dealsData} />
                  ) : (
                    <DealGridLayout dealsData={dealsData} />
                  )}

                  {limit !== 5 && (
                    <PaginationControls
                      totalPages={totalPages}
                      totalCount={totalCount}
                      currentPageDataCount={dealsData?.length || 0}
                      onPageChange={handlePageChange}
                      isFetching={isFetching}
                      moduleName={MODULES.DEALS}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteDeal />
    </>
  );
};

export default Deals;
