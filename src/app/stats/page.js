'use client';

import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Stats() {
    const { stats } = useTasks();
    const [currentDate, setCurrentDate] = useState(null);

    React.useEffect(() => {
        setCurrentDate(new Date());
    }, []);

    if (!currentDate) return null; // or a loading spinner

    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    const getDayName = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pl-PL', { weekday: 'short' });
    };

    const getFormattedDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
    };

    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        const today = new Date();
        if (newDate > today) {
            setCurrentDate(today);
        } else {
            setCurrentDate(newDate);
        }
    };

    const isCurrentWeek = new Date(currentDate).toDateString() === new Date().toDateString();

    const maxVal = Math.max(...days.map(day => stats.daily?.[day] || 0), 5);

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
                        {((stats.totalPomodoros * 25) / 60).toFixed(1)} h
                    </p>
                </div>
            </div>

            <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 10px' }}>
                <button onClick={handlePrevWeek} className="nav-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                    <FaChevronLeft />
                </button>
                <h3>Ostatnie 7 dni</h3>
                <button onClick={handleNextWeek} disabled={isCurrentWeek} className="nav-btn" style={{ background: 'none', border: 'none', cursor: isCurrentWeek ? 'default' : 'pointer', color: isCurrentWeek ? 'var(--text-secondary)' : 'var(--text-primary)', opacity: isCurrentWeek ? 0.5 : 1, fontSize: '1.2rem' }}>
                    <FaChevronRight />
                </button>
            </div>

            <div className="chart-container">
                <div className="chart">
                    {days.map((day) => {
                        const count = stats.daily?.[day] || 0;
                        const heightPercent = (count / maxVal) * 100;

                        return (
                            <div key={day} className="day-column">
                                <div className="bar-wrapper">
                                    <div
                                        className="chart-bar"
                                        style={{ height: `${heightPercent}%` }}
                                    >
                                        {count > 0 && <span className="bar-count">{count}</span>}
                                    </div>
                                </div>
                                <div className="day-label" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                    <span className="day-name">{getDayName(day)}</span>
                                    <span className="day-date" style={{ fontSize: '0.7em', color: 'var(--text-secondary)' }}>{getFormattedDate(day)}</span>
                                    {count > 0 && <span className="tomato-icon">🍅</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}