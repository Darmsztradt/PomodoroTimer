'use client';

import React, { useState, useEffect } from 'react';

export default function FunFact() {
    const [fact, setFact] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchFact = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
            const data = await res.json();
            setFact(data.text);
        } catch (error) {
            setFact('Nie udało się pobrać ciekawostki :/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFact();
    }, []);

    return (
        <div className="fun-fact-box" style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '1rem', opacity: 0.8 }}>🤔 Czy wiesz, że...</h4>
            {loading ? (
                <p style={{ fontSize: '0.9rem' }}>Szukam ciekawostki...</p>
            ) : (
                <p style={{ fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '10px' }}>"{fact}"</p>
            )}
            <button
                onClick={fetchFact}
                style={{
                    background: 'transparent',
                    border: '1px solid var(--text-primary)',
                    color: 'var(--text-primary)',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    opacity: 0.7
                }}
            >
                Nowa ciekawostka
            </button>
        </div>
    );
}
