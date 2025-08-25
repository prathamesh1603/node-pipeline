import { useQuery } from "@tanstack/react-query";
import stagesApi from "../api/stageApi";

export const useStages = ({ ofCompany, module }) => {
  const {
    data: stagesData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["stages", ofCompany, module],
    queryFn: () =>
      stagesApi.fetchContactStages({
        ofCompany,
        module,
      }),
    enabled: !!ofCompany,
    keepPreviousData: true, // Retain previous data during fetching
    staleTime: Infinity, // Cache duration
  });

  return { stagesData, isLoading, isError, error, isFetching };
};
