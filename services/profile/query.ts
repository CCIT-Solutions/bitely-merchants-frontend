import { useQuery, UseQueryOptions, UseQueryResult  } from "@tanstack/react-query";
import ProfileApiEndpoints from "./api";

export const useGetMyPastTickets = (page: number = 1, language?: string) => {
  return useQuery({
    queryKey: ["my-past-tickets", page, language],
    queryFn: () =>
      ProfileApiEndpoints.myPastTickets(page),
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30,
  });
};

export const useGetMyUpcomingTickets = (page: number = 1, language?: string) => {
  return useQuery({
    queryKey: ["my-upcoming-tickets", page, language],
    queryFn: () =>
      ProfileApiEndpoints.myUpcomingTickets(page),
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30,
  });
};

export const useGetMyInterests = (language?: string) => {
  return useQuery({
    queryKey: ["my-interests", language],
    queryFn: () =>
      ProfileApiEndpoints.myInterests(),
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30,
  });
};


type UserResponse = Awaited<ReturnType<typeof ProfileApiEndpoints.user>>;

export const useGetUser = (
  language?: string,
  options?: Omit<
    UseQueryOptions<UserResponse, Error, UserResponse, ["user", string | undefined]>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<UserResponse, Error> => {
  return useQuery({
    queryKey: ["user", language],
    queryFn: () => ProfileApiEndpoints.user(),
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30,
    ...options, 
  });
};