'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function Settings() {
    const { timerSettings, setTimerSettings, volume, setVolume, theme, toggleTheme } = useSettings();

    const [local, setLocal] = useState({
        work: { m: 25, s: 0 },
        short_break: { m: 5, s: 0 },
        long_break: { m: 15, s: 0 },
        autoStart: false
    });

    const [saveStatus, setSaveStatus] = useState('');


    useEffect(() => {
        if (timerSettings) {
            const parseSeconds = (totalSeconds) => {
                const sec = Math.round(totalSeconds);
                return {
                    m: Math.floor(sec / 60),
                    s: sec % 60
                };
            };

            setLocal({
                work: parseSeconds(timerSettings.work || 1500),
                short_break: parseSeconds(timerSettings.short_break || 300),
                long_break: parseSeconds(timerSettings.long_break || 900),
                autoStart: timerSettings.autoStart || false
            });
        }
    }, [timerSettings]);

    const handleTimeChange = (category, field, value) => {
        let val = value === '' ? '' : parseInt(value, 10);
        if (val !== '' && isNaN(val)) val = 0;

        setLocal(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: val
            }
        }));
    };

    const handleAutoStartChange = (e) => {
        setLocal(prev => ({ ...prev, autoStart: e.target.checked }));
    };

    const handleSave = (e) => {
        e.preventDefault();

        const toSeconds = (t) => {
            const m = parseInt(t.m) || 0;
            const s = parseInt(t.s) || 0;
            return (m * 60) + s;
        };

        const newSettings = {
            work: toSeconds(local.work),
            short_break: toSeconds(local.short_break),
            long_break: toSeconds(local.long_break),
            autoStart: local.autoStart
        };

        if (newSettings.work <= 0) {
            setSaveStatus('error');
            return;
        }

        setTimerSettings(newSettings);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(''), 3000);
    };

    return (
        <div className="settings-page card">
            <h2>Ustawienia</h2>
            <form onSubmit={handleSave}>
                <div className="time-settings-grid">
                    <div className="form-group">
                        <label>Czas Pracy (min : sek)</label>
                        <div className="time-inputs">
                            <input
                                type="number" min="0" max="120"
                                value={local.work.m}
                                onChange={(e) => handleTimeChange('work', 'm', e.target.value)}
                                placeholder="Min"
                            />
                            <span className="separator">:</span>
                            <input
                                type="number" min="0" max="59"
                                value={local.work.s}
                                onChange={(e) => handleTimeChange('work', 's', e.target.value)}
                                placeholder="Sek"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Krótka Przerwa (min : sek)</label>
                        <div className="time-inputs">
                            <input
                                type="number" min="0" max="120"
                                value={local.short_break.m}
                                onChange={(e) => handleTimeChange('short_break', 'm', e.target.value)}
                            />
                            <span className="separator">:</span>
                            <input
                                type="number" min="0" max="59"
                                value={local.short_break.s}
                                onChange={(e) => handleTimeChange('short_break', 's', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Długa Przerwa (min : sek)</label>
                        <div className="time-inputs">
                            <input
                                type="number" min="0" max="120"
                                value={local.long_break.m}
                                onChange={(e) => handleTimeChange('long_break', 'm', e.target.value)}
                            />
                            <span className="separator">:</span>
                            <input
                                type="number" min="0" max="59"
                                value={local.long_break.s}
                                onChange={(e) => handleTimeChange('long_break', 's', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Głośność: {Math.round(volume * 100)}%</label>
                    <input
                        type="range" min="0" max="1" step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                    />
                </div>

                <div className="form-group checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={local.autoStart}
                            onChange={handleAutoStartChange}
                        />
                        Auto-start kolejnych interwałów
                    </label>
                </div>

                <button type="submit" className="btn-primary">
                    {saveStatus === 'success' ? 'Zapisano! ✅' : 'Zapisz ustawienia'}
                </button>
                {saveStatus === 'error' && <p style={{ color: '#ff4d4d', marginTop: '10px' }}>Czas pracy musi być dłuższy niż 0.</p>}
            </form>

            <div className="settings-footer">
                <span>Aktualny motyw: <strong>{theme === 'light' ? 'Jasny' : 'Ciemny'}</strong></span>
                <button className="btn-primary btn-secondary" type="button" onClick={toggleTheme}>
                    Zmień Motyw
                </button>
            </div>

            <style jsx>{`
                .time-inputs {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .time-inputs input {
                    width: 70px;
                    text-align: center;
                    padding: 8px;
                    border: 1px solid var(--border-color);
                    border-radius: 6px;
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                }
                .separator {
                    font-weight: bold;
                    font-size: 1.2rem;
                    color: var(--text-primary);
                }
                .time-settings-grid {
                    display: grid;
                    gap: 20px;
                    margin-bottom: 20px;
                }
            `}</style>
        </div>
    );
}