'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import confetti from 'canvas-confetti';

const MODES = {
    WORK: 'work',
    SHORT_BREAK: 'short_break',
    LONG_BREAK: 'long_break',
};

const STORAGE_KEY = 'pomodoro_timer_state';

export const usePomodoroTimer = () => {
    const { timerSettings, volume } = useSettings();
    const [mode, setMode] = useState(MODES.WORK);
    // Inicializacja
    const [timeLeft, setTimeLeft] = useState(timerSettings.work * 60);
    const [isActive, setIsActive] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const audioRef = useRef(null);
    const prevSettingsRef = useRef(timerSettings);

    // State ref
    const stateRef = useRef({ mode, timeLeft, isActive });
    useEffect(() => {
        stateRef.current = { mode, timeLeft, isActive };
    }, [mode, timeLeft, isActive]);

    useEffect(() => {
        audioRef.current = new Audio('/notification.mp3');
    }, []);

    // ładowanie i zapisanie stanu
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Object.values(MODES).includes(parsed.mode)) {
                    setMode(parsed.mode);
                    setTimeLeft(parsed.timeLeft);
                    // Always start paused to avoid confusion
                    setIsActive(false);
                }
            }
        } catch (e) {
            console.error("Failed to load timer state", e);
        } finally {
            setIsLoaded(true);
        }

        const handleUnload = () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current));
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, timeLeft, isActive }));
        }
    }, [mode, isActive, isLoaded]);

    // zmiany ustawień
    useEffect(() => {
        if (!isLoaded) return;

        const settingsChanged = JSON.stringify(prevSettingsRef.current) !== JSON.stringify(timerSettings);
        if (settingsChanged) {
            if (!isActive) {
                setTimeLeft(timerSettings[mode] * 60);
            }
            prevSettingsRef.current = timerSettings;
        }
    }, [timerSettings, mode, isActive, isLoaded]);


    const playSound = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.play().catch((e) => console.log('Audio error:', e));
        }
    }, [volume]);

    const switchMode = useCallback((newMode) => {
        setMode(newMode);
        setTimeLeft(timerSettings[newMode] * 60);
        setIsActive(timerSettings.autoStart);
    }, [timerSettings]);

    const handleTimerComplete = useCallback(() => {
        playSound();
        if (mode === MODES.WORK) confetti();
        setIsActive(false);

        const nextMode = mode === MODES.WORK ? MODES.SHORT_BREAK : MODES.WORK;
        switchMode(nextMode);
    }, [mode, switchMode, playSound]);

    // interwał
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            handleTimerComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, handleTimerComplete]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(timerSettings[mode] * 60);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return {
        timeLeft,
        isActive,
        mode,
        toggleTimer,
        resetTimer,
        formatTime,
        switchMode,
        MODES,
    };
};
