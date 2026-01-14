'use client';

import React, { useState, useEffect } from 'react';

export default function PetReward({ mode }) {
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchPet = async () => {
        setLoading(true);
        try {
            const isDog = Math.random() > 0.5;
            let url = '';

            if (isDog) {
                const res = await fetch('https://dog.ceo/api/breeds/image/random');
                const data = await res.json();
                url = data.message;
            } else {
                const res = await fetch('https://api.thecatapi.com/v1/images/search');
                const data = await res.json();
                url = data[0].url;
            }
            setImageUrl(url);
        } catch (error) {
            console.error('Failed to fetch pet', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mode === 'short_break' || mode === 'long_break') {
            fetchPet();
        }
    }, [mode]);

    if (mode === 'work') return null;

    return (
        <div className="pet-reward-box" style={{ marginTop: '20px', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '10px' }}>Czas na relaks! 🐶🐱</h4>
            <div style={{
                width: '100%',
                height: '250px',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                background: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {loading ? (
                    <span style={{ color: '#333' }}>Wołam zwierzaka...</span>
                ) : (
                    imageUrl && <img src={imageUrl} alt="Random Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
            </div>
            <button
                onClick={fetchPet}
                style={{
                    marginTop: '10px',
                    background: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    cursor: 'pointer'
                }}
            >
                Pokaż innego
            </button>
        </div>
    );
}
