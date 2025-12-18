'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchQuote = async () => {
    const response = await fetch('https://dummyjson.com/quotes/random');
    if (!response.ok) {
        throw new Error('Failed to fetch quote');
    }
    return response.json();
};

export default function QuoteDisplay() {
    const { data: quote, isLoading, error } = useQuery({
        queryKey: ['quote'],
        queryFn: fetchQuote,
        refetchOnWindowFocus: false, // Don't annoy user with constant refetches
    });

    if (isLoading) return <div style={{ textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>Ładowanie motywacji...</div>;
    if (error) return null; // Hide silently on error to not disturb UI

    if (!quote) return null;

    return (
        <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(0,0,0,0.03)',
            borderRadius: '12px',
            textAlign: 'center',
            fontSize: '0.95rem',
            color: 'var(--text-color)',
            fontStyle: 'italic'
        }}>
            "{quote.quote}"
            <div style={{
                marginTop: '0.5rem',
                fontWeight: '600',
                fontStyle: 'normal',
                fontSize: '0.85rem',
                opacity: 0.8
            }}>
                — {quote.author}
            </div>
        </div>
    );
}
