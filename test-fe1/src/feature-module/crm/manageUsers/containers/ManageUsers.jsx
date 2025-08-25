import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import CardHeader from "../components/CardHeader";
import AddUser from "../actions/AddUser";
import UserList from "../components/UserList";
import PaginationControls from "../../../../core/common/pagination";
import { useUsersData } from "../hooks/useUsersData";
import { useEffect, useState } from "react";
import { MODULES } from "../../../../core/data/constants/moduleConstants";
import { useDebounce } from "use-debounce";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import { useLocation, useNavigate } from "react-router";
import { Link, useSearchParams } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";

const Manageusers = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || []);
  const roleNameArr = JSON.parse(localStorage.getItem("roleNameArr"));
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
    searchKeys: ["name", "mobile", "email"],
    searchOnKey: "name",
    searchValue: "",
  });
  const [debouncedSearchTerm] = useDebounce(filterData.searchValue, 1500);

  const { data, isLoading, isError, error, isFetching } = useUsersData({
    page,
    limit, // Pass the current page dynamically
    searchKey: filterData.searchOnKey,
    searchValue: debouncedSearchTerm,
    ofCompany: selectedCompany,
  });

  const usersData = data?.data?.data;

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
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <PageHeader pageName="Users" totalCount={totalCount}>
                <button
                  className="p-2 btn btn-outline-none"
                  onClick={() => navigate(all_routes.settings)}
                >
                  <IoIosArrowRoundBack className="d-inline" size={20} />
                </button>
              </PageHeader>

              <div className="card">
                <CardHeader
                  filterData={filterData}
                  setFilterData={setFilterData}
                  selectedCompany={selectedCompany}
                  setSelectedCompany={setSelectedCompany}
                  user={user}
                />
                <div className="card-body">
                  {/* <Filter /> */}
                  {isLoading ? (
                    <LoaderComponent />
                  ) : (
                    <UserList usersData={usersData} />
                  )}
                  <PaginationControls
                    totalCount={totalCount}
                    totalPages={totalPages}
                    currentPageDataCount={usersData?.length || 0}
                    onPageChange={handlePageChange}
                    isFetching={isFetching}
                    moduleName={MODULES.USERS}
                    limit={limit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <AddUser roleNameArr={roleNameArr} companyNameArr={companyNameArr} />
      {/* <DeleteUser /> */}
    </>
  );
};

export default Manageusers;
