import { useQuery } from "@tanstack/react-query";
import DealApi from "../api/DealApi";

export const useDealData = (dealId) => {
  const {
    data: dealData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["deal", dealId],
    queryFn: () =>
      DealApi.fetchDeal(dealId, {
        populate: "ofCompany,assignedTo",
        selectPopulate: "name",
      }),
    enabled: !!dealId, // Only run the query if dealId exists
    staleTime: Infinity, // Data remains fresh indefinitely
    cacheTime: 5 * 60 * 1000, // Cached data is kept for 5 minutes
  });

  return { dealData, isLoading, isError, error };
};
