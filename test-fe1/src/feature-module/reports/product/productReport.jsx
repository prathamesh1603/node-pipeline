import React, { useState } from "react";
import ReportsModal from "../../../core/modals/reports_modal";
import { Link, useSearchParams } from "react-router-dom";
import { useLeadsData } from "../../crm/leads/hooks/useLeadsData";
import PageHeader from "../../../core/common/crmComponents/PageHeader";
import LoaderComponent from "../../../core/common/crmComponents/LoaderComponent";
import PaginationControls from "../../../core/common/pagination";
import CompanyFilter from "../../../core/common/crmComponents/CompanyFilter";
import Filter from "../common-components/Filter";
import api from "../../../utils/api";
import ProductList from "./component/ProductList";
import { useProductsData } from "../../crm/products/hooks/useProductsData";
import { all_routes } from "../../router/all_routes";
import LeadCountByProductsBarChart from "./component/LeadCountByProductsBarChart";
import DealCountByProductsBarChart from "./component/DealCountByProductsBarChart";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductReport = () => {
  const route = all_routes;
  const [searchParams, setSearchParams] = useSearchParams();

  const user = JSON.parse(localStorage.getItem("user") || []);
  let count = 0;

  const { companyNameArr } = useSelector((state) => state.auth);

  const [selectedCompany, setSelectedCompany] = useState(() => {
    const companyIdFromParams = searchParams.get("companyid");

    return companyIdFromParams
      ? companyIdFromParams
      : user?.ofCompany
      ? user?.ofCompany?._id
      : companyNameArr.length > 0
      ? companyNameArr[0].value
      : null;
  });

  const [searchProductName, setSearchProductName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchKey, setSearchKey] = useState("productName"); // Default search key

  const [filterData, setFilterData] = useState({
    searchKeys: ["firstName", "lastName", "mobile", "email"],
    searchOnKey: "firstName",
    searchValue: "",
  });

  const { data, isLoading, isError, isFetching, error } = useProductsData({
    ofCompany: selectedCompany,
  });

  const [reportDataFilter, setReportDataFilter] = useState({
    format: "excel",
    fromDate: "",
    toDate: "",
    filters: {},
  });

  const productsData = data?.data?.data;

  // Flatten the productsData array
  const processedRows = productsData?.flatMap((row) =>
    row.products?.map((product, index) => {
      count++;
      let obj = {
        ...row,
        id: `${row._id}-${index}`, // Generate a unique ID for each product
        productName: product.name, // Add the individual product name
        category: row.name, // Add category name
        createdAt: row.createdAt, // Add createdAt date for the product
        updatedAt: row.updatedAt, // Add updatedAt date for the product
      };

      return obj;
    })
  );

  // Filter products based on the search input
  const handleSearch = () => {
    return processedRows?.filter((row) => {
      const searchValue =
        searchKey === "productName" ? row.productName : row.category;
      return searchValue
        .toLowerCase()
        .includes(
          searchKey === "productName"
            ? searchProductName.toLowerCase()
            : searchCategory.toLowerCase()
        );
    });
  };

  const filteredRows = handleSearch();

  const handleDownload = async () => {
    try {
      const response = await api.get(
        `/file-export/downlode-product-report?createdAt[gt]=${reportDataFilter.fromDate}&createdAt[lte]=${reportDataFilter.toDate}`,
        {
          params: {
            format: reportDataFilter.format,
            ofCompany: selectedCompany,
          },
          responseType: "blob", // Important for handling binary data
        }
      );
      console.log("res", response);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error(error?.response?.data?.msg || "something went wrong ");
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <PageHeader pageName="Product Reports" totalCount={count || 0} />
              <div className="card">
                <div className="card-header">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    {/* Left Section */}
                    <div className="d-flex flex-wrap gap-3">
                      <CompanyFilter
                        selectedCompany={selectedCompany}
                        setSelectedCompany={setSelectedCompany}
                        user={user}
                      />
                      <div className="d-flex gap-3 align-items-center">
                        <div className="col-sm-12">
                          <div className="input-group">
                            <select
                              className="form-select"
                              value={searchKey}
                              onChange={(e) => setSearchKey(e.target.value)}
                            >
                              <option value="productName">Product Name</option>
                              <option value="category">Category</option>
                            </select>
                            <input
                              type="search"
                              placeholder="Search for ..."
                              className="form-control"
                              value={
                                searchKey === "productName"
                                  ? searchProductName
                                  : searchCategory
                              }
                              onChange={(e) =>
                                searchKey === "productName"
                                  ? setSearchProductName(e.target.value)
                                  : setSearchCategory(e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="d-flex align-items-center gap-3">
                      {/* Add Lead Button */}
                      <Link
                        to="download_report"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#download_report"
                      >
                        <i className="ti ti-file-download me-2" />
                        Download Report
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <LeadCountByProductsBarChart
                      selectedCompany={selectedCompany}
                    />
                    <DealCountByProductsBarChart
                      selectedCompany={selectedCompany}
                    />
                  </div>

                  {isLoading ? (
                    <LoaderComponent />
                  ) : isError ? (
                    <div>Error: {error.message}</div>
                  ) : (
                    <ProductList
                      productsData={productsData}
                      isLoading={isLoading}
                      isError={isError}
                      filteredRows={filteredRows}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* /Page Wrapper */}
      <ReportsModal
        handleDownload={handleDownload}
        reportDataFilter={reportDataFilter}
        setReportDataFilter={setReportDataFilter}
      />
    </div>
  );
};

export default ProductReport;
