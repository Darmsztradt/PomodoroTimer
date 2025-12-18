'use client';

import { SettingsProvider } from '../context/SettingsContext';
import { TaskProvider } from '../context/TaskContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                retry: 1,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <SettingsProvider>
                <TaskProvider>
                    {children}
                </TaskProvider>
            </SettingsProvider>
        </QueryClientProvider>
    );
}