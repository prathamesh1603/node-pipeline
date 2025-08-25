import React from "react";
import { Link } from "react-router-dom";
import Filter from "./Filter";
import HasPermission from "../../../core/common/wrapper/HasPermission";
import CompanyFilter from "../../../core/common/crmComponents/CompanyFilter";
import {
  MODULES,
  MODULES_ACTIONS,
} from "../../../core/data/constants/moduleConstants";

const CardHeader = ({
  toggleLayout,
  layout,
  filterData,
  setFilterData,
  selectedCompany,
  setSelectedCompany,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="card-header">
      <div className="d-flex align-items-center justify-content-between">
        {/* Left Section */}
        <div className="d-flex align-items-center gap-3">
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
          <HasPermission module={MODULES.LEADS} action={MODULES_ACTIONS.CREATE}>
            <Link
              to="#"
              className="btn btn-primary d-flex align-items-center gap-2"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_add"
            >
              <i className="ti ti-square-rounded-plus" /> Add Lead
            </Link>
          </HasPermission>

          {/* Layout Toggle */}
          <div className="view-icons d-flex gap-2">
            <Link
              to="#"
              className={`view-icon ${layout === "list" ? "active" : ""}`}
              onClick={() => toggleLayout("list")}
            >
              <i className="ti ti-list-tree" />
            </Link>
            <Link
              to="#"
              className={`view-icon ${layout === "grid" ? "active" : ""}`}
              onClick={() => toggleLayout("grid")}
            >
              <i className="ti ti-grid-dots" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
