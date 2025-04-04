import React, { useEffect, useState, useRef } from 'react';

function App() {
    const [hoursStudied, setHoursStudied] = useState(JSON.parse(localStorage.getItem("hoursStudied")) || 0);
    const [minutesStudied, setMinutesStudied] = useState(JSON.parse(localStorage.getItem("minutesStudied")) || 0);
    const [dailyGoalHours, setDailyGoalHours] = useState(parseInt(localStorage.getItem("dailyGoalHours")) || 4);
    const [dailyGoalMinutes, setDailyGoalMinutes] = useState(parseInt(localStorage.getItem("dailyGoalMinutes")) || 0);
    const [sessionHours, setSessionHours] = useState(0);
    const [sessionMinutes, setSessionMinutes] = useState(0);

    // Estados para o cronômetro
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalRef = useRef(null);

    const registerSession = () => {
        setHoursStudied(prevHours => prevHours + parseInt(sessionHours));
        setMinutesStudied(prevMinutes => prevMinutes + parseInt(sessionMinutes));
        setSessionHours(0);
        setSessionMinutes(0);
    };

    const totalStudiedMinutes = hoursStudied * 60 + minutesStudied;
    const totalGoalMinutes = dailyGoalHours * 60 + dailyGoalMinutes;
    const remainingTotalMinutes = totalGoalMinutes - totalStudiedMinutes;

    const remainingHours = Math.max(0, Math.floor(remainingTotalMinutes / 60));
    const remainingMinutes = Math.max(0, remainingTotalMinutes % 60);

    useEffect(() => {
        localStorage.setItem("hoursStudied", JSON.stringify(hoursStudied));
        localStorage.setItem("minutesStudied", JSON.stringify(minutesStudied));
        localStorage.setItem("dailyGoalHours", JSON.stringify(dailyGoalHours));
        localStorage.setItem("dailyGoalMinutes", JSON.stringify(dailyGoalMinutes));
    }, [hoursStudied, minutesStudied, dailyGoalHours, dailyGoalMinutes]);

    const formatStudiedTime = () => {
        if (hoursStudied === 0 && minutesStudied > 0) {
            return `${minutesStudied}min`;
        }
        if (minutesStudied === 0) {
            return `${hoursStudied}h`;
        }
        return `${hoursStudied}h${minutesStudied}min`;
    };

    const formatRemainingTime = () => {
        if (remainingHours === 0 && remainingMinutes > 0) {
            return `${remainingMinutes}min remaining`;
        }
        if (remainingMinutes === 0) {
            return `${remainingHours}h remaining`;
        }
        return `${remainingHours}h${remainingMinutes}min remaining`;
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
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        setHoursStudied(prevHours => prevHours + hours);
        setMinutesStudied(prevMinutes => prevMinutes + minutes);
        setElapsedTime(0);
    };

    useEffect(() => {
        return () => clearInterval(intervalRef.current); // Limpar o intervalo quando o componente for desmontado
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 items-center">


            {/* Header */}
            <header className="bg-slate-900 w-full h-[15vh] flex items-center justify-center text-neutral-50 py-4">
                <h1 className="text-6xl font-bold font-serif text-center">FOCUS</h1>
            </header>

            <div className="w-full flex flex-col items-center bg-slate-900 p-8">
                <div className="w-full flex flex-col items-center bg-neutral-50 rounded-2xl h-[78.133vh]">
                    <div className="mt-8 h-[160px] w-[160px] rounded-full flex flex-col items-center justify-center shadow-xl border-1 border-neutral-300 bg-neutral-200">
                        <p className="text-3xl font-bold text-slate-900">{formatStudiedTime()}</p>
                        <p className="text-sm text-red-400">{formatRemainingTime()}</p>
                    </div>

                    <div className="container mx-auto flex justify-center p-4">

                        <div className="m-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Hours:
                            </label>
                            <input
                                type="number"
                                value={sessionHours}
                                onChange={(e) => setSessionHours(parseInt(e.target.value))}
                                className="shadow-xl border border-neutral-200 bg-neutral-100 appearance-none rounded-full w-16 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="m-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Minutes:
                            </label>
                            <input
                                type="number"
                                value={sessionMinutes}
                                onChange={(e) => setSessionMinutes(parseInt(e.target.value))}
                                className="shadow-xl border-neutral-200 bg-neutral-100 appearance-none border rounded-full w-16 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                    </div>

                    <button
                        onClick={registerSession}
                        className="shadow-xl bg-slate-900 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded-full w-1/5"
                    >
                        Add
                    </button>

                    {/* Área do Cronômetro */}
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