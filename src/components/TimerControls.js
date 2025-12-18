import React from 'react';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';

export default function TimerControls({ isActive, toggleTimer, resetTimer }) {
    return (
        <div className="controls">
            <button onClick={toggleTimer} aria-label="Start/Pauza">
                {isActive ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={resetTimer} aria-label="Reset">
                <FaRedo />
            </button>
        </div>
    );
}
