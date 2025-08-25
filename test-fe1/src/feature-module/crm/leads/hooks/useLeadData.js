import { useQuery } from "@tanstack/react-query";
import LeadApi from "../api/LeadApi";

export const useLeadData = (leadId) => {
  const {
    data: leadData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["lead", leadId],
    queryFn: () =>
      LeadApi.fetchLead(leadId, {
        populate: "ofCompany,assignedTo,lastUpdationBy",
        selectPopulate: "name",
      }),
    enabled: !!leadId, // Only run the query if leadId exists
    staleTime: Infinity, // Data remains fresh indefinitely
    cacheTime: 5 * 60 * 1000, // Cached data is kept for 5 minutes
  });

  return { leadData, isLoading, leadId, isError, error };
};
