import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const ApiKeys = () => {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [generatedKey, setGeneratedKey] = useState(null);
    const [copied, setCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            const response = await api.get('/api-keys');
            setKeys(response.data.data.keys);
        } catch (error) {
            toast.error('Fehler beim Laden der API-Schlüssel');
            console.error('Error fetching API keys:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateKey = async (e) => {
        e.preventDefault();
        if (!newKeyName.trim()) {
            toast.error('Bitte geben Sie einen Namen oder eine Domain ein');
            return;
        }

        try {
            const response = await api.post('/api-keys', { name_or_domain: newKeyName });
            setGeneratedKey(response.data.data.apiKey);
            toast.success('API-Schlüssel erfolgreich erstellt!');
            setNewKeyName(''); // Reset input
            fetchKeys(); // Refresh list to show the new key record
        } catch (error) {
            toast.error(error.response?.data?.message || 'Fehler beim Erstellen des Schlüssels');
            console.error('Error creating API key:', error);
        }
    };

    const handleRevoke = async (id) => {
        if (!window.confirm('Sind Sie sicher, dass Sie diesen Schlüssel widerrufen möchten? Damit verbundene Dienste verlieren den Zugriff.')) {
            return;
        }
        try {
            await api.patch(`/api-keys/${id}/revoke`);
            toast.success('Schlüssel widerrufen');
            fetchKeys();
        } catch (error) {
            toast.error('Fehler beim Widerrufen des Schlüssels');
            console.error('Error revoking API key:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Möchten Sie diesen Schlüssel wirklich endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
            return;
        }
        try {
            await api.delete(`/api-keys/${id}`);
            toast.success('Schlüssel gelöscht');
            fetchKeys();
        } catch (error) {
            toast.error('Fehler beim Löschen des Schlüssels');
            console.error('Error deleting API key:', error);
        }
    };

    const copyToClipboard = () => {
        if (generatedKey) {
            navigator.clipboard.writeText(generatedKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success('Schlüssel in die Zwischenablage kopiert');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setGeneratedKey(null);
        setNewKeyName('');
    }
    
    const displayedKeys = (Array.isArray(keys) ? keys : []).filter(k => {
        if (searchQuery.trim() !== '') {
            const lowerQuery = searchQuery.toLowerCase();
            return k.name_or_domain && k.name_or_domain.toLowerCase().includes(lowerQuery);
        }
        return true;
    });

    return (
        <div className="animate-[fadeIn_0.4s_ease-out_forwards] p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">API-Schlüssel</h2>
                    <p className="text-gray-400 text-sm mt-1">Verwalten Sie hier Zugriffsschlüssel für externe Websites.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder="Suchen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors w-full md:w-64"
                        />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2 text-sm whitespace-nowrap">
                        <i className="fa-solid fa-plus"></i> Neuer API-Schlüssel
                    </button>
                </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="p-4 text-gray-200">Name / Domain</th>
                                <th className="p-4 text-gray-200">Status</th>
                                <th className="p-4 text-gray-200">Erstellt am</th>
                                <th className="p-4 text-gray-200">Zuletzt verwendet</th>
                                <th className="p-4 text-right text-gray-200">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-400">Wird geladen...</td>
                                </tr>
                            ) : displayedKeys.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-400">Keine API-Schlüssel gefunden.</td>
                                </tr>
                            ) : (
                                displayedKeys.map((k) => (
                                    <tr key={k.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-semibold text-white">
                                            {k.name_or_domain}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5 w-max ${k.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                <span className={`w-1.5 h-1.5 gap-2 rounded-full ${k.is_active ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                                {k.is_active ? 'Aktiv' : 'Widerrufen'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-300">
                                            {new Date(k.createdAt).toLocaleDateString('de-DE')}
                                        </td>
                                        <td className="p-4 text-gray-300">
                                            {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString('de-DE') : 'Nie'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {k.is_active && (
                                                    <button
                                                        onClick={() => handleRevoke(k.id)}
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
                                                        title="Schlüssel widerrufen"
                                                    >
                                                        <i className="fa-solid fa-ban"></i>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(k.id)}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                                    title="Löschen"
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Creating API Key */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 overflow-y-auto">
                    <div className="glass-card w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl animate-[slideUp_0.3s_ease-out] my-8">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400">
                                    <i className="fa-solid fa-key"></i>
                                </div>
                                {generatedKey ? 'Ihr neuer API-Schlüssel' : 'API-Schlüssel erstellen'}
                            </h2>
                            {generatedKey && (
                                <button type="button" onClick={closeModal} className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10">
                                     <i className="fa-solid fa-xmark"></i>
                                </button>
                            )}
                        </div>

                        {!generatedKey ? (
                            <form onSubmit={handleCreateKey} className="p-6">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-200 mb-1">
                                        Name / Domain *
                                    </label>
                                    <p className="text-xs text-gray-400 mb-2">Beispiel: ep-construction.de</p>
                                    <input
                                        type="text"
                                        required
                                        value={newKeyName}
                                        onChange={(e) => setNewKeyName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                                        placeholder="Name eingeben..."
                                        autoFocus
                                    />
                                </div>
                                
                                <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                                    >
                                        Abbrechen
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-[0_4px_15px_rgba(37,99,235,0.3)]"
                                    >
                                        Generieren
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="p-6 space-y-6">
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                    <p className="text-sm text-yellow-300 font-medium flex gap-3">
                                        <i className="fa-solid fa-circle-exclamation text-yellow-500 mt-1"></i>
                                        <span>
                                            <strong className="block mb-1 text-yellow-400">Achtung!</strong>
                                            Bitte kopieren Sie diesen Schlüssel sofort. Aus Sicherheitsgründen wird er Ihnen <strong>nie wieder</strong> angezeigt.
                                        </span>
                                    </p>
                                </div>
                                
                                <div className="relative group">
                                    <div className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-4 py-4 text-blue-400 font-mono text-sm break-all pr-14 shadow-[0_0_15px_rgba(59,130,246,0.1)] selection:bg-blue-500/30">
                                        {generatedKey}
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex flex-col items-center justify-center text-gray-400 hover:text-white bg-white/5 hover:bg-blue-500/20 rounded-lg transition-all border border-transparent hover:border-blue-500/50"
                                        title="Kopieren"
                                    >
                                        {copied ? <i className="fa-solid fa-check text-green-400"></i> : <i className="fa-regular fa-copy"></i>}
                                    </button>
                                </div>
                                
                                <div className="pt-2 border-t border-white/10">
                                    <button
                                        onClick={closeModal}
                                        className="w-full px-6 py-2.5 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <i className="fa-solid fa-check"></i>
                                        Ich habe den Schlüssel gespeichert
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiKeys;
