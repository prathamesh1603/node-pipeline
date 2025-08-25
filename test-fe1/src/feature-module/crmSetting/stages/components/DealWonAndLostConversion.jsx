import React, { useEffect, useState } from "react";
import { isSuperAdmin } from "../../../../utils/helpers/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { verifyUserApi } from "../../../../utils/helpers/apiHelpers";
import stagesApi from "../api/stageApi";
import { EDITED_SUCCESS_MSG } from "../../../../core/data/constants/constant";
import { handleModalAction } from "../../../../utils/helpers/handleModalAction";
import StageConfirmationModal from "../../../../core/common/crmComponents/StageConfirmationModal";
import StagePasswordModal from "../../../../core/common/crmComponents/StagePasswordModal";

const DealWonAndLostConversion = ({
  stages,
  user,
  selectedCompany,
  moduleName,
  dealWon,
  dealLost,
}) => {
  const [selectedDealWonStage, setSelectedDealWonStage] = useState(null);
  const [selectedDealLostStage, setSelectedDealLostStage] = useState(null);
  const [dealType, setDealType] = useState("won"); // Either "won" or "lost"

  const filteredStagesForDealWon = stages.filter((stage) => !stage.dealLost);
  const filteredStagesForDealLost = stages.filter((stage) => !stage.dealWon);

  useEffect(() => {
    if (stages?.length > 0) {
      if (dealWon?.dealWon) {
        setSelectedDealWonStage(dealWon);
      } else {
        setSelectedDealWonStage(stages[0]);
      }

      if (dealLost?.dealLost) {
        setSelectedDealLostStage(dealLost);
      } else {
        setSelectedDealLostStage(stages[0]);
      }
    }
  }, [stages, dealWon, dealLost]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const queryClient = useQueryClient();

  const handleStageChange = (event) => {
    const selectedValue = event.target.value;
    let dealType = event.target.name;
    if (dealType) {
      setDealType(dealType);
    }

    const stageObject = stages.find((stage) => stage.name === selectedValue);

    if (stageObject?.dealWon && dealType === "won") {
      setSelectedDealWonStage(stageObject);
      setShowConfirmModal(true);
    }

    if (stageObject?.dealLost && dealType === "lost") {
      setSelectedDealLostStage(stageObject);
      setShowConfirmModal(true);
    }
  };

  const handleDealWonChange = (event) => {
    const selectedValue = event.target.value;
    let dealType = event.target.name;
    if (dealType) {
      setDealType(dealType);
    }

    const stageObject = stages.find((stage) => stage.name === selectedValue);
    setSelectedDealWonStage({ ...stageObject, dealWon: true });

    if (selectedDealWonStage?.dealWon) {
      setShowConfirmModal(true);
    }
  };

  const handleDealLostChange = (event) => {
    const selectedValue = event.target.value;
    let dealType = event.target.name;
    if (dealType) {
      setDealType(dealType);
    }

    const stageObject = stages.find((stage) => stage.name === selectedValue);
    setSelectedDealLostStage({ ...stageObject, dealLost: true });

    if (selectedDealLostStage?.dealLost) {
      setShowConfirmModal(true);
    }
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
        dealWon: updatedStageData.dealWon,
        dealLost: updatedStageData.dealLost,
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
      if (dealType === "won") {
        mutationEditStage.mutate(selectedDealWonStage);
      } else {
        mutationEditStage.mutate(selectedDealLostStage);
      }

      toast.success(
        `Deal successfully marked as ${dealType} at stage: ${
          dealType === "won"
            ? selectedDealWonStage?.name
            : selectedDealLostStage?.name
        }`
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
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="input-group">
            <label
              className="input-group-text text-capitalize"
              htmlFor="selectStage"
            >
              Select stage to mark as Won{" "}
            </label>
            <select
              id="selectStage"
              className="form-select text-capitalize"
              value={selectedDealWonStage?.name || ""}
              onChange={handleDealWonChange}
              name="won"
            >
              {filteredStagesForDealWon?.map((stage) => (
                <option
                  key={stage?.id}
                  value={stage.name}
                  style={{
                    backgroundColor: stage?.dealWon
                      ? stage?.dealWon || "transparent"
                      : "",
                    color: stage?.toDeal ? "white" : "black",
                  }}
                >
                  {stage?.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="input-group">
            <label
              className="input-group-text text-capitalize"
              htmlFor="selectStage"
            >
              Select stage to mark as Lost
            </label>
            <select
              id="selectStage"
              className="form-select text-capitalize"
              value={selectedDealLostStage?.name || ""}
              onChange={handleDealLostChange}
              name="lost"
            >
              {filteredStagesForDealLost?.map((stage) => (
                <option
                  key={stage?.id}
                  value={stage.name}
                  style={{
                    backgroundColor: stage?.dealLost
                      ? stage?.color || "transparent"
                      : "",
                    color: stage?.dealLost ? "white" : "black",
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
        stageName={
          dealType === "won"
            ? selectedDealWonStage?.name
            : selectedDealLostStage?.name
        }
        message={`Are you sure you want to mark this deal as ${dealType} at this stage?`}
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

export default DealWonAndLostConversion;
