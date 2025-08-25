import { useQuery } from "@tanstack/react-query";
import UserApi from "../api/manageUserApi";

export const useUsersData = ({
  page,
  limit,
  searchKey,
  searchValue,
  ofCompany,
  sort = "-createdTime",
}) => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["users", page, searchKey, searchValue, ofCompany, sort], // Ensure `page` is part of the key
    queryFn: () =>
      UserApi.fetchUsers({
        page,
        limit,
        searchKey,
        searchValue,
        ofCompany,
        populate: "role,ofCompany",
        selectPopulate: "name",
        sort,
      }), // Use `page` directly
    keepPreviousData: true, // Retain previous data during fetching
    staleTime: Infinity, // Cache duration
  });

  return { data, isLoading, isError, error, isFetching };
};
