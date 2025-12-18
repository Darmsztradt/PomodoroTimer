import React, { useState } from 'react';
import { FaTrash, FaCheck } from 'react-icons/fa';

export default function TasksSection({ tasks, addTask, deleteTask, toggleTask, recordPomodoro }) {
    const [newTaskInput, setNewTaskInput] = useState('');
    const [activeTaskId, setActiveTaskId] = useState(null);

    const handleAddTask = () => {
        if (newTaskInput.trim()) {
            addTask(newTaskInput);
            setNewTaskInput('');
        }
    };

    return (
        <div className="tasks-section">
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
                            <span className="pomodoro-count">
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
    );
}
