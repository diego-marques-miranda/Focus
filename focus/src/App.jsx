import React, {useEffect, useState} from 'react';

function App() {
    const [hoursStudied, setHoursStudied] = useState(JSON.parse(localStorage.getItem("hoursStudied")) || 0);
    const [minutesStudied, setMinutesStudied] = useState(JSON.parse(localStorage.getItem("minutesStudied")) || 0);
    const [dailyGoalHours, setDailyGoalHours] = useState(4);
    const [dailyGoalMinutes, setDailyGoalMinutes] = useState(0);
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
        localStorage.setItem("remainingHours", JSON.stringify(remainingHours));
        localStorage.setItem("remainingMinutes", JSON.stringify(remainingMinutes));
    }, [hoursStudied, minutesStudied, dailyGoalHours, dailyGoalMinutes, remainingHours, remainingMinutes]);
    
    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 items-center">
            {/* Header */}
            <header className="bg-slate-900 w-full h-[15vh] flex items-center justify-center text-neutral-50 py-4">
                <h1 className="text-6xl font-bold font-serif text-center">FOCUS</h1>
            </header>

            <div className="mt-8 h-48 w-48 rounded-full flex flex-col items-center justify-center shadow-xl border-1 border-neutral-300 bg-neutral-200">
                <p className="text-4xl text-slate-900">{hoursStudied}h{minutesStudied}min</p>
                <p className="text-base text-red-400">{remainingHours}h{remainingMinutes}min remaining</p>
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
    );
}

export default App;