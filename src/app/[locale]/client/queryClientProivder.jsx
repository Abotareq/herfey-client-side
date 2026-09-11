// app/providers.tsx ('use client')
"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // the default of three retries with backoff meant a dead backend took
      // 7s+ to reach isError; one retry surfaces the placeholder in ~2s
      retry: 1,
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
