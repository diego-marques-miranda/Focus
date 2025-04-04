import React, { useEffect, useState } from 'react';

function App() {
    const [hoursStudied, setHoursStudied] = useState(JSON.parse(localStorage.getItem("hoursStudied")) || 0);
    const [minutesStudied, setMinutesStudied] = useState(JSON.parse(localStorage.getItem("minutesStudied")) || 0);
    const [dailyGoalHours, setDailyGoalHours] = useState(parseInt(localStorage.getItem("dailyGoalHours")) || 4);
    const [dailyGoalMinutes, setDailyGoalMinutes] = useState(parseInt(localStorage.getItem("dailyGoalMinutes")) || 0);
    const [sessionHours, setSessionHours] = useState(0);
    const [sessionMinutes, setSessionMinutes] = useState(0);

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

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 items-center">
            
            
            {/* Header */}
            <header className="bg-slate-900 w-full h-[15vh] flex items-center justify-center text-neutral-50 py-4">
                <h1 className="text-6xl font-bold font-serif text-center">FOCUS</h1>
            </header>
            
            <div className="w-full flex flex-col items-center bg-slate-900 p-8">
                <div className="w-full flex flex-col items-center bg-neutral-50 pt-4 rounded-2xl h-[78.133vh]">
                    <div className="mt-8 h-48 w-48 rounded-full flex flex-col items-center justify-center shadow-xl border-1 border-neutral-300 bg-neutral-200">
                        <p className="text-4xl font-bold text-slate-900">{formatStudiedTime()}</p>
                        <p className="text-base text-red-400">{formatRemainingTime()}</p>
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
                </div>
            </div>
            
            

        </div>
    );
}

export default App;