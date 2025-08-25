import { useQuery } from "@tanstack/react-query";
import customModulesApi from "../api/customModulesApi";

const useModuleData = (id) => {
  return useQuery({
    queryKey: ["module", id],
    queryFn: () =>
      customModulesApi.fetchModuleData({
        id,
        populate: "ofCompany",
        selectPopulate: "name",
      }),
    keepPreviousData: true,
    staleTime: Infinity,
    enabled: !!id,
  });
};

export default useModuleData;
