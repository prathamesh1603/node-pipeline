import React, { useEffect, useState } from "react";
import Table from "../../../../core/common/dataTable/index";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";

import HasPermission from "../../../../core/common/wrapper/HasPermission";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import {
  MODULES,
  MODULES_ACTIONS,
} from "../../../../core/data/constants/moduleConstants";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useLayoutData } from "../hooks/useLayoutData";
import { useSelector } from "react-redux";
import CompanyFilter from "../../../../core/common/crmComponents/CompanyFilter";

const CustomModulesAndFields = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const { user, companyNameArr } = useSelector((state) => state?.auth);
  const [searchParams, setSearchParams] = useSearchParams();

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

  const { data, isLoading, isError, error, isFetching } = useLayoutData({
    ofCompany: selectedCompany,
  });
  const dataSource = data?.data?.data;

  const columns = [
    {
      title: "Module Name",
      dataIndex: "moduleName",
      render: (text, record) => <div className="text-capitalize">{text}</div>,
      width: "235px",
    },
    {
      title: "Last Modified",
      dataIndex: "updatedAt",
      render: (text, record) => (
        <div>{new Date(text).toLocaleDateString()} </div>
      ),
      key: "createdAt",
      width: "316px",
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "128px",
      render: (text, record) => (
        <div className="dropdown table-action">
          <Link
            to="#"
            className="action-icon"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link
              className="dropdown-item"
              to={`${route.fieldListing}?id=${record?._id}`}
            >
              Fields
            </Link>
            {/* <Link
              className="dropdown-item"
              to={`${route.rolesPermissions}?id=${record?._id}`}
            >
              Module Permissin
            </Link> */}
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <PageHeader pageName="Modules">
                <button
                  className="p-2 btn btn-outline-none"
                  onClick={() => navigate(all_routes.settings)}
                >
                  <IoIosArrowRoundBack className="d-inline" size={20} />
                </button>
              </PageHeader>
              <div className="card">
                <div className="card-header">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    {/* Left Section */}
                    <div className="d-flex flex-wrap gap-3">
                      {" "}
                      <CompanyFilter
                        selectedCompany={selectedCompany}
                        setSelectedCompany={setSelectedCompany}
                        user={user}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {/* Modules List */}
                  <div className="table-responsive custom-table">
                    {isLoading ? (
                      <LoaderComponent />
                    ) : isError ? (
                      <div>Error: {error.message}</div>
                    ) : (
                      <Table
                        columns={columns}
                        dataSource={dataSource}
                        rowKey={(record) => record._id || record.moduleName}
                      />
                    )}
                  </div>
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="datatable-length" />
                    </div>
                    <div className="col-md-6">
                      <div className="datatable-paginate" />
                    </div>
                  </div>
                  {/* /Modules List */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default CustomModulesAndFields;
