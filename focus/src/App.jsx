import React, { useState } from 'react';

function App() {
    const [hoursStudied, setHoursStudied] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(4);
    const [sessionHours, setSessionHours] = useState(0);
    const [sessionMinutes, setSessionMinutes] = useState(0);

    const registerSession = () => {
        const totalHours = sessionHours + sessionMinutes / 60;
        setHoursStudied(hoursStudied + totalHours);
        setSessionHours(0);
        setSessionMinutes(0);
    };

    const remainingHours = dailyGoal - hoursStudied;

    return (
        <div className="min-h-screen flex flex-col items-center">
            {/* Header */}
            <header className="bg-slate-900 w-full text-white py-4">
                <h1 className="text-6xl font-bold font-serif text-center">FOCUS</h1>
            </header>

            {/* Conteúdo Principal */}
            <div className="container mx-auto flex justify-center p-4">
                
                    <div className="m-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Hours:
                        </label>
                        <input
                            type="number"
                            value={sessionHours}
                            onChange={(e) => setSessionHours(parseInt(e.target.value))}
                            className="shadow-xl border border-slate-300 bg-neutral-100 appearance-none rounded-full w-16 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                            className="shadow-xl border-slate-300 bg-neutral-100 appearance-none border rounded-full w-16 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                
            </div>

            <button
                onClick={registerSession}
                className="bg-blue-500 shadow-xl hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-1/5"
            >
                Add
            </button>
            <div className="mt-4">
                <p>Horas Estudadas: {hoursStudied.toFixed(2)}</p>
                <p>Horas Restantes: {remainingHours.toFixed(2)}</p>
            </div>
        </div>
    );
}

export default App;