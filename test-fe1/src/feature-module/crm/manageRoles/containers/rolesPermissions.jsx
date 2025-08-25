import React from "react";
import Table from "../../../../core/common/dataTable/index";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AddRoleModal from "../components/AddRoleModal";
import { all_routes } from "../../../router/all_routes";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import { useRolesData } from "../hooks/useRolesData";

import HasPermission from "../../../../core/common/wrapper/HasPermission";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import {
  MODULES,
  MODULES_ACTIONS,
} from "../../../../core/data/constants/moduleConstants";
import { IoIosArrowRoundBack } from "react-icons/io";

const RolesPermissions = () => {
  const route = all_routes;
  const navigate = useNavigate();

  const columns = [
    {
      title: "Role Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="text-capitalize">{text.split("-").join(" ")}</div>
      ),
      width: "235px",
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      sorter: (a, b) => a?.createdAt?.length - b?.createdAt?.length,
      render: (text, record) => (
        <div>
          {text
            ? new Date(text).toLocaleDateString()
            : new Date(record?.updatedAt).toLocaleDateString()}
        </div>
      ),
      key: "createdAt",
      width: "316px",
    },
    {
      title: "Updated at",
      dataIndex: "updatedAt",
      sorter: (a, b) => a?.updatedAt?.length - b?.updatedAt?.length,
      render: (text, record) => (
        <div>
          {text
            ? new Date(text)?.toLocaleDateString()
            : new Date(record?.createdAt)?.toLocaleDateString()}
        </div>
      ),
      // key: "updatedAt",
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
            {/* <Link
              className="dropdown-item edit-popup"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit_role"
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link> */}
            <Link
              className="dropdown-item"
              to={route.permissions}
              state={{
                controls: record?.control,
                readVisibility: record?.readVisibility,
                id: record._id,
                name: record?.name,
              }}
            >
              <i className="ti ti-shield text-success" /> Permission
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const { data, isLoading, isError, error, isFetching } = useRolesData();
  const dataSource = data?.data?.data;

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <PageHeader pageName="Roles">
                <button
                  className="p-2 btn btn-outline-none"
                  onClick={() => navigate(all_routes.settings)}
                >
                  <IoIosArrowRoundBack className="d-inline" size={20} />
                </button>
              </PageHeader>
              <div className="card">
                <div className="card-header">
                  {/* Search */}
                  <div className="row align-items-start">
                    <div className="text-sm-end">
                      <HasPermission
                        module={MODULES.ROLES}
                        action={MODULES_ACTIONS.CREATE}
                      >
                        <Link
                          to="#"
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#add_role"
                        >
                          <i className="ti ti-square-rounded-plus me-2" />
                          Add New Roles
                        </Link>
                      </HasPermission>
                    </div>
                  </div>
                  {/* /Search */}
                </div>
                <div className="card-body">
                  {/* Roles List */}
                  <div className="table-responsive custom-table">
                    {isLoading ? (
                      <LoaderComponent />
                    ) : isError ? (
                      <div>Error: {error.message}</div>
                    ) : (
                      <Table columns={columns} dataSource={dataSource} />
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
                  {/* /Roles List */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <AddRoleModal />
      {/* <EditRoleModal /> */}
    </>
  );
};

export default RolesPermissions;
