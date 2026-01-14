import React, { useMemo } from 'react';

const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', { weekday: 'short' });
};

const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
};

export default function StatsChart({ days, dailyStats }) {
    const maxVal = useMemo(() => {
        return Math.max(...days.map(day => dailyStats?.[day] || 0), 5);
    }, [days, dailyStats]);

    return (
        <div className="chart-container">
            <div className="chart">
                {days.map((day) => {
                    const count = dailyStats?.[day] || 0;
                    const heightPercent = maxVal > 0 ? (count / maxVal) * 100 : 0;

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
    );
}
