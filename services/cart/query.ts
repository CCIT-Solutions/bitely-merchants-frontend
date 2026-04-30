import { useQuery } from "@tanstack/react-query";
import CartApiEndpoints from "./api";

export const useGetCart = (slug: string, language?: string) => {
  return useQuery({
    queryKey: ["cart", slug, language],
    queryFn: () => CartApiEndpoints.getCart(slug),
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    enabled: !!slug
  });
};
