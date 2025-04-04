import React, { useEffect, useState, useRef } from 'react';

function App() {
    const [hoursStudied, setHoursStudied] = useState(JSON.parse(localStorage.getItem("hoursStudied")) || 0);
    const [minutesStudied, setMinutesStudied] = useState(JSON.parse(localStorage.getItem("minutesStudied")) || 0);
    const [dailyGoalHours, setDailyGoalHours] = useState(parseInt(localStorage.getItem("dailyGoalHours")) || 4);
    const [dailyGoalMinutes, setDailyGoalMinutes] = useState(parseInt(localStorage.getItem("dailyGoalMinutes")) || 0);
    const [sessionHours, setSessionHours] = useState(''); // Inicializado como string vazia
    const [sessionMinutes, setSessionMinutes] = useState(''); // Inicializado como string vazia

    // Estados para o cronômetro (seu código existente)
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalRef = useRef(null);

    const handleSessionHoursChange = (e) => {
        const value = e.target.value;
        if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 0)) {
            setSessionHours(value);
        }
    };

    const handleSessionMinutesChange = (e) => {
        const value = e.target.value;
        if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 0 && parseInt(value) <= 59)) {
            setSessionMinutes(value);
        }
    };

    const registerSession = () => {
        const hours = parseInt(sessionHours) || 0;
        const minutes = parseInt(sessionMinutes) || 0;

        let totalMinutes = parseInt(minutesStudied) + minutes;
        let newHours = parseInt(hoursStudied) + hours + Math.floor(totalMinutes / 60);
        let newMinutes = totalMinutes % 60;

        setHoursStudied(newHours);
        setMinutesStudied(newMinutes);
        setSessionHours(''); // Limpar após registrar
        setSessionMinutes(''); // Limpar após registrar
    };

    const totalStudiedMinutes = hoursStudied * 60 + minutesStudied;
    const totalGoalMinutes = dailyGoalHours * 60 + dailyGoalMinutes;
    const remainingTotalMinutes = totalGoalMinutes - totalStudiedMinutes;

    const remainingHours = Math.max(0, Math.floor(remainingTotalMinutes / 60));
    const remainingMinutes = Math.max(0, remainingTotalMinutes % 60);

    const formatStudiedTime = () => {
        if (hoursStudied === 0 && minutesStudied > 0) {
            return `${minutesStudied}min`;
        }
        if (minutesStudied === 0 && hoursStudied > 0) {
            return `${hoursStudied}h`;
        }
        if (hoursStudied === 0 && minutesStudied === 0) {
            return `0min`;
        }
        return `${hoursStudied}h${minutesStudied}min`;
    };

    const formatRemainingTime = () => {
        let remainingText = "";
        if (remainingHours > 0) {
            remainingText += `${remainingHours}h`;
        }
        if (remainingMinutes > 0) {
            remainingText += `${remainingMinutes}min`;
        }
        if (remainingHours === 0 && remainingMinutes === 0) {
            remainingText = `0min`;
        }
        return remainingText ? `${remainingText} remaining` : "";
    };

    const formatElapsedTime = () => {
        const totalSeconds = Math.floor(elapsedTime / 1000);
        const elapsedHours = Math.floor(totalSeconds / 3600);
        const elapsedMinutes = Math.floor((totalSeconds % 3600) / 60);
        const elapsedSeconds = totalSeconds % 60;

        const formattedHours = String(elapsedHours).padStart(2, '0');
        const formattedMinutes = String(elapsedMinutes).padStart(2, '0');
        const formattedSeconds = String(elapsedSeconds).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    const startTimer = () => {
        if (!isRunning) {
            setIsRunning(true);
            intervalRef.current = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1000);
            }, 1000);
        }
    };

    const pauseTimer = () => {
        if (isRunning) {
            setIsRunning(false);
            clearInterval(intervalRef.current);
        }
    };

    const completeSession = () => {
        pauseTimer();
        const totalSeconds = Math.floor(elapsedTime / 1000);
        const elapsedHours = Math.floor(totalSeconds / 3600);
        const elapsedMinutes = Math.floor((totalSeconds % 3600) / 60);

        let totalMinutes = parseInt(minutesStudied) + elapsedMinutes;
        let newHours = parseInt(hoursStudied) + elapsedHours + Math.floor(totalMinutes / 60);
        let newMinutes = totalMinutes % 60;

        setHoursStudied(newHours);
        setMinutesStudied(newMinutes);
        setElapsedTime(0);
    };

    useEffect(() => {
        return () => clearInterval(intervalRef.current); // Limpar o intervalo do cronômetro
    }, []);

    useEffect(() => {
        const resetAtMidnight = () => {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0); // Próxima meia-noite
            const timeUntilMidnight = midnight.getTime() - now.getTime();

            setTimeout(() => {
                setHoursStudied(0);
                setMinutesStudied(0);

                // Reagenda o reset para a próxima meia-noite
                resetAtMidnight();
            }, timeUntilMidnight);
        };

        // Inicia a verificação para o reset na montagem do componente
        resetAtMidnight();

        // Salvar os dados no localStorage sempre que `hoursStudied` ou `minutesStudied` mudarem
        localStorage.setItem("hoursStudied", JSON.stringify(hoursStudied));
        localStorage.setItem("minutesStudied", JSON.stringify(minutesStudied));
        localStorage.setItem("dailyGoalHours", JSON.stringify(dailyGoalHours));
        localStorage.setItem("dailyGoalMinutes", JSON.stringify(dailyGoalMinutes));

    }, [hoursStudied, minutesStudied, dailyGoalHours, dailyGoalMinutes]);

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 items-center">
            {/* Header (seu código existente) */}
            <header className="bg-slate-900 w-full h-[15vh] flex items-center justify-center text-neutral-50 pt-4">
                <h1 className="text-6xl font-bold font-serif text-center">FOCUS</h1>
            </header>

            <div className="w-full flex flex-col items-center bg-slate-900 p-8">
                <div className="w-full flex flex-col items-center bg-neutral-50 pt-4 rounded-2xl h-[78.133vh]">
                    <div className="mt-8 h-40 w-40 rounded-full flex flex-col items-center justify-center shadow-xl border-1 border-neutral-300 bg-neutral-200">
                        <p className="text-3xl font-bold text-slate-900">{formatStudiedTime()}</p>
                        <p className="text-sm text-red-400">{formatRemainingTime()}</p>
                    </div>

                    <div className="container mx-auto flex justify-center p-4">
                        <div className="flex flex-col items-center m-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Horas:
                            </label>
                            <input
                                type="number"
                                value={sessionHours}
                                onChange={handleSessionHoursChange}
                                className="shadow-xl border border-neutral-200 bg-neutral-100 appearance-none rounded-full w-16 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="m-4 flex flex-col items-center">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Minutos:
                            </label>
                            <input
                                type="number"
                                value={sessionMinutes}
                                onChange={handleSessionMinutesChange}
                                className="shadow-xl border-neutral-200 bg-neutral-100 appearance-none border rounded-full w-16 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    </div>

                    <button
                        onClick={registerSession}
                        className="shadow-xl bg-slate-900 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </button>

                    <div className="mt-6 flex flex-col items-center">
                        <h1 className="text-3xl font-bold text-slate-900 pb-4">Session</h1>
                        <div className="text-xl font-semibold h-28 w-28 bg-neutral-200 border border-neutral-300 shadow-xl flex justify-center items-center rounded-full text-slate-900">{formatElapsedTime()}</div>
                        <div className="flex my-6">
                            <button
                                onClick={startTimer}
                                disabled={isRunning}
                                className="shadow-xl bg-slate-900 text-white font-bold py-2 px-4 rounded-full mr-2 "
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                                </svg>
                            </button>
                            <button
                                onClick={pauseTimer}
                                disabled={!isRunning}
                                className="shadow-xl bg-slate-900  text-white font-bold py-2 px-4 rounded-full mr-2 "
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                                </svg>
                            </button>
                            <button
                                onClick={completeSession}
                                className="shadow-xl bg-slate-900 text-white font-bold py-2 px-4 rounded-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;