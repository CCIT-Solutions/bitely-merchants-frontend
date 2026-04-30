import { useQuery } from "@tanstack/react-query";
import CheckoutApiEndpoints from "./api";

export const useGetCheckout = (slug: string, language?: string) => {
  return useQuery({
    queryKey: ["checkout", slug, language],
    queryFn: () => CheckoutApiEndpoints.getCheckout(slug),
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    enabled: !!slug,
  });
};

export const useGetCheckoutThank = (id: string, language?: string) => {
  return useQuery({
    queryKey: ["checkout-thank", id, language],
    queryFn: () => CheckoutApiEndpoints.getCheckoutThank(id),
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    enabled: !!id,
  });
};
