'use client';

import React from 'react';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';
import { useTasks } from '@/context/TaskContext';
import QuoteDisplay from '@/components/QuoteDisplay';
import TimerHeader from '@/components/TimerHeader';
import TimerControls from '@/components/TimerControls';
import TasksSection from '@/components/TasksSection';

export default function Home() {
    const { timeLeft, isActive, mode, toggleTimer, resetTimer, formatTime, switchMode, MODES } = usePomodoroTimer();
    const taskProps = useTasks(); // Pass the whole context object or spread it

    return (
        <div className={`timer-container mode-${mode} card`}>
            <TimerHeader mode={mode} switchMode={switchMode} MODES={MODES} />

            <div className={`timer-circle ${isActive ? 'active' : ''}`}>
                {formatTime(timeLeft)}
            </div>

            <TimerControls
                isActive={isActive}
                toggleTimer={toggleTimer}
                resetTimer={resetTimer}
            />

            <TasksSection {...taskProps} />
            <QuoteDisplay />
        </div>
    );
}