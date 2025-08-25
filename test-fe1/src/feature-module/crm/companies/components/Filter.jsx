import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import {
  resetFilters,
  setFilters,
} from "../../../../core/data/redux/commonSlice";
const Filter = ({ toggleLayout, layout, filterData, setFilterData }) => {
  const dispatch = useDispatch();

  // Redux state
  const { filterStatus, selectedCompany } = useSelector(
    (state) => state.crms.filters
  );

  // Local state for temporary filter inputs
  const [tempFilterStatus, setTempFilterStatus] = useState(filterStatus);
  const [tempFilterCompany, setTempFilterCompany] = useState(selectedCompany);

  // Update search text in Redux (immediate)
  const handleSearchChange = (e) => {
    setFilterData({ ...filterData, searchValue: e.target.value });
  };

  const handleSearchKeyChange = (e) => {
    setFilterData({ ...filterData, searchOnKey: e.target.value });
  };

  // Toggle status filters in local state
  const handleStatusInputChange = (status) => {
    setTempFilterStatus((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status]
    );
  };

  // Apply status filters (dispatch changes to Redux)
  const handleApplyFilters = () => {
    dispatch(
      setFilters({
        filterStatus: tempFilterStatus,
        selectedCompany: tempFilterCompany,
      })
    );
  };

  // Reset filters in both local state and Redux
  const handleResetFilters = () => {
    setTempFilterStatus([]);
    dispatch(resetFilters());
  };

  return (
    <div className="  ">
      {/* Filters */}
      <div className="d-flex gap-3 align-items-center">
        {/* Search Input */}
        <div className="col-sm-12">
          <div className="input-group">
            <select
              className="form-select"
              value={filterData.searchOnKey || filterData.searchKeys[0]} // Ensure a default value is selected
              onChange={handleSearchKeyChange}
            >
              {filterData.searchKeys.map((key) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
            <input
              type="search"
              className="form-control"
              placeholder={`Search for ...`}
              value={filterData.searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
