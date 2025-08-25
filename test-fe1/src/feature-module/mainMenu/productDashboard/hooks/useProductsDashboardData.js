import { useQuery } from "@tanstack/react-query";
import ProductApi from "../../../crm/products/api/productApi";

export const useProductsDashboardData = (queryParams) => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["leads", queryParams],
    queryFn: ({ signal }) =>
      ProductApi.fetchProductsWithQuery({
        ...queryParams,
        signal,
      }),
    keepPreviousData: true,
    staleTime: Infinity,
    enabled: !!queryParams.ofCompany,
  });

  return { data, isLoading, isError, error, isFetching };
};
