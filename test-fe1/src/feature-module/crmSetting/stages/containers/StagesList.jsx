import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import PageHeader from "../../../../core/common/crmComponents/PageHeader";
import { useStages } from "../hooks/useStages";
import AddStageModal from "../components/AddStageModal";
import EditStageModal from "../components/EditStageModal";
import { useState } from "react";
import { MODULES } from "../../../../core/data/constants/moduleConstants";
import DisplayStages from "../components/DisplayStages";
import stagesApi from "../api/stageApi";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { EDITED_SUCCESS_MSG } from "../../../../core/data/constants/constant";
import { isSuperAdmin } from "../../../../utils/helpers/helper";
import LoaderComponent from "../../../../core/common/crmComponents/LoaderComponent";
import { IoIosArrowRoundBack } from "react-icons/io";
import CompanyFilter from "../../../../core/common/crmComponents/CompanyFilter";
import LeadToDealStageConversion from "../components/LeadToDealStageConversion";
import DealWonAndLostConversion from "../components/DealWonAndLostConversion";
import { useSelector } from "react-redux";

const ContactStages = () => {
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("user") || []);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
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

  const [stageData, setStageData] = useState({});

  const { stagesData: leadStagesData, isLoading: leadLoading } = useStages({
    ofCompany: selectedCompany,
    module: MODULES.LEADS,
  });

  const leadStages = leadStagesData?.data?.data;
  const leadToDealStage = leadStages?.reduce((acc, curr) => {
    return curr.toDeal ? curr : acc;
  }, null);

  const { stagesData: dealStagesData, isLoading: dealLoading } = useStages({
    ofCompany: selectedCompany,
    module: MODULES.DEALS,
  });

  const dealStages = dealStagesData?.data?.data;
  const dealWon = dealStages?.reduce((acc, curr) => {
    return curr.dealWon ? curr : acc;
  }, null);
  const dealLost = dealStages?.reduce((acc, curr) => {
    return curr.dealLost ? curr : acc;
  }, null);

  const mutationEditStage = useMutation({
    mutationFn: (updatedStageData) => {
      const requestData = {
        stages: updatedStageData?.stages,
        module: updatedStageData.module,
        ofCompany: isSuperAdmin(user) ? selectedCompany : user?.ofCompany?._id,
      };
      return stagesApi.updateStageOrder(requestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("stages");
      toast.success(EDITED_SUCCESS_MSG);
      // handleModalAction("edit_stage", "hide");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to update stage.");
    },
  });

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <PageHeader pageName="Stages" totalCount={leadStages?.length}>
                <button
                  className="p-2 btn btn-outline-none"
                  onClick={() => navigate(all_routes.settings)}
                >
                  <IoIosArrowRoundBack className="d-inline" size={20} />
                </button>
              </PageHeader>
              {leadLoading || dealLoading ? (
                <LoaderComponent />
              ) : (
                <div className="card">
                  <div className="card-header">
                    <div className="row align-items-center ">
                      {/* Company Filter Section */}
                      <div className="col-12 col-md-6 mb-3 mb-md-0">
                        <CompanyFilter
                          selectedCompany={selectedCompany}
                          setSelectedCompany={setSelectedCompany}
                          user={user}
                        />
                      </div>
                      {/* Add Stages Button Section */}
                      <div className="col-12 col-md-6 text-md-end ">
                        <Link
                          to="#"
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#add_stage"
                        >
                          <i className="ti ti-square-rounded-plus me-2" />
                          Add Stages
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-6 mb-sm-4">
                        {leadStages?.length > 0 && (
                          <DisplayStages
                            stages={leadStages}
                            setStageData={setStageData}
                            user={user}
                            moduleName={MODULES.LEADS}
                            onSaveOrder={(data) => {
                              mutationEditStage.mutate(data);
                            }}
                          >
                            <LeadToDealStageConversion
                              stages={leadStages}
                              user={user}
                              selectedCompany={selectedCompany}
                              moduleName={MODULES.LEADS}
                              leadToDealStage={leadToDealStage}
                            />
                          </DisplayStages>
                        )}
                      </div>
                      <div className="col-lg-6">
                        {dealStages?.length > 0 && (
                          <DisplayStages
                            stages={dealStages}
                            setStageData={setStageData}
                            user={user}
                            moduleName={MODULES.DEALS}
                            onSaveOrder={(data) => {
                              mutationEditStage.mutate(data);
                            }}
                          >
                            <DealWonAndLostConversion
                              stages={dealStages}
                              user={user}
                              selectedCompany={selectedCompany}
                              moduleName={MODULES.DEALS}
                              dealWon={dealWon}
                              dealLost={dealLost}
                            />
                          </DisplayStages>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <AddStageModal selectedCompany={selectedCompany} user={user} />
      {/* <EditRoleModal /> */}
      <EditStageModal
        stageData={stageData}
        selectedCompany={selectedCompany}
        user={user}
      />
    </>
  );
};

export default ContactStages;
