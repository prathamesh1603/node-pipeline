import { useQuery } from "@tanstack/react-query";
import AccountApi from "../api/AccountApi";

export const useAccountsData = ({
  page,
  limit,
  searchKey,
  searchValue,
  ofCompany,
  sort = "-createdTime",
}) => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["accounts", page, searchKey, searchValue, ofCompany, sort], // Ensure `page` is part of the key
    queryFn: () =>
      AccountApi.fetchAccounts({
        page,
        limit,
        searchKey,
        searchValue,
        ofCompany,
        populate: "ofCompany,assignedTo",
        selectPopulate: "name",
        sort,
      }),
    keepPreviousData: true, // Retain previous data during fetching
    staleTime: Infinity, // Cache duration
  });

  return { data, isLoading, isError, error, isFetching };
};
