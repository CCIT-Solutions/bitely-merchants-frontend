import { useQuery } from "@tanstack/react-query";
import CategoriesApiEndpoints from "./api";

export const useGetLandingCategories = (language?: string) => {
  return useQuery({
    queryKey: ["landing-categories", language],
    queryFn: () =>
      CategoriesApiEndpoints.getAll(),
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });
};