import React from "react";
import { Link } from "react-router-dom";
import Filter from "./Filter";
import CompanyFilter from "../../../../core/common/crmComponents/CompanyFilter";

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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        {/* Left Section */}
        <div className="d-flex flex-wrap gap-3">
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
          {/* Layout Toggle */}
          {/* <div className="view-icons d-flex gap-2">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
