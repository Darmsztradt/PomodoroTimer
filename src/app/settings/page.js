'use client';

import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function Settings() {
    const { timerSettings, setTimerSettings, volume, setVolume, theme, toggleTheme } = useSettings();
    const [local, setLocal] = useState(timerSettings);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : parseFloat(value);

        if (type === 'number') {
            const decimalPart = Math.round((newValue % 1) * 10);
            if (decimalPart >= 6 && decimalPart <= 8) {
                newValue = Math.ceil(newValue);
            } else if (decimalPart === 9) {
                newValue = Math.floor(newValue) + 0.5;
            }
        }

        setLocal((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (local.work <= 0 || local.work > 60) return alert('Błędny czas pracy');
        setTimerSettings(local);
        alert('Zapisano!');
    };

    return (
        <div className="settings-page card">
            <h2>Ustawienia</h2>
            <form onSubmit={handleSave}>
                <div className="form-group">
                    <label>Czas Pracy (min):</label>
                    <input type="number" step="0.1" name="work" value={local.work} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Krótka Przerwa (min):</label>
                    <input type="number" step="0.1" name="short_break" value={local.short_break} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Długa Przerwa (min):</label>
                    <input type="number" step="0.1" name="long_break" value={local.long_break} onChange={handleChange} />
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
                            name="autoStart"
                            checked={local.autoStart}
                            onChange={handleChange}
                        />
                        Auto-start kolejnych interwałów
                    </label>
                </div>

                <button type="submit" className="btn-primary">Zapisz ustawienia</button>
            </form>

            <div className="settings-footer">
                <span>Aktualny motyw: <strong>{theme === 'light' ? 'Jasny' : 'Ciemny'}</strong></span>
                <button className="btn-primary btn-secondary" type="button" onClick={toggleTheme}>
                    Zmień Motyw
                </button>
            </div>
        </div>
    );
}