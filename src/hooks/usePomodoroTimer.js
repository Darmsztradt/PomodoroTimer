import { useTimer } from '../context/TimerContext';

// Re-export everything from the context hook
// This maintains the existing API so we don't need to change components that use this hook
export const usePomodoroTimer = () => {
    return useTimer();
};
