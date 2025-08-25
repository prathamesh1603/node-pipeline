import { useQuery } from "@tanstack/react-query";
import LeadApi from "../api/LeadApi";

export const useLeadsData = ({
  page,
  limit,
  searchKey,
  searchValue,
  ofCompany,
  sort = "-createdTime",
}) => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["leads", page, searchKey, searchValue, ofCompany, sort], // Ensure `page` is part of the key
    queryFn: () =>
      LeadApi.fetchLeads({
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
