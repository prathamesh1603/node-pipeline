import React, { useEffect, useRef, useState } from "react";
import { isSuperAdmin } from "../../../utils/helpers/helper";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

const CompanyFilter = ({ selectedCompany, setSelectedCompany, user }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { companyNameArr } = useSelector((state) => state.auth);

  const [inputWidth, setInputWidth] = useState(100); // Default width
  const textRef = useRef(null);

  // Set the first company as default for SuperAdmin

  useEffect(() => {
    if (
      isSuperAdmin(user) &&
      companyNameArr.length > 0 &&
      !selectedCompany &&
      !searchParams.get("companyid")
    ) {
      const defaultCompany = companyNameArr[0];
      setSelectedCompany(defaultCompany.value);
      searchParams.set("companyid", defaultCompany.value);
      setSearchParams(searchParams);
    } else if (!isSuperAdmin(user)) {
      searchParams.set("companyid", user.ofCompany._id);
      setSearchParams(searchParams);
    }
  }, [selectedCompany, companyNameArr]);

  const handleCompanyChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCompany(selectedValue);
    searchParams.set("companyid", selectedValue);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.offsetWidth;
      setInputWidth(Math.max(textWidth + 50, 100)); // Adjusted for padding
    }
  }, [selectedCompany]);

  const selectedCompanyLabel =
    companyNameArr.find((company) => company.value === selectedCompany)
      ?.label || "";

  return (
    <div className="company-filter">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2">
        {isSuperAdmin(user) ? (
          <div className="input-group">
            <label className="input-group-text" htmlFor="selectCompany">
              Company
            </label>
            <select
              id="selectCompany"
              className="form-select"
              value={selectedCompany || ""}
              onChange={handleCompanyChange}
              style={{ width: `${inputWidth}px` }}
            >
              {companyNameArr.map((company, index) => (
                <option key={index} value={company.value}>
                  {company.label}
                </option>
              ))}
            </select>
            <span
              ref={textRef}
              style={{
                visibility: "hidden",
                whiteSpace: "nowrap",
                position: "absolute",
              }}
            >
              {selectedCompanyLabel}
            </span>
          </div>
        ) : (
          <div className="input-group">
            <label className="input-group-text">Company</label>
            <input
              type="text"
              className="form-control"
              value={user?.ofCompany?.name || "N/A"}
              disabled
              style={{
                minWidth: "100px",
                width: `${Math.max(
                  (user?.ofCompany?.name?.length || 0) * 8.5,
                  100
                )}px`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyFilter;
