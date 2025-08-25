import React, { useEffect, useState } from "react";

import { isSuperAdmin } from "../../../../utils/helpers/helper";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { verifyUserApi } from "../../../../utils/helpers/apiHelpers";
import stagesApi from "../api/stageApi";
import { EDITED_SUCCESS_MSG } from "../../../../core/data/constants/constant";
import { handleModalAction } from "../../../../utils/helpers/handleModalAction";
import StageConfirmationModal from "../../../../core/common/crmComponents/StageConfirmationModal";
import StagePasswordModal from "../../../../core/common/crmComponents/StagePasswordModal";

const LeadToDealStageConversion = ({
  stages,
  user,
  selectedCompany,
  moduleName,
  leadToDealStage,
}) => {
  const [selectedStage, setSelectedStage] = useState(
    leadToDealStage?.name ? leadToDealStage : stages[0]
  );

  useEffect(() => {
    if (stages?.length > 0 && !selectedStage?.id) {
      const selectedStageFromReduce = stages.reduce((acc, curr) => {
        return curr.toDeal ? curr : acc;
      }, null);

      setSelectedStage(selectedStageFromReduce || stages[0]);
    }
  }, [user, stages, selectedStage]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const queryClient = useQueryClient();

  const handleStageChange = (event) => {
    const selectedValue = event.target.value;
    const stageObject = stages.find((stage) => stage.name === selectedValue);
    setSelectedStage(stageObject);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    setShowPasswordModal(true);
  };

  const mutationEditStage = useMutation({
    mutationFn: (updatedStageData) => {
      const requestData = {
        id: updatedStageData.id,
        name: updatedStageData.name,
        ofCompany: isSuperAdmin(user) ? selectedCompany : user?.ofCompany?._id,
        module: moduleName,
        toDeal: true,
      };
      return stagesApi.updateStage(requestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("stages");
      toast.success(EDITED_SUCCESS_MSG);
      handleModalAction("edit_stage", "hide");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to update stage.");
    },
  });

  const mutationVerifyUser = useMutation({
    mutationFn: (data) => verifyUserApi(data),
    onSuccess: () => {
      mutationEditStage.mutate(selectedStage);
      toast.success(
        `Lead successfully converted to deal at stage: ${selectedStage.name}`
      );
      setPassword("");
      setShowPasswordModal(false);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg || "Verification failed. Please try again."
      );
    },
  });

  const handlePasswordSubmit = () => {
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }
    mutationVerifyUser.mutate({ email: user.email, password });
  };

  return (
    <>
      <div className="mx-3">
        <div className="d-flex align-items-center gap-3">
          <div className="input-group">
            <label
              className="input-group-text text-capitalize text-wrap"
              htmlFor="selectStage"
            >
              Select stage to convert the lead into deal
            </label>
            <select
              id="selectStage"
              className="form-select text-capitalize "
              value={selectedStage?.name || ""}
              onChange={handleStageChange}
            >
              {stages?.map((stage) => (
                <option
                  key={stage?.id}
                  value={stage.name}
                  style={{
                    backgroundColor: stage?.toDeal
                      ? stage?.color || "transparent"
                      : "",
                    color: stage?.toDeal ? "white" : "black",
                  }}
                >
                  {stage.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <StageConfirmationModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
        stageName={selectedStage?.name}
        message="Are you sure you want to convert the lead to a deal at stage?"
      />

      <StagePasswordModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        password={password}
        setPassword={setPassword}
        isPasswordVisible={isPasswordVisible}
        togglePasswordVisibility={() =>
          setIsPasswordVisible(!isPasswordVisible)
        }
        onSubmit={handlePasswordSubmit}
        isLoading={mutationVerifyUser?.isLoading}
      />
    </>
  );
};

export default LeadToDealStageConversion;
