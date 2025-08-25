import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useSearchParams } from "react-router-dom";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import { useProductsData } from "../hooks/useProductsData";
import AddProductModal from "../actions/AddProductModal";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import ActionsDropdown from "../../../../core/common/crmComponents/ActionsDropdown";
import { MODULES } from "../../../../core/data/constants/moduleConstants";
import { all_routes } from "../../../router/all_routes";
import {
  TextField,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import CompanyFilter from "../../../../core/common/crmComponents/CompanyFilter";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Products = () => {
  const API_URL = process.env.REACT_APP_BACKEND_API_URL;

  const [searchParams, setSearchParams] = useSearchParams();
  const route = all_routes;
  const user = JSON.parse(localStorage.getItem("user") || []);

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

  const { data, isLoading, isError, error } = useProductsData({
    ofCompany: selectedCompany,
  });

  const productsData = data?.data?.data || [];
  let count = 0;

  // Flatten the productsData array
  const processedRows = productsData.flatMap((row) =>
    row.products.map((product, index) => {
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
    return processedRows.filter((row) => {
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

  const columns = [
    {
      field: "productName",
      headerName: "Product Name",
      flex: 1,
      renderCell: (params) => (
        <div className="text-capitalize">{params.value || "N/A"}</div>
      ),
    },
    {
      field: "category",
      headerName: "Product Category",
      flex: 1,
      renderCell: (params) => (
        <div className="text-capitalize">
          {params.value ? params.value.split("-").join(" ") : "N/A"}
        </div>
      ),
    },
    {
      field: "ofCompany",
      headerName: "Company",
      flex: 1,
      renderCell: (params) => (
        <div className="text-capitalize">{params?.row?.ofCompany?.name}</div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: (params) => (
        <div>
          {params?.value
            ? new Date(params.value).toLocaleDateString()
            : new Date(params?.row?.updatedAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1,
      renderCell: (params) => (
        <div>
          {params?.value
            ? new Date(params.value).toLocaleDateString()
            : new Date(params?.row?.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      flex: 0.5,
      renderCell: (params) => (
        <>
          <ActionsDropdown
            params={params}
            path={route.productDetails}
            module={MODULES.PRODUCTS}
            showDetails={false}
          >
            <MenuItem className="dropdown-menu dropdown-menu-right py-0">
              <Link
                className="dropdown-item"
                onClick={() => {
                  navigator.clipboard
                    .writeText(
                      `  <iframe src='${API_URL}/api/v1/lead/leadform/form?ofCompany=${params?.row?.ofCompany?._id}&productIntrested=${params?.row?.productName}' width="600" height="650"></iframe>`
                    )
                    .then(() => {
                      toast.success("Copied Link To Clipborad");
                    })
                    .catch((err) => {
                      toast.error("Failed To Copy Link");
                    });
                }}
              >
                <i className="ti ti-copy text-blue pe-2" /> iframe Product Link
                Form
              </Link>
            </MenuItem>
          </ActionsDropdown>
        </>
      ),
    },
  ];

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <PageHeader pageName="Products" totalCount={count} />
              <div className="card">
                <div className="card-header">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    {/* Filters */}
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
                    {/* /Filters */}

                    <div className="text-sm-end">
                      <Link
                        to="#"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#add_product"
                      >
                        <i className="ti ti-square-rounded-plus me-2" />
                        Add New Product
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {/* Products List */}
                  <div>
                    {isLoading ? (
                      <LoaderComponent />
                    ) : isError ? (
                      <div>Error: {error.message}</div>
                    ) : (
                      <DataGrid
                        rows={filteredRows} // Use the filtered rows
                        columns={columns.map((column) => ({
                          ...column,
                          headerClassName: "bg-light-200",
                        }))}
                        getRowId={(row) => row.id} // Use the unique ID
                        autoHeight
                        pagination
                        pageSizeOptions={[5]} // Define the page size options
                        initialState={{
                          pagination: {
                            paginationModel: { pageSize: 10, page: 0 }, // Set the initial page size and page number
                          },
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      <AddProductModal />
    </>
  );
};

export default Products;
