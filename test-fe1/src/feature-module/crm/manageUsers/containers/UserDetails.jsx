import React from "react";
import UserDetailsHeader from "../components/UserDetailsHeader";
import UserDetailsSidebar from "../components/UserDetailsSidebar";
import { useUserData } from "../hooks/useUserData";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import { useParams } from "react-router";

const UserDetails = () => {
  const { id: userId } = useParams();

  const { userData, isLoading } = useUserData(userId);

  return (
    <>
      {isLoading ? (
        <LoaderComponent />
      ) : (
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                {/* Page Header */}
                <PageHeader pageName="User Overview" />
                {/* /Page Header */}
              </div>
            </div>
            <div className="row">
              <UserDetailsHeader userData={userData} />

              <UserDetailsSidebar userData={userData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDetails;
