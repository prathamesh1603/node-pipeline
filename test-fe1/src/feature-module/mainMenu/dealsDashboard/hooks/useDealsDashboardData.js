import { useQuery } from "@tanstack/react-query";
import DealApi from "../../../crm/deals/api/DealApi";

export const useDealsDashboardData = (queryParams) => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["deals", queryParams],
    queryFn: ({ signal }) =>
      DealApi.fetchDealsWithQuery({ ...queryParams, signal }),
    keepPreviousData: true,
    staleTime: Infinity,
    enabled: Boolean(queryParams.ofCompany),
  });

  return { data, isLoading, isError, error, isFetching };
};
