import { useQuery } from "@tanstack/react-query";
import customModulesApi from "../api/customModulesApi";

export const useLayoutData = ({ ofCompany }) => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["layouts", ofCompany], // Ensure `page` is part of the key
    queryFn: () =>
      customModulesApi.fetchAllLayout({
        ofCompany,
        populate: "ofCompany",
        selectPopulate: "name",
        fields: "moduleName,ofCompany,updatedAt",
      }),
    keepPreviousData: true, // Retain previous data during fetching
    staleTime: Infinity, // Cache duration
    enabled: !!ofCompany,
  });

  return { data, isLoading, isError, error, isFetching };
};
