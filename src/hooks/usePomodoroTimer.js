import { useTimer } from '../context/TimerContext';

export const usePomodoroTimer = () => {
    return useTimer();
};
