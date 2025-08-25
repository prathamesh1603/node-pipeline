import React from "react";
import { Link } from "react-router-dom";
import HasPermission from "../../../../core/common/wrapper/HasPermission";
import {
  MODULES,
  MODULES_ACTIONS,
} from "../../../../core/data/constants/moduleConstants";
import Filter from "./Filter";
import CompanyFilter from "../../../../core/common/crmComponents/CompanyFilter";

const CardHeader = ({
  selectedCompany,
  setSelectedCompany,
  user,
  filterData,
  setFilterData,
}) => {
  return (
    <div className="card-header">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        {/* Filters */}
        <div className="d-flex flex-wrap gap-3">
          <CompanyFilter
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
            user={user}
          />
          <div className="d-flex align-items-center flex-wrap">
            <Filter filterData={filterData} setFilterData={setFilterData} />
          </div>
        </div>

        {/* Add User Button */}
        <HasPermission module={MODULES.USERS} action={MODULES_ACTIONS.CREATE}>
          <Link
            to="#"
            className="btn btn-primary"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvas_add"
          >
            <i className="ti ti-square-rounded-plus me-2" />
            Add user
          </Link>
        </HasPermission>
      </div>
    </div>
  );
};

export default CardHeader;
