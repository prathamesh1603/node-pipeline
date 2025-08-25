import React, { useState } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  EDITED_SUCCESS_MSG,
  ERROR_MSG,
} from "../../../../core/data/constants/constant";
import { MODULES } from "../../../../core/data/constants/moduleConstants";
import { all_routes } from "../../../router/all_routes";
import { useStages } from "../../../crmSetting/stages/hooks/useStages";
import DealApi from "../api/DealApi";
import DealConfirmModal from "./DealConfirmModal";

const DealPipelineStatus = ({ dealData }) => {
  const route = all_routes;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState({});
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { stagesData, isLoading } = useStages({
    ofCompany: dealData?.ofCompany?._id,
    module: MODULES.DEALS,
  });

  const stages = stagesData?.data?.data;

  const { currentStatus: currentStage } = dealData || {};

  const mutationUpdate = useMutation({
    mutationFn: ({ id, updatedStage }) =>
      DealApi.updateDeal(id, {
        currentStatus: updatedStage,
        textMessageAboutActivity: `<b>${MODULES.DEALS.slice(
          0,
          -1
        )} currentStatus</b> updated from <b>${currentStage?.name}</b> to <b>${
          updatedStage?.name
        }</b>`,
      }),
    onSuccess: (response) => {
      toast.success(EDITED_SUCCESS_MSG);
      if (response?.status) {
        toast.success(response.msg);
      }
      queryClient.invalidateQueries("deals");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || ERROR_MSG);
    },
  });

  const handleStageChange = (stage) => {
    if (!dealData?.editable) {
      toast.warning(
        `You are not able to edit. Because deal is converted to ${dealData?.currentStatus?.name}`
      );
      return;
    } else if (stage?.id === currentStage?.id) {
      toast.warning("You are already on this stage!");
      return;
    }

    setSelectedStage(stage);

    // Open modal for dealWon or dealLost stages
    if (stage?.dealWon || stage?.dealLost) {
      setShowConfirmModal(true);
    } else {
      // Update directly for other stages
      mutationUpdate.mutate({
        id: dealData?._id,
        updatedStage: stage,
      });
    }
  };

  const handleConfirm = () => {
    // Update the stage after confirmation
    mutationUpdate.mutate({
      id: dealData?._id,
      updatedStage: selectedStage,
    });
    setShowConfirmModal(false);
  };

  return (
    <div className="col-md-12">
      <div className="row mb-3" style={{ margin: "0 2px" }}>
        <div className="card mb-3">
          <div className="card-body p-0 mt-2">
            <h5 className="fw-semibold mb-3">Deal Pipeline Status</h5>
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
                : // Render actual stages when not loading
                  stages?.map((stage, index) => (
                    <div
                      key={stage?.id}
                      className="d-flex align-items-center stage-container position-relative "
                    >
                      <div
                        className={`px-2 py-1 rounded-pill text-white 
                                   d-flex align-items-center mb-3 text-capitalize ${
                                     stage?.id === currentStage?.id
                                       ? "shadow-lg active-stage"
                                       : "inactive-stage"
                                   }`}
                        style={{
                          backgroundColor: stage?.color,
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                        }}
                        onClick={() => handleStageChange(stage)}
                      >
                        {stage?.name}
                      </div>
                      {index < stages?.length - 1 && (
                        <div
                          className="d-flex align-items-center h-100 position-relative"
                          style={{
                            transform: "translateY(-6px)",
                          }}
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
          <DealConfirmModal
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

export default DealPipelineStatus;
