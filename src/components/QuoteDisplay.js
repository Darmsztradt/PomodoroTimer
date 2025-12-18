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
        refetchOnWindowFocus: false,
    });

    if (isLoading) return <div style={{ textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>Ładowanie motywacji...</div>;
    if (error) return null;

    if (!quote) return null;

    return (
        <div className="quote-box">
            "{quote.quote}"
            <div className="quote-author">
                — {quote.author}
            </div>
        </div>
    );
}
