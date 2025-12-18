import React from 'react';

export default function TimerHeader({ mode, switchMode, MODES }) {
    return (
        <header className="timer-header">
            <button
                className={mode === MODES.WORK ? 'active' : ''}
                onClick={() => switchMode(MODES.WORK)}
            >
                Praca
            </button>
            <button
                className={mode === MODES.SHORT_BREAK ? 'active' : ''}
                onClick={() => switchMode(MODES.SHORT_BREAK)}
            >
                Krótka Przerwa
            </button>
            <button
                className={mode === MODES.LONG_BREAK ? 'active' : ''}
                onClick={() => switchMode(MODES.LONG_BREAK)}
            >
                Długa Przerwa
            </button>
        </header>
    );
}
