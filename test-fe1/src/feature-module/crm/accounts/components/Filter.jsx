import { useCompaniesData } from "../../companies/hooks/useCompaniesData";

const Filter = ({ filterData, setFilterData }) => {
  // Update search text in Redux (immediate)
  const handleSearchChange = (e) => {
    setFilterData({ ...filterData, searchValue: e.target.value });
  };

  const handleSearchKeyChange = (e) => {
    setFilterData({ ...filterData, searchOnKey: e.target.value });
  };

  return (
    <div className="">
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
