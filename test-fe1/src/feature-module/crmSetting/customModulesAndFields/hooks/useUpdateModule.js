import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import customModulesApi from "../api/customModulesApi";
import {
  EDITED_SUCCESS_MSG,
  ERROR_MSG,
} from "../../../../core/data/constants/constant";
import { useNavigate } from "react-router";

const useUpdateModule = (setHasChanges, navigateTo) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id, updatedData }) =>
      customModulesApi.updateModuleData({ id, updatedData }),
    onSuccess: () => {
      toast.success(EDITED_SUCCESS_MSG);
      setHasChanges(false); // Reset changes flag
      if (navigateTo) {
        navigate(-1);
      }
      queryClient.invalidateQueries("layouts"); // Refresh related queries
    },
    onError: (error) => {
      toast.error((error.response?.data?.msg || ERROR_MSG).toUpperCase());
    },
  });
};

export default useUpdateModule;
