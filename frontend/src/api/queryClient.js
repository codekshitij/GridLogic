import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Cache race data forever in the current session
      cacheTime: 1000 * 60 * 60 * 24, // Keep in memory for 24 hours
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
