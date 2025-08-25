import { useQuery } from "@tanstack/react-query";
import CompanyApi from "../api/CompanyApi";

export const useCompaniesData = ({
  searchKey,
  searchValue,
  sort = "-createdTime",
}) => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["companies", searchKey, searchValue, sort], // Ensure `page` is part of the key
    queryFn: () =>
      CompanyApi.fetchCompanies({
        searchKey,
        searchValue,
        fields:
          "name,code,website,rating,industry,address,socialProfiles,email,mobile,status",
        sort,
      }),
    keepPreviousData: true, // Retain previous data during fetching
    staleTime: Infinity, // Cache duration
  });

  return { data, isLoading, isError, error, isFetching };
};
