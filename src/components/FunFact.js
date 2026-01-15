'use client';

import { useFetch } from '../hooks/useFetch';

export default function FunFact() {
    const { data, loading, error, refetch } = useFetch('https://uselessfacts.jsph.pl/random.json?language=en');
    const fact = data ? data.text : '';
    const displayError = error || (data === null && !loading);

    return (
        <div className="fun-fact-box" style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '1rem', opacity: 0.8 }}>🤔 Czy wiesz, że...</h4>
            {loading ? (
                <p style={{ fontSize: '0.9rem' }}>Szukam ciekawostki...</p>
            ) : displayError ? (
                <p style={{ fontSize: '0.9rem', color: '#ffaaaa' }}>Nie udało się pobrać ciekawostki :/</p>
            ) : (
                <p style={{ fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '10px' }}>"{fact}"</p>
            )}
            <button
                onClick={refetch}
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
