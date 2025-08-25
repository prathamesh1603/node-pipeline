import { useQuery } from "@tanstack/react-query";
import manageRoleApi from "../api/manageRoleApi";

export const useRolesData = () => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["roles"],
    queryFn: () => manageRoleApi.fetchRoles(),
    keepPreviousData: true, // Retain previous data during fetching
    staleTime: Infinity, // Cache duration
  });

  return { data, isLoading, isError, error, isFetching };
};
