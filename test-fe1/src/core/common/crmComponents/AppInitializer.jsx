import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import manageRoleApi from "../../../feature-module/crm/manageRoles/api/manageRoleApi";
import api from "../../../utils/api";
import {
  getCompanyNameArr,
  getProductCategoryAndNamesArr,
  getRoleNameArr,
} from "../../../utils/helpers/getDataArray";
import CompanyApi from "../../../feature-module/crm/companies/api/CompanyApi";
import ProductApi from "../../../feature-module/crm/products/api/productApi";
import { useLocation } from "react-router";
import { isSuperAdmin } from "../../../utils/helpers/helper";
import {
  resetFetchCompanyRoleState,
  setCompanyNameArray,
  setRoleNameArr,
} from "../../data/redux/authSlice";

const AppInitializer = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { fetchRoleData, fetchCompanyData } = useSelector(
    (state) => state.auth
  );

  // Function to fetch and store roles and company data
  const initializeAppData = async () => {
    try {
      // Check roles in localStorage
      if (fetchRoleData) {
        const rolesResponse = await manageRoleApi.fetchRoles();
        const roleNameArr = getRoleNameArr(rolesResponse?.data?.data);
        dispatch(setRoleNameArr(roleNameArr));
        localStorage.setItem("roleNameArr", JSON.stringify(roleNameArr));
      }

      // Check companies in localStorage
      if (fetchCompanyData) {
        const companiesResponse = await CompanyApi.fetchCompanies();
        const companyNameArr = getCompanyNameArr(companiesResponse?.data?.data);
        dispatch(setCompanyNameArray(companyNameArr));
        localStorage.setItem("companyNameArr", JSON.stringify(companyNameArr));
      }
    } catch (error) {
      console.error("Error initializing app data:", error);
    } finally {
      dispatch(resetFetchCompanyRoleState());
    }
  };

  useEffect(() => {
    // Initialize app data when the component mounts
    initializeAppData();
  }, [fetchRoleData, fetchCompanyData]);

  return null; // This component doesn't render anything
};

export default AppInitializer;
