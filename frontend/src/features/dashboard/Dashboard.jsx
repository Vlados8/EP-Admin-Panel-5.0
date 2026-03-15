import React from 'react';

const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="glass-card p-6 rounded-2xl">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-300 text-sm">{title}</p>
                <h3 className="text-3xl font-bold mt-1">{value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                <i className={`fa-solid ${icon}`}></i>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <div className="animate-[fadeIn_0.4s_ease-out_forwards]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Aktive Projekte"
                    value="12"
                    icon="fa-building"
                    colorClass="bg-blue-500/20 text-blue-400"
                />
                <StatCard
                    title="Offene Aufgaben"
                    value="34"
                    icon="fa-list-check"
                    colorClass="bg-orange-500/20 text-orange-400"
                />
                <StatCard
                    title="Neue Anfragen"
                    value="7"
                    icon="fa-inbox"
                    colorClass="bg-green-500/20 text-green-400"
                />
                <StatCard
                    title="Mitarbeiter Online"
                    value="28"
                    icon="fa-users"
                    colorClass="bg-purple-500/20 text-purple-400"
                />
            </div>
            <div className="glass-card p-6 rounded-2xl h-64 flex items-center justify-center">
                <p className="text-gray-400">
                    <i className="fa-solid fa-chart-line mr-2"></i> Hier könnte ein Diagramm stehen
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
