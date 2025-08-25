import React from "react";

const Filter = ({ filterData, setFilterData }) => {
  // Update search text
  const handleSearchChange = (e) => {
    setFilterData({ ...filterData, searchValue: e.target.value });
  };

  // Update search key
  const handleSearchKeyChange = (e) => {
    setFilterData({
      ...filterData,
      searchOnKey: e.target.value,
      searchValue: "",
    });
  };

  return (
    <div className="filter-component">
      <div className="d-flex flex-column flex-md-row gap-2 align-items-center">
        <div className="input-group">
          <select
            className="form-select"
            value={filterData?.searchOnKey || filterData?.searchKeys[0]}
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
            placeholder="Search..."
            value={filterData.searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Filter;
