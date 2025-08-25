import { useQuery } from "@tanstack/react-query";
import LeadApi from "../../../crm/leads/api/LeadApi";

export const useLeadsDashboardData = (queryParams) => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["leads", queryParams],
    queryFn: ({ signal }) =>
      LeadApi.fetchLeadsWithQuery({ ...queryParams, signal }),
    keepPreviousData: true,
    staleTime: Infinity, // Five minutes
    enabled: Boolean(queryParams.ofCompany),
  });

  if (isError) {
    console.error("Error fetching leads data:", error);
  }

  return { data, isLoading, isError, error, isFetching };
};
