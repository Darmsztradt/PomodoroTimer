'use client';

import React, { useState } from 'react';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';
import { useTasks } from '@/context/TaskContext';
import QuoteDisplay from '@/components/QuoteDisplay';
import { FaPlay, FaPause, FaRedo, FaTrash, FaCheck } from 'react-icons/fa';

export default function Home() {
    const { timeLeft, isActive, mode, toggleTimer, resetTimer, formatTime, switchMode, MODES } = usePomodoroTimer();
    const { tasks, addTask, deleteTask, toggleTask, recordPomodoro } = useTasks();
    const [newTaskInput, setNewTaskInput] = useState('');
    const [activeTaskId, setActiveTaskId] = useState(null);

    // Sprawdzamy, czy timer skończył odliczanie (prosta detekcja dla zapisu statystyk)
    // W idealnym świecie hook zwracałby event, tu zrobimy to manualnie przyciskiem lub auto
    // Uproszczenie: Użytkownik ręcznie klika "+" przy zadaniu, lub dodamy logikę w hooku (bardziej skomplikowane).
    // Tutaj: Dodaj przycisk "Zalicz sesję" dla zadania.

    const handleAddTask = () => {
        if (newTaskInput.trim()) {
            addTask(newTaskInput);
            setNewTaskInput('');
        }
    };

    return (
        <div className={`timer-container mode-${mode} card`}>
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

            <div className={`timer-circle ${isActive ? 'active' : ''}`}>
                {formatTime(timeLeft)}
            </div>

            <div className="controls">
                <button onClick={toggleTimer} aria-label="Start/Pauza">
                    {isActive ? <FaPause /> : <FaPlay />}
                </button>
                <button onClick={resetTimer} aria-label="Reset">
                    <FaRedo />
                </button>
            </div>

            <div className="tasks-section" style={{ marginTop: '2rem', textAlign: 'left' }}>
                <h3>Zadania</h3>
                <div className="add-task">
                    <input
                        value={newTaskInput}
                        onChange={(e) => setNewTaskInput(e.target.value)}
                        placeholder="Dodaj zadanie..."
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    />
                    <button className="btn-primary" onClick={handleAddTask}>Dodaj</button>
                </div>

                <ul>
                    {tasks.map((task) => (
                        <li key={task.id} className={task.completed ? 'completed' : ''}>
                            <span className="title" onClick={() => setActiveTaskId(task.id)}>
                                {activeTaskId === task.id ? '👉 ' : ''}{task.title}
                            </span>
                            <div className="task-actions">
                                <span style={{ marginRight: '10px', fontSize: '0.9rem' }}>
                                    🍅 {task.pomodoros}
                                </span>
                                <button onClick={() => recordPomodoro(task.id)} title="Zalicz Pomodoro">+</button>
                                <button onClick={() => toggleTask(task.id)} title="Ukończ"><FaCheck /></button>
                                <button onClick={() => deleteTask(task.id)} title="Usuń"><FaTrash /></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <QuoteDisplay />
        </div>
    );
}