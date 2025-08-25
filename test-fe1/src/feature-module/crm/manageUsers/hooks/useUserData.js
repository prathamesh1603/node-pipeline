import { useQuery } from "@tanstack/react-query";
import UserApi from "../api/manageUserApi";

export const useUserData = (userId) => {
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      UserApi.fetchUser({
        userId,
        populate: "role,ofCompany",
        selectPopulate: "name",
      }),
    enabled: !!userId,
    staleTime: Infinity, // Data remains fresh indefinitely
    cacheTime: 5 * 60 * 1000, // Cached data is kept for 5 minutes
  });

  return { userData, isLoading };
};
