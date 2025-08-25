import React, { useState } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import ConfirmModal from "./ConfirmModal";
import {
  EDITED_SUCCESS_MSG,
  ERROR_MSG,
} from "../../../../core/data/constants/constant";
import LeadApi from "../api/LeadApi";
import { MODULES } from "../../../../core/data/constants/moduleConstants";
import { all_routes } from "../../../router/all_routes";
import { useStages } from "../../../crmSetting/stages/hooks/useStages";

const LeadPipelineStatus = ({ leadData }) => {
  const route = all_routes;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState({});
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { stagesData, isLoading } = useStages({
    ofCompany: leadData?.ofCompany?._id,
    module: MODULES.LEADS,
  });

  const stages = stagesData?.data?.data;

  const { currentStatus: currentStage } = leadData || {};

  const mutationUpdate = useMutation({
    mutationFn: ({ id, updatedStage }) =>
      LeadApi.updateLead(id, {
        currentStatus: updatedStage,
        textMessageAboutActivity: `<b>${MODULES.LEADS.slice(
          0,
          -1
        )} currentStatus</b> updated from <b>${currentStage?.name}</b> to <b>${
          updatedStage?.name
        }</b>`,
      }),
    onSuccess: (response) => {
      toast.success(EDITED_SUCCESS_MSG);
      if (response.status) {
        toast.success(response.msg);
        if (response?.msg) {
          navigate(route.deals);
        }
      }
      queryClient.invalidateQueries("leads");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || ERROR_MSG);
    },
  });

  const handleStageChange = (stage) => {
    if (stage?.id === currentStage?.id) {
      toast.warning("You are already on this stage!");
      return;
    }

    setSelectedStage(stage);
    if (stage?.toDeal) {
      setShowConfirmModal(true);
    } else {
      mutationUpdate.mutate({ id: leadData?._id, updatedStage: stage });
    }
  };

  const handleConfirm = () => {
    mutationUpdate.mutate({ id: leadData?._id, updatedStage: selectedStage });
    setShowConfirmModal(false);
  };

  return (
    <div className="col-md-12">
      <div className="row mb-3" style={{ margin: "0 2px" }}>
        <div className="card mb-3">
          <div className="card-body p-0 mt-2">
            <h5 className="fw-semibold mb-3">Lead Pipeline Status</h5>
            <div className="d-flex flex-wrap pipeline-list">
              {isLoading
                ? // Render dummy stages when loading
                  Array(4)
                    .fill(null)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center stage-container position-relative "
                      >
                        <div
                          className="px-2 py-1 rounded-pill text-white 
                                                   d-flex align-items-center mb-3 text-capitalize"
                          style={{
                            width: "5rem",
                            height: "2rem",
                            backgroundColor: "lightgray",
                            cursor: "default",
                            transition: "all 0.2s ease-in-out",
                          }}
                        ></div>
                        {index < 3 && (
                          <div
                            className="d-flex align-items-center h-100 position-relative"
                            style={{
                              transform: "translateY(-6px)",
                            }}
                          >
                            <HiOutlineArrowNarrowRight
                              size={25}
                              className="stage-arrow"
                              color="lightgray"
                            />
                          </div>
                        )}
                      </div>
                    ))
                : stages?.map((stage, index) => (
                    <div
                      key={stage?.id}
                      className="d-flex align-items-center stage-container position-relative"
                    >
                      <div
                        className={`
                  px-2 py-1 rounded-pill text-white 
                  d-flex align-items-center mb-3 text-capitalize
                  ${
                    stage?.id === currentStage?.id
                      ? "shadow-lg active-stage"
                      : "inactive-stage"
                  }
                `}
                        style={{
                          backgroundColor: stage?.color,
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                        }}
                        onClick={() => handleStageChange(stage)}
                      >
                        <span className="stage-name">{stage?.name}</span>
                      </div>
                      {index < stages?.length - 1 && (
                        <div
                          className="d-flex align-items-center h-100 position-relative"
                          style={{ transform: "translateY(-6px)" }}
                        >
                          <HiOutlineArrowNarrowRight
                            size={25}
                            className="stage-arrow"
                          />
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </div>
          <ConfirmModal
            open={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleConfirm}
            selectedStage={selectedStage}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadPipelineStatus;
