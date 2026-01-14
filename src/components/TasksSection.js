import React, { useState } from 'react';
import { FaTrash, FaCheck } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';

export default function TasksSection({ tasks, addTask, deleteTask, toggleTask, recordPomodoro }) {
    const [newTaskInput, setNewTaskInput] = useState('');
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [error, setError] = useState('');
    const { addToast } = useToast();

    const handleAddTask = (e) => {
        e.preventDefault();

        const trimmedInput = newTaskInput.trim();

        if (!trimmedInput) {
            setError('Nazwa zadania nie może być pusta.');
            return;
        }

        if (trimmedInput.length < 3) {
            setError('Nazwa zadania musi mieć co najmniej 3 znaki.');
            return;
        }

        if (trimmedInput.length > 50) {
            setError('Nazwa zadania nie może być dłuższa niż 50 znaków.');
            return;
        }

        addTask(trimmedInput);
        setNewTaskInput('');
        setError('');
        addToast('Zadanie dodane! 🚀', 'success');
    };

    const handleInputChange = (e) => {
        setNewTaskInput(e.target.value);
        if (error) setError(''); // Clear error on typing
    };

    const handleTaskAction = (action, id, message) => {
        action(id);
        addToast(message, 'info');
    };

    return (
        <div className="tasks-section">
            <h3>Zadania</h3>

            <form className="add-task" onSubmit={handleAddTask} noValidate>
                <div className="input-group" style={{ display: 'flex', gap: '10px', width: '100%' }}>
                    <input
                        value={newTaskInput}
                        onChange={handleInputChange}
                        placeholder="Dodaj zadanie..."
                        className={error ? 'input-error' : ''}
                        style={error ? { borderColor: '#ff4d4d' } : {}}
                    />
                    <button type="submit" className="btn-primary">Dodaj</button>
                </div>
                {error && <p className="error-message" style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '5px', margin: 0 }}>{error}</p>}
            </form>

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
                            <button onClick={() => handleTaskAction(recordPomodoro, task.id, 'Pomodoro zaliczone! 🍅')} title="Zalicz Pomodoro">+</button>
                            <button onClick={() => handleTaskAction(toggleTask, task.id, 'Status zadania zmieniony ✅')} title="Ukończ"><FaCheck /></button>
                            <button onClick={() => handleTaskAction(deleteTask, task.id, 'Zadanie usunięte 🗑️')} title="Usuń"><FaTrash /></button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
