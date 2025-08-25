import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import customModulesApi from "../api/customModulesApi";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import { IoIosArrowRoundBack } from "react-icons/io";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import { Radio, Button, Table } from "antd";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import RoleFilter from "../../../../core/common/crmComponents/RoleFilter";
import {
  EDITED_SUCCESS_MSG,
  ERROR_MSG,
} from "../../../../core/data/constants/constant";
import { Link, useSearchParams } from "react-router-dom";
import HasPermission from "../../../../core/common/wrapper/HasPermission";
import {
  MODULES,
  MODULES_ACTIONS,
} from "../../../../core/data/constants/moduleConstants";
import { all_routes } from "../../../router/all_routes";
import useModuleData from "../hooks/useModuleData";
import useUpdateModule from "../hooks/useUpdateModule";

const FieldPermissions = () => {
  const [searchParams] = useSearchParams();
  const route = all_routes;
  const id = searchParams.get("id");
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state?.auth);
  const userRole = user?.role?.name;

  const [selectedRole, setSelectedRole] = useState(userRole);
  const [permissions, setPermissions] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState([]);

  // Fetch module data
  const { data, isLoading, isError, error } = useModuleData(id);
  const mutationUpdate = useUpdateModule(setHasChanges); // update module data

  const fields = data?.fields || [];
  const groupedFields = fields.reduce((acc, group) => {
    acc[group.groupName] = group.groupFields || [];
    return acc;
  }, {});

  useEffect(() => {
    if (data) {
      const updatedPermissions = fields.reduce((acc, group) => {
        group.groupFields.forEach((field) => {
          const userPermission = field?.rolePermission?.find(
            (role) => role.role === selectedRole
          )?.permission;
          acc[field.label] = userPermission || "dont-show";
        });
        return acc;
      }, {});
      setPermissions(updatedPermissions);
    }
  }, [data, selectedRole, fields]);

  const handlePermissionChange = (fieldLabel, value) => {
    setPermissions((prev) => {
      const updatedPermissions = { ...prev, [fieldLabel]: value };
      setHasChanges(true);
      return updatedPermissions;
    });
  };

  const handleSaveChanges = () => {
    if (!hasChanges) {
      toast.warning("No changes made to save.");
      return;
    }

    const updatedFields = fields.map((group) => ({
      ...group,
      groupFields: group.groupFields.map((field) => {
        const updatedRolePermission = [
          ...field.rolePermission.filter((role) => role.role !== selectedRole),
          { permission: permissions[field.label], role: selectedRole },
        ];
        return { ...field, rolePermission: updatedRolePermission };
      }),
    }));

    const updatedData = { ...data, fields: updatedFields };
    mutationUpdate.mutate({ id, updatedData });
  };

  const toggleGroupExpansion = (groupName) => {
    setExpandedGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((group) => group !== groupName)
        : [...prev, groupName]
    );
  };

  const columns = [
    {
      title: "Group Name",
      dataIndex: "groupName",
      render: (text, record) => {
        const isExpanded = expandedGroups.includes(record?.groupName);
        const hasMultipleFields = groupedFields[record?.groupName]?.length > 1;
        return (
          <span
            onClick={() =>
              hasMultipleFields && toggleGroupExpansion(record?.groupName)
            }
            className="text-capitalize d-flex gap-2"
            style={{
              cursor: hasMultipleFields ? "pointer" : "default",
              fontWeight: "bold",
            }}
          >
            {text}{" "}
            {hasMultipleFields &&
              (isExpanded ? <UpOutlined /> : <DownOutlined />)}
          </span>
        );
      },
    },
    {
      title: "Field",
      dataIndex: "fieldLabel",
      render: (text, record) => {
        return <div className="text-capitalize">{text}</div>;
      },
    },
    {
      title: "Read And Write",
      dataIndex: "readAndWrite",
      render: (_, record) => (
        <Radio.Group
          onChange={(e) =>
            handlePermissionChange(record?.fieldLabel, "read-write")
          }
          value={
            permissions[record?.fieldLabel] === "read-write"
              ? "read-write"
              : null
          }
        >
          <Radio value="read-write" />
        </Radio.Group>
      ),
      align: "center",
      width: "150px",
    },
    {
      title: "Read Only",
      dataIndex: "readOnly",
      render: (_, record) => (
        <Radio.Group
          onChange={(e) =>
            handlePermissionChange(record?.fieldLabel, "read-only")
          }
          value={
            permissions[record?.fieldLabel] === "read-only" ? "read-only" : null
          }
        >
          <Radio value="read-only" />
        </Radio.Group>
      ),
      align: "center",
      width: "150px",
    },
    {
      title: "Don't Show",
      dataIndex: "dontShow",
      render: (_, record) => (
        <Radio.Group
          onChange={(e) =>
            handlePermissionChange(record?.fieldLabel, "dont-show")
          }
          value={
            permissions[record?.fieldLabel] === "dont-show" ? "dont-show" : null
          }
        >
          <Radio value="dont-show" />
        </Radio.Group>
      ),
      align: "center",
      width: "150px",
    },
  ];

  const dataSource = Object.keys(groupedFields).reduce((acc, groupName) => {
    const groupRows = groupedFields[groupName].map((field, index) => ({
      key: `${groupName}-${index}`,
      groupName: index === 0 ? groupName : "",
      fieldLabel: field?.label,
      permissions: field?.rolePermission,
      isGroupHeader: index === 0,
    }));

    if (!expandedGroups.includes(groupName)) {
      return [...acc, groupRows[0]]; // Add only the group header row if collapsed
    }

    return [...acc, ...groupRows]; // Add all group rows if expanded
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <PageHeader pageName={`${data?.moduleName || "Module"}`}>
              {" "}
              <button
                className="p-2 btn btn-outline-none"
                onClick={() => navigate(-1)}
              >
                <IoIosArrowRoundBack className="d-inline" size={20} />
              </button>
            </PageHeader>
            {!isLoading && (
              <p className="pb-1 mb-1 text-muted d-flex flex-wrap">
                Manage field permissions for
                <span className="mx-1">
                  {data?.moduleName || "this module"}
                </span>
                module in the company
                <strong className="ms-1">
                  {data?.ofCompany?.name || "N/A"}.
                </strong>
              </p>
            )}
            <div className="card">
              <div className="card-header">
                <div className=" border rounded-pill p-1 d-inline-flex gap-2 mb-3">
                  <div className="toggle-buttons-container">
                    <button
                      className={`btn rounded-pill ${
                        location.pathname?.includes(route.fieldListing)
                          ? "btn-primary"
                          : "btn-light"
                      }`}
                      onClick={() =>
                        navigate(`${route?.fieldListing}?id=${data?._id}`)
                      }
                    >
                      Field Listing
                    </button>
                    <button
                      className={`btn rounded-pill ${
                        location.pathname?.includes(route.fieldPermissions)
                          ? "btn-primary"
                          : "btn-light"
                      }`}
                      onClick={() =>
                        navigate(`${route?.fieldPermissions}?id=${data?._id}`)
                      }
                    >
                      Field Permissions
                    </button>
                  </div>
                </div>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                  {/* Left Section */}
                  <div className="d-flex flex-column flex-wrap gap-3">
                    {" "}
                    <RoleFilter
                      selectedRole={selectedRole}
                      setSelectedRole={setSelectedRole}
                      user={user}
                    />
                  </div>
                  <div className="text-sm-end">
                    <HasPermission
                      module={MODULES.CUSTOMMODULES}
                      action={MODULES_ACTIONS.CREATE}
                    >
                      <Link
                        to={`${route.moduleFields}?id=${id}`}
                        className="btn btn-primary"
                      >
                        <i className="ti ti-square-rounded-plus me-2" />
                        Create and Edit Fields
                      </Link>
                    </HasPermission>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <LoaderComponent />
                ) : isError ? (
                  <div>Error: {error.message}</div>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    rowKey={(record) => record?.key}
                  />
                )}
                <div className="d-flex justify-content-center mt-4">
                  <Button
                    type="primary"
                    onClick={handleSaveChanges}
                    disabled={!hasChanges}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldPermissions;
