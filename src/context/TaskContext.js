'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../api/storageService';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ daily: {}, totalPomodoros: 0 });
    const [loading, setLoading] = useState(true);

    // Pobieranie danych przy starcie
    useEffect(() => {
        const loadData = async () => {
            const storedTasks = await storageService.getData('pomodoro_tasks');
            const storedStats = await storageService.getData('pomodoro_stats');
            if (storedTasks) setTasks(storedTasks);
            if (storedStats) setStats(storedStats);
            setLoading(false);
        };
        loadData();
    }, []);

    // Zapisywanie danych przy zmianie
    useEffect(() => {
        if (!loading) {
            storageService.saveData('pomodoro_tasks', tasks);
            storageService.saveData('pomodoro_stats', stats);
        }
    }, [tasks, stats, loading]);

    const addTask = (title) => {
        setTasks([...tasks, { id: Date.now(), title, completed: false, pomodoros: 0 }]);
    };

    const editTask = (id, newTitle) => {
        setTasks(tasks.map((t) => (t.id === id ? { ...t, title: newTitle } : t)));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter((t) => t.id !== id));
    };

    const toggleTask = (id) => {
        setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    };

    const recordPomodoro = (taskId) => {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Jeśli wybrano zadanie, zwiększ licznik dla niego
        if (taskId) {
            setTasks((prev) =>
                prev.map((t) => (t.id === taskId ? { ...t, pomodoros: t.pomodoros + 1 } : t))
            );
        }

        // Aktualizacja ogólnych statystyk
        setStats((prev) => ({
            ...prev,
            totalPomodoros: prev.totalPomodoros + 1,
            daily: {
                ...prev.daily,
                [today]: (prev.daily[today] || 0) + 1,
            },
        }));
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                stats,
                loading,
                addTask,
                editTask,
                deleteTask,
                toggleTask,
                recordPomodoro,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};