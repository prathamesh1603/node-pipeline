import { useQuery } from "@tanstack/react-query";
import CompanyApi from "../api/CompanyApi";

export const useCompanyData = (companyId) => {
  const { data: companyData, isLoading } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () =>
      CompanyApi.fetchCompany({
        companyId,
      }),
    enabled: !!companyId,
    staleTime: Infinity, // Data remains fresh indefinitely
    cacheTime: 5 * 60 * 1000, // Cached data is kept for 5 minutes
  });

  return { companyData, isLoading, companyId };
};
