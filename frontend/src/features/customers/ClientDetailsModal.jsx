import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ClientDetailsModal = ({ clientId, email, onClose }) => {
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                setLoading(true);
                setError(null);
                setClient(null); // Clear previous client data

                let foundClient = null;

                // 1. Try fetching by ID if available
                if (clientId) {
                    try {
                        const res = await api.get(`/clients/${clientId}`);
                        foundClient = res.data.data.client;
                    } catch (idErr) {
                        console.log('Fetch by ID failed, trying email fallback...', idErr);
                        // Do not set error here, as we have a fallback
                    }
                }

                // 2. Fallback to searching by email if ID failed or is missing and email is provided
                if (!foundClient && email) {
                    try {
                        const res = await api.get(`/clients/check-email?email=${encodeURIComponent(email)}`);
                        if (res.data.data.exists) {
                            foundClient = res.data.data.client;
                        }
                    } catch (emailErr) {
                        console.error('Fetch by email failed:', emailErr);
                        // If email fetch also fails, then we set a general error
                    }
                }

                if (foundClient) {
                    setClient(foundClient);
                } else {
                    setError('Klient konnte nicht gefunden werden.');
                }
            } catch (err) {
                console.error('Error fetching client details:', err);
                setError('Fehler beim Laden der Klientendaten.');
            } finally {
                setLoading(false);
            }
        };

        if (clientId || email) {
            fetchClient();
        } else {
            // If neither clientId nor email is provided, ensure loading is false and client is null
            setLoading(false);
            setClient(null);
            setError('Keine Klienten-ID oder E-Mail zum Suchen angegeben.');
        }
    }, [clientId, email]);

    if (!clientId && !email) return null; // Only render if we have something to search for

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-blue-500/10">
                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-white">Klientenprofil</h3>
                        <p className="text-gray-400 text-sm">Detaillierte Informationen zum Kunden</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <i className="fa-solid fa-circle-notch animate-spin text-3xl mb-4 text-blue-500"></i>
                            <p className="text-white">Lade Klientendaten...</p>
                        </div>
                    ) : client ? (
                        <div className="space-y-8 animate-[slideUp_0.4s_ease-out]">
                            {/* Profile Header */}
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/20 capitalize">
                                    {client.name[0]}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-white mb-1">{client.name}</h4>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                            client.client_type === 'corporate' 
                                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                                            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                        }`}>
                                            {client.client_type === 'corporate' ? 'Unternehmen' : 'Privatperson'}
                                        </span>
                                        <span className="text-gray-500 text-xs flex items-center gap-1">
                                            <i className="fa-solid fa-calendar-days"></i> Registriert am {new Date(client.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-3 text-blue-400">
                                        <i className="fa-solid fa-envelope"></i>
                                        <span className="text-xs font-bold uppercase tracking-wider">E-Mail</span>
                                    </div>
                                    <p className="text-white font-semibold">{client.email || 'N/A'}</p>
                                </div>

                                <div className="glass-card p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-3 text-green-400">
                                        <i className="fa-solid fa-phone"></i>
                                        <span className="text-xs font-bold uppercase tracking-wider">Telefon</span>
                                    </div>
                                    <p className="text-white font-semibold">{client.phone || 'N/A'}</p>
                                </div>

                                <div className="glass-card p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-3 text-purple-400">
                                        <i className="fa-solid fa-building"></i>
                                        <span className="text-xs font-bold uppercase tracking-wider">Unternehmen</span>
                                    </div>
                                    <p className="text-white font-semibold">{client.company_name || 'Einzelkunde'}</p>
                                </div>

                                <div className="glass-card p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-3 text-orange-400">
                                        <i className="fa-solid fa-location-dot"></i>
                                        <span className="text-xs font-bold uppercase tracking-wider">Standort</span>
                                    </div>
                                    <p className="text-white font-semibold">{client.address || 'Keine Adresse hinterlegt'}</p>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                                <h5 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Statistik & Quelle</h5>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-500 uppercase mb-1">Status</p>
                                        <p className="text-sm font-bold text-white capitalize">{client.status || 'Aktiv'}</p>
                                    </div>
                                    <div className="text-center border-l border-white/10">
                                        <p className="text-[10px] text-gray-500 uppercase mb-1">Quelle</p>
                                        <p className="text-sm font-bold text-white">{client.source || 'Manuell'}</p>
                                    </div>
                                    <div className="text-center border-l border-white/10">
                                        <p className="text-[10px] text-gray-500 uppercase mb-1">ID</p>
                                        <p className="text-sm font-bold text-gray-400">#CL-{client.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500 italic">
                            Klient konnte nicht gefunden werden.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-white/5 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all"
                    >
                        Schließen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientDetailsModal;
