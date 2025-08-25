import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import ProductApi from "../api/productApi";

export const useProductData = (productId) => {
  const { data: productData, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () =>
      ProductApi.fetchProduct({
        productId,
        populate: "ofCompany",
        selectPopulate: "name",
      }),
    enabled: !!productId,
    staleTime: Infinity, // Data remains fresh indefinitely
    cacheTime: 5 * 60 * 1000, // Cached data is kept for 5 minutes
  });

  return { productData, isLoading, productId };
};
