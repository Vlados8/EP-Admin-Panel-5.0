const Placeholder = ({ title }) => {
    return (
        <div className="flex-1 flex items-center justify-center h-full">
            <div className="glass-card p-10 rounded-2xl text-center max-w-md w-full">
                <i className="fa-solid fa-person-digging text-6xl text-blue-400 mb-6 block"></i>
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-gray-400">Dieses Modul befindet sich noch im Aufbau.</p>
                <button className="mt-6 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-6 py-2 rounded-xl text-sm hover:bg-blue-500/30 transition-colors">
                    Zurück zum Dashboard
                </button>
            </div>
        </div>
    );
};

export default Placeholder;
