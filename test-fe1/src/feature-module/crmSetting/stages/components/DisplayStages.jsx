import React, { useEffect, useState } from "react";
import { List, arrayMove } from "react-movable";
import Table from "../../../../core/common/dataTable/index";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { IoIosArrowRoundBack } from "react-icons/io";

const DisplayStages = ({
  stages,
  user,
  setStageData,
  isLoading,
  isError,
  error,
  moduleName,
  onSaveOrder, // New prop for handling order save
  children,
}) => {
  const [isReordering, setIsReordering] = useState(false);
  const [reorderedStages, setReorderedStages] = useState([]);

  const columns = [
    {
      title: "Stage",
      render: (text) => (
        <div
          className="text-capitalize badge badge-pill badge-status py-2"
          style={{ backgroundColor: text?.color || "#ccc" }}
        >
          {text?.name || "N/A"}
        </div>
      ),

      width: "235px",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "128px",
      render: (_, record) => (
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
              className="dropdown-item edit-popup"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit_stage"
              onClick={() => setStageData({ ...record, module: moduleName })}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
          </div>
        </div>
      ),
    },
  ];
  const handleCancleReorder = () => {
    setIsReordering(false);
  };

  const handleReorderClick = () => {
    setIsReordering(true);
    setReorderedStages(stages);
  };

  const handleSaveOrder = async () => {
    onSaveOrder({ module: moduleName, stages: reorderedStages });
    setIsReordering(false);
  };

  if (isLoading) return <LoaderComponent />;
  if (isError) return <div>Error: {error?.message || "An error occurred"}</div>;

  return (
    <div className="w-full border border-1 mb-3">
      <div className="d-flex justify-content-between px-3 py-2 align-items-center ">
        <div className="d-flex align-items-center text-capitalize">
          <span className="avatar avatar-md rounded text-dark border me-2">
            <i className="ti ti-steam fs-20" />{" "}
          </span>
          {moduleName} Stages
        </div>
        <div className="d-flex justify-content-around gap-2 my-2">
          {isReordering && (
            <button
              className="px-2  btn-outline-light"
              onClick={handleCancleReorder}
            >
              <IoIosArrowRoundBack className="d-inline" size={20} />
            </button>
          )}
          {!isReordering ? (
            <Button onClick={handleReorderClick} className="">
              Change Order
            </Button>
          ) : (
            <>
              <Button onClick={handleSaveOrder}>Save Order</Button>
            </>
          )}
        </div>
      </div>
      {children && <div className="mb-3">{children}</div>}

      {!isReordering ? (
        <Table columns={columns} dataSource={stages} />
      ) : (
        <List
          values={reorderedStages}
          onChange={({ oldIndex, newIndex }) => {
            setReorderedStages(arrayMove(reorderedStages, oldIndex, newIndex));
          }}
          renderList={({ children, props }) => (
            <div {...props} className="space-y-2">
              {children}
            </div>
          )}
          renderItem={({ value, props }) => (
            <div
              {...props}
              className="p-4 bg-white border rounded-lg shadow cursor-move hover:bg-gray-50"
            >
              <div
                className="text-capitalize badge badge-pill badge-status py-2"
                style={{ backgroundColor: value?.color || "#ccc" }}
              >
                {value?.name || "N/A"}
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default DisplayStages;
