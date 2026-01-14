'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTasks } from '../../context/TaskContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const StatsChart = dynamic(() => import('./StatsChart'), {
    loading: () => <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Ładowanie wykresu...</div>
});

export default function Stats() {
    const { stats } = useTasks();
    const [currentDate, setCurrentDate] = useState(null);

    useEffect(() => {
        setCurrentDate(new Date());
    }, []);

    const days = useMemo(() => {
        if (!currentDate) return [];
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(currentDate);
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });
    }, [currentDate]);

    const handlePrevWeek = useCallback(() => {
        setCurrentDate((prevDate) => {
            if (!prevDate) return null;
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() - 7);
            return newDate;
        });
    }, []);

    const handleNextWeek = useCallback(() => {
        setCurrentDate((prevDate) => {
            if (!prevDate) return null;
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + 7);
            const today = new Date();
            return newDate > today ? today : newDate;
        });
    }, []);

    const isCurrentWeek = useMemo(() => {
        if (!currentDate) return false;
        return new Date(currentDate).toDateString() === new Date().toDateString();
    }, [currentDate]);

    const totalHours = useMemo(() => {
        return ((stats.totalPomodoros * 25) / 60).toFixed(1);
    }, [stats.totalPomodoros]);

    if (!currentDate) return null;

    return (
        <div className="stats-page card">
            <h2>Twoja Efektywność</h2>
            <div className="stats-summary">
                <div className="stat-card">
                    <h3>Skończone Sesje</h3>
                    <p className="stat-value">{stats.totalPomodoros}</p>
                </div>
                <div className="stat-card">
                    <h3>Czas Pracy (est.)</h3>
                    <p className="stat-value">
                        {totalHours} h
                    </p>
                </div>
            </div>

            <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 10px' }}>
                <button onClick={handlePrevWeek} className="nav-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                    <FaChevronLeft />
                </button>
                <h3>Efektywność w ciągu 7 dni</h3>
                <button onClick={handleNextWeek} disabled={isCurrentWeek} className="nav-btn" style={{ background: 'none', border: 'none', cursor: isCurrentWeek ? 'default' : 'pointer', color: isCurrentWeek ? 'var(--text-secondary)' : 'var(--text-primary)', opacity: isCurrentWeek ? 0.5 : 1, fontSize: '1.2rem' }}>
                    <FaChevronRight />
                </button>
            </div>

            <StatsChart days={days} dailyStats={stats.daily} />
        </div>
    );
}
