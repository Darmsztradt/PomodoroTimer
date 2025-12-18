'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import confetti from 'canvas-confetti';

const MODES = {
    WORK: 'work',
    SHORT_BREAK: 'short_break',
    LONG_BREAK: 'long_break',
};

export const usePomodoroTimer = () => {
    const { timerSettings, volume } = useSettings();
    const [mode, setMode] = useState(MODES.WORK);
    const [timeLeft, setTimeLeft] = useState(timerSettings.work * 60);
    const [isActive, setIsActive] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const audioRef = useRef(null);

    const stateRef = useRef({ mode, timeLeft, isActive });
    useEffect(() => {
        stateRef.current = { mode, timeLeft, isActive };
    }, [mode, timeLeft, isActive]);

    useEffect(() => {
        audioRef.current = new Audio('/notification.mp3');
    }, []);

    useEffect(() => {
        const loadState = () => {
            try {
                const saved = localStorage.getItem('pomodoro_timer_state');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Object.values(MODES).includes(parsed.mode)) {
                        setMode(parsed.mode);
                        setTimeLeft(parsed.timeLeft);
                        setIsActive(false);
                    }
                }
            } catch (e) {
                console.error("Failed to load timer state", e);
            } finally {
                setIsLoaded(true);
            }
        };
        loadState();
    }, []);

    useEffect(() => {
        const handleUnload = () => {
            localStorage.setItem('pomodoro_timer_state', JSON.stringify({
                mode: stateRef.current.mode,
                timeLeft: stateRef.current.timeLeft,
                isActive: stateRef.current.isActive
            }));
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            handleUnload();
        };
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('pomodoro_timer_state', JSON.stringify({
                mode,
                timeLeft,
                isActive
            }));
        }
    }, [mode, isActive, isLoaded]);

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.play().catch((e) => console.log('Błąd audio:', e));
        }
    };

    useEffect(() => {
        if (isLoaded && !isActive) {
            const settingsChanged = JSON.stringify(prevSettingsRef.current) !== JSON.stringify(timerSettings);
            if (settingsChanged) {
                setTimeLeft(timerSettings[mode] * 60);
                prevSettingsRef.current = timerSettings;
            }
        }
    }, [timerSettings, mode, isActive]);

    const prevSettingsRef = useRef(timerSettings);
    useEffect(() => {
        if (!isLoaded) return;
        const settingsChanged = JSON.stringify(prevSettingsRef.current) !== JSON.stringify(timerSettings);

        if (settingsChanged && !isActive) {
            setTimeLeft(timerSettings[mode] * 60);
            prevSettingsRef.current = timerSettings;
        }
    }, [timerSettings, mode, isActive, isLoaded]);


    const switchMode = useCallback(
        (newMode) => {
            setMode(newMode);
            setTimeLeft(timerSettings[newMode] * 60);
            setIsActive(timerSettings.autoStart);
        },
        [timerSettings]
    );

    const handleTimerComplete = useCallback(() => {
        playSound();
        if (mode === MODES.WORK) confetti();
        setIsActive(false);

        if (mode === MODES.WORK) {
            switchMode(MODES.SHORT_BREAK);
        } else {
            switchMode(MODES.WORK);
        }
    }, [mode, switchMode, volume]);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    const newVal = prev - 1;
                    return newVal;
                });
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
        switchMode,
        formatTime,
        MODES,
    };
};
