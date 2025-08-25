import { useQuery } from "@tanstack/react-query";
import AccountApi from "../api/AccountApi";

export const useAccountData = (accountId) => {
  const { data: accountData, isLoading } = useQuery({
    queryKey: ["account", accountId],
    queryFn: () =>
      AccountApi.fetchAccount(accountId, {
        populate: "dealsDetails,ofCompany",
        selectPopulate:
          "firstName,lastName,currentStatus,probability,assignedTo,createdTime,email,lastActivityDate,lastUpdationBy,mobile,productInterested,timeline,name",
      }),
    enabled: !!accountId, // Only run the query if accountId exists
    staleTime: Infinity, // Data remains fresh indefinitely
    cacheTime: 5 * 60 * 1000, // Cached data is kept for 5 minutes
  });

  return { accountData, isLoading };
};
