import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardHeader from "../components/CardHeader";
import Filter from "../components/Filter";
import DeleteCompany from "../actions/DeleteCompany";
import EditCompany from "../actions/EditCompany";
import AddCompany from "../actions/AddCompany";
import CompanyList from "../components/CompanyList";
import CompanyGridLayout from "../components/CompanyGridLayout";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import { useCompaniesData } from "../hooks/useCompaniesData";
import { useDebounce } from "use-debounce";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";

const Companies = () => {
  const [layout, setLayout] = useState("list");
  const [filterData, setFilterData] = useState({
    searchKeys: ["name", "mobile", "email"],
    searchOnKey: "name",
    searchValue: "",
  });
  const [debouncedSearchTerm] = useDebounce(filterData.searchValue, 1500);

  const toggleLayout = () => {
    setLayout((prevLayout) => (prevLayout === "list" ? "grid" : "list"));
  };

  const { data, isLoading, isError, error, isFetching } = useCompaniesData({
    searchKey: filterData.searchOnKey,
    searchValue: debouncedSearchTerm,
  });

  const companiesData = data?.data?.data;
  const totalCount = data?.data?.totalResult;

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <PageHeader pageName="Companies" totalCount={totalCount || 0} />
              <div className="card">
                <CardHeader
                  totalCount={totalCount}
                  layout={layout}
                  toggleLayout={toggleLayout}
                  filterData={filterData}
                  setFilterData={setFilterData}
                />
                {/* <Filter layout={layout} toggleLayout={toggleLayout} filterData={filterData} setFilterData={setFilterData}  /> */}
                <div className="card-body">
                  {isLoading ? (
                    <LoaderComponent />
                  ) : isError ? (
                    <div>Error: {error.message}</div>
                  ) : layout === "list" ? (
                    <CompanyList companiesData={companiesData} />
                  ) : (
                    <CompanyGridLayout companiesData={companiesData} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddCompany />
      <DeleteCompany />
    </>
  );
};

export default Companies;
