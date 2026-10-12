import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { type ReactNode } from 'react';
import { UsageProfileProvider } from '@/features/usage-profile';
import { ThemeProvider } from '@/shared/theme';
import { APP_CONSTANTS } from '@/shared/config/constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: APP_CONSTANTS.CACHE.STALE_TIME_MS,
      gcTime: APP_CONSTANTS.CACHE.GC_TIME_MS,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <UsageProfileProvider>{children}</UsageProfileProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
