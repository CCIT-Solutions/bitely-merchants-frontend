import { useQuery } from "@tanstack/react-query";
import EventsApiEndpoints from "./api";

export const useGetEvents = (language?: string) => {
  return useQuery({
    queryKey: ["events", language],
    queryFn: () =>
      EventsApiEndpoints.getAll(),
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30,
  });
};

export const useGetEventBySlug = (slug: string, language?: string) => {
  return useQuery({
    queryKey: ['event', slug, language],
    queryFn: () => EventsApiEndpoints.getEventBySlug(slug),
    enabled: !!slug,
  });
};

export const useGetEventTickets = (id: string, language?: string) => {
  return useQuery({
    queryKey: ['event-tickets', id, language],
    queryFn: () => EventsApiEndpoints.getEventTickets(id),
    enabled: !!id,
  });
};

export const useGetEventCart = (slug: string, language?: string) => {
  return useQuery({
    queryKey: ['event-cart', slug, language],
    queryFn: () => EventsApiEndpoints.getEventCart(slug),
    enabled: !!slug,
  });
};




