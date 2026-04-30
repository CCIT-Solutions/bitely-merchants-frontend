import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useCallback } from "react";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const GC_TIME = 10 * 60 * 1000;   // 10 minutes

type UseApiQueryOptions<TData, TError = Error> = Omit<
  UseQueryOptions<TData, TError, TData, readonly unknown[]>,
  "queryKey" | "queryFn"
> & {
  queryKey: readonly unknown[];
  queryFn: () => Promise<TData>;
};

interface UseApiQueryResult<TData, TError = Error> {
  data: TData | undefined;
  isLoading: boolean;
  error: TError | null;
  retry: () => void;
}

/**
 * Custom API hook wrapping React Query's useQuery with sensible defaults.
 */
export function useApi<TData, TError = Error>({
  queryKey,
  queryFn,
  ...options
}: UseApiQueryOptions<TData, TError>): UseApiQueryResult<TData, TError> {
  const {
    data = undefined,
    isLoading,
    error,
    refetch,
  }: UseQueryResult<TData, TError> = useQuery({
    queryKey,
    queryFn,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options, 
  });

  const retry = useCallback(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error: error ?? null, retry };
}
