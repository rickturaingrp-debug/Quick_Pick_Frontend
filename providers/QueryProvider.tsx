"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // Cache data is considered fresh for 5 minutes
                        gcTime: 10 * 60 * 1000, // Garbage collection time (formerly cacheTime)
                        refetchOnWindowFocus: false, // Prevent refetching when window gains focus
                        refetchOnMount: false, // Prevent refetching on component mount even if stale
                        refetchOnReconnect: false, // Prevent refetching on network reconnect
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
