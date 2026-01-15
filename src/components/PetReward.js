'use client';

import React, { useState, useEffect } from 'react';

import { useFetch } from '../hooks/useFetch';

const DOG_API = 'https://dog.ceo/api/breeds/image/random';
const CAT_API = 'https://api.thecatapi.com/v1/images/search';

export default function PetReward({ mode }) {
    const [currentApi, setCurrentApi] = useState(null);
    const { data, loading, error, refetch } = useFetch(currentApi);

    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (!data) return;

        if (currentApi === DOG_API) {
            setImageUrl(data.message);
        } else if (currentApi === CAT_API) {
            setImageUrl(data[0]?.url);
        }
    }, [data, currentApi]);

    const handleNewPet = () => {
        const isDog = Math.random() > 0.5;
        const newApi = isDog ? DOG_API : CAT_API;

        if (newApi === currentApi) {
            refetch();
        } else {
            setCurrentApi(newApi);
        }
    };

    useEffect(() => {
        if (mode === 'short_break' || mode === 'long_break') {
            handleNewPet();
        } else {
            setCurrentApi(null);
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
                onClick={handleNewPet}
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
