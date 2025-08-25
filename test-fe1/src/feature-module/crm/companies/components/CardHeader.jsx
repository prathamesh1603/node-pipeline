import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { handleOffcanvasAction } from "../../../../utils/helpers/handleOffcanvasAction";
import HasPermission from "../../../../core/common/wrapper/HasPermission";
import {
  MODULES,
  MODULES_ACTIONS,
} from "../../../../core/data/constants/moduleConstants";
import Filter from "./Filter";

const CardHeader = ({
  totalCount,
  toggleLayout,
  layout,
  filterData,
  setFilterData,
}) => {
  const handleAddCompany = () => {
    if (totalCount === 5) {
      toast.error("Limit reached: Cannot add more than 5 organization.");
      handleOffcanvasAction("offcanvas_add", "hide");
    } else {
      handleOffcanvasAction("offcanvas_add", "show");
    }
  };
  return (
    <div className="card-header">
      {/* Search */}
      <div className="row align-items-center">
        {/* <div className="col-sm-8"> */}
        <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-between">
          {/* <div className="dropdown me-2">
            <Link to="#" className="dropdown-toggle" data-bs-toggle="dropdown">
              <i className="ti ti-package-export me-2" />
              Export
            </Link>
            <div className="dropdown-menu  dropdown-menu-end">
              <ul>
                <li>
                  <Link to="#" className="dropdown-item">
                    <i className="ti ti-file-type-pdf text-danger me-1" />
                    Export as PDF
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item">
                    <i className="ti ti-file-type-xls text-green me-1" />
                    Export as Excel{" "}
                  </Link>
                </li>
              </ul>
            </div>
          </div> */}
          <Filter
            layout={layout}
            toggleLayout={toggleLayout}
            filterData={filterData}
            setFilterData={setFilterData}
          />
          <div className="d-flex gap-2 align-items-center">
            <div>
              <HasPermission
                module={MODULES.COMPANIES}
                action={MODULES_ACTIONS.CREATE}
              >
                <Link
                  to="#"
                  className="btn btn-primary"
                  onClick={handleAddCompany}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Company
                </Link>
              </HasPermission>
            </div>
            <div>
              {/* layout */}
              <div className="view-icons">
                <Link
                  to="#"
                  className={layout === "list" ? "active" : ""}
                  onClick={toggleLayout}
                >
                  <i className="ti ti-list-tree" />
                </Link>
                <Link
                  to="#"
                  className={layout === "grid" ? "active" : ""}
                  onClick={toggleLayout}
                >
                  <i className="ti ti-grid-dots" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
      {/* /Search */}
    </div>
  );
};

export default CardHeader;
