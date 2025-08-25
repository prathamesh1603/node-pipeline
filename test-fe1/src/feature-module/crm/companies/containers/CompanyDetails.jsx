import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { all_routes } from "../../../router/all_routes";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import CompanyDetailsHeader from "../components/CompanyDetailsHeader";
import CompanyDetailsSidebar from "../components/CompanyDetailsSidebar";
import { useCompanyData } from "../hooks/useCompanyData";
import AddCompany from "../actions/AddCompany";
import EditCompany from "../actions/EditCompany";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import { useParams } from "react-router";

const CompanyDetails = () => {
  const route = all_routes;
  const dispatch = useDispatch();

  const { id: companyId } = useParams();
  const { companyData, isLoading } = useCompanyData(companyId);

  return (
    <>
      {isLoading ? (
        <LoaderComponent />
      ) : (
        <>
          {/* Page Wrapper */}
          <div className="page-wrapper">
            <div className="content">
              <div className="row">
                <div className="col-md-12">
                  {/* Page Header */}
                  <PageHeader pageName="Company Overview" />
                  {/* /Page Header */}
                </div>
              </div>
              <div className="row">
                <CompanyDetailsHeader companyData={companyData} />

                <CompanyDetailsSidebar companyData={companyData} />
              </div>
            </div>
          </div>
          <AddCompany />
        </>
      )}
    </>
  );
};

export default CompanyDetails;
