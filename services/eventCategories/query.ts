import { useQuery } from "@tanstack/react-query";
import EventCategoriesApiEndpoints from "./api";

export const useGetEventCategories = (language?: string) => {
  return useQuery({
    queryKey: ["event-categories", language],
    queryFn: () =>
      EventCategoriesApiEndpoints.getAll(),
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });
};
