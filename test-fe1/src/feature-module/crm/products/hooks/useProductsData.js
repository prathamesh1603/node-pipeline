import { useQuery } from "@tanstack/react-query";
import ProductApi from "../api/productApi";

export const useProductsData = ({
  ofCompany = null,
  page,
  limit,
  sort = "-createdTime",
}) => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["products", ofCompany, sort],
    queryFn: () =>
      ProductApi.fetchProducts({
        ofCompany,
        page,
        limit,
        populate: "ofCompany",
        selectPopulate: "name",
        sort,
      }),
    keepPreviousData: true, // Retain previous data during fetching
    staleTime: Infinity, // Cache duration
    enabled: Boolean(ofCompany),
  });

  return { data, isLoading, isError, error, isFetching };
};
