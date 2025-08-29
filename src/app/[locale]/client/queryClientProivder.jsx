// app/providers.tsx ('use client')
"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    <ReactQueryDevtools initialIsOpen={true} /> 
    </QueryClientProvider>
  );
}