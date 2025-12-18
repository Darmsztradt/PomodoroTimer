'use client';

import React from 'react';
import { useTasks } from '../../context/TaskContext';

export default function Stats() {
    const { stats } = useTasks();

    // Generate last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i)); // 6 days ago to today
        return d.toISOString().split('T')[0];
    });

    // Formatting date to Day name (e.g. Mon, Tue)
    const getDayName = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pl-PL', { weekday: 'short' });
    };

    const maxVal = Math.max(...days.map(day => stats.daily?.[day] || 0), 5); // Minimum max of 5 for scale

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

            <h3>Ostatnie 7 dni</h3>
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
                                <div className="day-label">
                                    <span className="day-name">{getDayName(day)}</span>
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