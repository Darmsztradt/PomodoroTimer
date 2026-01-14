'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../api/storageService';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [volume, setVolume] = useState(0.5);
    const [timerSettings, setTimerSettings] = useState({
        work: 25 * 60,
        short_break: 5 * 60,
        long_break: 15 * 60,
        autoStart: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            const storedSettings = await storageService.getData('pomodoro_settings');
            if (storedSettings) {
                if (storedSettings.theme) setTheme(storedSettings.theme);
                if (storedSettings.volume !== undefined) setVolume(storedSettings.volume);

                if (storedSettings.timerSettings) {

                    const newSettings = { ...storedSettings.timerSettings };

                    ['work', 'short_break', 'long_break'].forEach(key => {
                        if (newSettings[key] && newSettings[key] <= 180) {
                            newSettings[key] = Math.round(newSettings[key] * 60);
                        }
                    });

                    setTimerSettings(newSettings);
                }
            }
            setLoading(false);
        };
        loadSettings();
    }, []);

    useEffect(() => {
        if (!loading) {
            storageService.saveData('pomodoro_settings', {
                theme,
                volume,
                timerSettings
            });
        }
    }, [theme, volume, timerSettings, loading]);

    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
    }, [theme]);

    const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

    if (loading) return null;

    return (
        <SettingsContext.Provider
            value={{
                theme,
                toggleTheme,
                volume,
                setVolume,
                timerSettings,
                setTimerSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};