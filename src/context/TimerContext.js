'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSettings } from './SettingsContext';
import { useTasks } from './TaskContext';

const TimerContext = createContext();

const MODES = {
    WORK: 'work',
    SHORT_BREAK: 'short_break',
    LONG_BREAK: 'long_break',
};

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
    const { timerSettings } = useSettings();
    const { recordPomodoro } = useTasks();

    const initialState = {
        mode: MODES.WORK,
        timeLeft: 25 * 60,
        isActive: false
    };

    const timerReducer = (state, action) => {
        switch (action.type) {
            case 'SET_MODE':
                return {
                    ...state,
                    mode: action.payload,
                    isActive: false,
                    timeLeft: (timerSettings?.[action.payload] || 25) * 60
                };
            case 'TICK':
                if (state.timeLeft <= 0) return state;
                return {
                    ...state,
                    timeLeft: state.timeLeft - 1
                };
            case 'TOGGLE':
                return {
                    ...state,
                    isActive: !state.isActive
                };
            case 'RESET':
                return {
                    ...state,
                    isActive: false,
                    timeLeft: (timerSettings?.[state.mode] || 25) * 60
                };
            case 'STOP':
                return {
                    ...state,
                    isActive: false
                };
            case 'SYNC_SETTINGS':
                // Only sync if not active to avoid jumping time
                if (state.isActive) return state;
                return {
                    ...state,
                    timeLeft: (timerSettings?.[state.mode] || 25) * 60
                };
            default:
                return state;
        }
    };

    const [state, dispatch] = React.useReducer(timerReducer, initialState);
    const { mode, timeLeft, isActive } = state;

    // Sync with settings when they change (and timer is not active)
    useEffect(() => {
        if (timerSettings) {
            dispatch({ type: 'SYNC_SETTINGS' });
        }
    }, [timerSettings]);

    const soundRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            soundRef.current = new Audio('/sounds/bell.mp3');
        }
    }, []);

    const playSound = () => {
        if (soundRef.current) {
            soundRef.current.play().catch(error => console.log('Audio play failed', error));
        }
    };

    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                dispatch({ type: 'TICK' });
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer just finished
            clearInterval(interval);
            dispatch({ type: 'STOP' });
            playSound();
            if (mode === MODES.WORK) {
                recordPomodoro();
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, recordPomodoro]);

    const toggleTimer = useCallback(() => {
        dispatch({ type: 'TOGGLE' });
    }, []);

    const resetTimer = useCallback(() => {
        dispatch({ type: 'RESET' });
    }, []);

    const switchMode = useCallback((newMode) => {
        dispatch({ type: 'SET_MODE', payload: newMode });
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <TimerContext.Provider value={{
            timeLeft,
            isActive,
            mode,
            toggleTimer,
            resetTimer,
            formatTime,
            switchMode,
            MODES
        }}>
            {children}
        </TimerContext.Provider>
    );
};
