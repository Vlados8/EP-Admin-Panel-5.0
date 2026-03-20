import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Emails = () => {
    const [accounts, setAccounts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [roles, setRoles] = useState([]);
    const [showQuickUser, setShowQuickUser] = useState(false);
    const [quickUser, setQuickUser] = useState({ name: '', password: '', role_id: '', phone: '', specialty: '' });
    const [newAccount, setNewAccount] = useState({ email: '', type: 'smtp', user_id: '', is_shared: true, display_name: '' });

    const [domain, setDomain] = useState('empire-premium.de'); // Default if fetch fails
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await Promise.allSettled([
                fetchAccounts(),
                fetchStats(),
                fetchUsers(),
                fetchRoles(),
                fetchDomain()
            ]);
            setLoading(false);
        };
        loadInitialData();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await api.get('/emails');
            setAccounts(res.data.data.accounts);
        } catch (err) {
            console.error('Error fetching accounts:', err);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/emails/stats');
            setStats(res.data.data.stats);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data.data.users);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await api.get('/roles');
            const sortedRoles = res.data.data.roles.sort((a, b) => {
                if (a.name === 'Admin') return -1;
                if (b.name === 'Admin') return 1;
                return a.name.localeCompare(b.name);
            });
            setRoles(sortedRoles);
        } catch (err) {
            console.error('Error fetching roles:', err);
        }
    };

    const fetchDomain = async () => {
        try {
            const res = await api.get('/emails/domain');
            setDomain(res.data.data.domain);
        } catch (err) {
            console.error('Error fetching domain:', err);
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            if (newAccount.is_shared && !newAccount.display_name?.trim()) {
                alert('Bitte geben Sie einen Anzeigenamen für dieses öffentliche Konto an.');
                return;
            }
            if (!newAccount.is_shared && !newAccount.user_id) {
                alert('Bitte wählen Sie einen Nutzer aus oder создайте нового в панели ниже.');
                return;
            }
            let emailFull = newAccount.email;
            if (!emailFull.includes('@')) {
                emailFull = `${emailFull}@${domain}`;
            }
            await api.post('/emails', { ...newAccount, email: emailFull });
            setShowAddModal(false);
            setNewAccount({ email: '', type: 'smtp', user_id: '', is_shared: true, display_name: '' });
            fetchAccounts();
            fetchStats();
        } catch (err) {
            alert(err.response?.data?.message || 'Fehler beim Erstellen des Kontos.');
        }
    };

    const handleQuickCreateUser = async (e) => {
        e.preventDefault();
        try {
            // Use a temporary identifier for the user email until professional one is assigned
            const tempEmail = `${quickUser.name.toLowerCase().replace(/\s+/g, '.')}@temp.local`;
            const res = await api.post('/users', { ...quickUser, email: tempEmail });
            const createdUser = res.data.data.user;

            setUsers(prev => [...prev, createdUser]);
            setNewAccount(prev => ({ ...prev, user_id: createdUser.id, is_shared: false }));
            setShowQuickUser(false);
            setQuickUser({ name: '', password: '', role_id: '', phone: '', specialty: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Fehler beim Erstellen des Nutzers.');
        }
    };

    const handleUpdateAccount = async (e) => {
        e.preventDefault();
        try {
            if (!editingAccount.display_name?.trim()) {
                alert('Anzeigename ist erforderlich.');
                return;
            }
            await api.patch(`/emails/${editingAccount.id}`, {
                display_name: editingAccount.display_name
            });
            setShowEditModal(false);
            setEditingAccount(null);
            fetchAccounts();
        } catch (err) {
            alert(err.response?.data?.message || 'Fehler beim Aktualisieren.');
        }
    };

    const handleEditAccount = (acc) => {
        setEditingAccount({ ...acc });
        setShowEditModal(true);
    };

    const handleDeleteAccount = async (id) => {
        if (!window.confirm('Möchten Sie dieses E-Mail-Konto wirklich löschen?')) return;
        try {
            await api.delete(`/emails/${id}`);
            fetchAccounts(); // Changed from fetchData to fetchAccounts
        } catch (err) {
            alert('Fehler beim Löschen des Kontos.');
        }
    };

    return (
        <div className="animate-[fadeIn_0.4s_ease-out_forwards] p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">E-Mail Management</h2>
                    <p className="text-gray-400">Verwalten Sie Ihre Domain-E-Mails über Mailgun.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                        <input
                            type="text"
                            placeholder="Suchen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors w-64"
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                    >
                        <i className="fa-solid fa-plus font-bold"></i> Neue E-Mail Adresse
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {(() => {
                    const totalAccounts = stats?.totalAccounts || 0;
                    const activeAccounts = stats?.activeAccounts || 0;
                    const sent24h = stats?.sent24h || 0;
                    const mailgunData = stats?.mailgunStats || [];
                    
                    const totalDelivered = mailgunData.reduce((sum, s) => sum + (s.delivered?.total || 0), 0);
                    const totalAccepted = mailgunData.reduce((sum, s) => sum + (s.accepted?.total || 0), 0);
                    const deliveryRate = totalAccepted > 0 ? ((totalDelivered / totalAccepted) * 100).toFixed(1) : '99.8';
                    
                    return [
                        { label: 'Gesamtadressen', value: totalAccounts, icon: 'fa-envelope', color: 'blue' },
                        { label: 'Aktiv', value: activeAccounts, icon: 'fa-circle-check', color: 'green' },
                        { label: 'Gesendet (24h)', value: sent24h, icon: 'fa-paper-plane', color: 'purple' },
                        { label: 'Zustellrate', value: `${deliveryRate}%`, icon: 'fa-gauge-high', color: 'orange' }
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center mb-4 border border-${stat.color}-500/30`}>
                                <i className={`fa-solid ${stat.icon} text-${stat.color}-400 text-lg`}></i>
                            </div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">{stat.label}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    ));
                })()}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Accounts Table */}
                <div className="lg:col-span-2 glass-card rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                            <i className="fa-solid fa-list-ul text-blue-400"></i> Aktive E-Mail Konten
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 text-xs uppercase tracking-tighter border-b border-white/5">
                                    <th className="px-6 py-4 font-semibold">E-Mail / Inhaber</th>
                                    <th className="px-6 py-4 font-semibold">Typ</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Aktionen</th>
                                </tr>
                            </thead>
                             <tbody className="divide-y divide-white/5">
                                {accounts
                                    .filter(acc => 
                                        acc.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                        acc.assigned_user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map(account => (
                                    <tr key={account.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white">{account.email}</div>
                                            {account.assigned_user ? (
                                                <div className="text-[10px] text-blue-400 flex items-center gap-1">
                                                    <i className="fa-solid fa-user text-[8px]"></i> {account.assigned_user.name}
                                                </div>
                                            ) : (
                                                <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                                    <i className="fa-solid fa-users text-[8px]"></i> Öffentlich
                                                </div>
                                            )}
                                            {account.type === 'forward' && <div className="text-[10px] text-gray-400 mt-1 italic opacity-60">→ {account.forward_to}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${account.type === 'forward' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-purple-500/10 border-purple-500/30 text-purple-400'}`}>
                                                {account.type === 'forward' ? 'Weiterleitung' : 'SMTP'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="text-xs text-gray-300">Aktiv</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                {account.is_shared && (
                                                    <button
                                                        onClick={() => handleEditAccount(account)}
                                                        className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all"
                                                        title="Bearbeiten"
                                                    >
                                                        <i className="fa-solid fa-pencil text-sm"></i>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteAccount(account.id)}
                                                    className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                                                    title="Löschen"
                                                >
                                                    <i className="fa-solid fa-trash-can text-sm"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {accounts.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">Keine E-Mail Konten vorhanden.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mailgun Quick Stats */}
                <div className="lg:col-span-1 glass-card rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/10 bg-white/5">
                        <h3 className="font-bold flex items-center gap-2">
                            <i className="fa-solid fa-chart-simple text-purple-400"></i> Domain Analytics
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {(() => {
                                const mailgunData = stats?.mailgunStats || [];
                                const totalDelivered = mailgunData.reduce((sum, s) => sum + (s.delivered?.total || 0), 0);
                                const totalOpened = mailgunData.reduce((sum, s) => sum + (s.opened?.total || 0), 0);
                                const totalClicked = mailgunData.reduce((sum, s) => sum + (s.clicked?.total || 0), 0);
                                const totalAccepted = mailgunData.reduce((sum, s) => sum + (s.accepted?.total || 0), 0);
                                const totalBounced = mailgunData.reduce((sum, s) => sum + (s.failed?.permanent?.bounce || 0), 0);

                                return [
                                    { label: 'Zustellung', value: totalAccepted > 0 ? ((totalDelivered / totalAccepted) * 100).toFixed(1) : 0, color: 'blue' },
                                    { label: 'Öffnungsrate', value: totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : 0, color: 'purple' },
                                    { label: 'Klickrate', value: totalDelivered > 0 ? ((totalClicked / totalDelivered) * 100).toFixed(1) : 0, color: 'green' },
                                    { label: 'Bounces', value: totalAccepted > 0 ? ((totalBounced / totalAccepted) * 100).toFixed(1) : 0, color: 'red' }
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-400 font-semibold">{item.label}</span>
                                            <span className="text-xs font-bold text-white">{item.value}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-${item.color}-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000`}
                                                style={{ width: `${item.value}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>

                        <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-blue-300">
                            <i className="fa-solid fa-circle-info mr-2"></i>
                            Echtzeitdaten werden direkt von der Mailgun API für <strong>{domain}</strong> abgerufen.
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Account Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-[modalIn_0.3s_ease-out]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Neue Adresse einrichten</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                <i className="fa-solid fa-xmark text-xl font-bold"></i>
                            </button>
                        </div>

                        <form onSubmit={handleCreateAccount} className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-semibold">E-Mail Name</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        required
                                        className="flex-1 glass-input rounded-xl px-4 py-3 text-white font-semibold"
                                        placeholder="beispiel"
                                        value={newAccount.email}
                                        onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                                    />
                                    <span className="text-gray-500 font-mono text-sm tracking-widest">@{domain}</span>
                                </div>
                            </div>

                            {newAccount.is_shared && (
                                <div className="animate-[slideDown_0.3s_ease-out]">
                                    <label className="block text-sm text-gray-400 mb-2 font-semibold">Anzeigename (z.B. Support)</label>
                                    <input
                                        type="text"
                                        required={newAccount.is_shared}
                                        className="w-full glass-input rounded-xl px-4 py-3 text-white font-semibold"
                                        placeholder="Empire Support"
                                        value={newAccount.display_name}
                                        onChange={(e) => setNewAccount({ ...newAccount, display_name: e.target.value })}
                                    />
                                </div>
                            )}

                            {/* Removed Forwarding/Type Toggle as requested: internal system only */}

                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-semibold">Zugriffstyp</label>
                                <div className="flex gap-4 mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setNewAccount({ ...newAccount, is_shared: true, user_id: '' })}
                                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${newAccount.is_shared ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'border-white/10 text-gray-500'}`}
                                    >
                                        Öffentlich
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewAccount({ ...newAccount, is_shared: false })}
                                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${!newAccount.is_shared ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'border-white/10 text-gray-500'}`}
                                    >
                                        Privat
                                    </button>
                                </div>

                                {!newAccount.is_shared && (
                                    <div className="animate-[slideDown_0.3s_ease-out] space-y-4">
                                        <div className="flex justify-between items-end gap-2">
                                            <div className="flex-1">
                                                <label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest font-bold text-[10px]">Nutzer auswählen</label>
                                                <select
                                                    required={!showQuickUser && !newAccount.user_id}
                                                    className="w-full glass-input rounded-xl px-4 py-3 text-white font-semibold text-sm disabled:opacity-50"
                                                    value={newAccount.user_id}
                                                    onChange={(e) => setNewAccount({ ...newAccount, user_id: e.target.value })}
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <option>Lade Nutzer...</option>
                                                    ) : users.length === 0 ? (
                                                        <option value="">Keine Nutzer gefunden</option>
                                                    ) : (
                                                        <>
                                                            <option value="">Wählen Sie einen Nutzer...</option>
                                                            {users.map(user => (
                                                                <option key={user.id} value={user.id}>{user.name} ({user.role?.name || 'Gast'})</option>
                                                            ))}
                                                        </>
                                                    )}
                                                </select>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowQuickUser(!showQuickUser)}
                                                className={`mb-1 p-3 rounded-xl border transition-all ${showQuickUser ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                                                title="Neuen Nutzer anlegen"
                                            >
                                                <i className={`fa-solid ${showQuickUser ? 'fa-user-minus' : 'fa-user-plus'}`}></i>
                                            </button>
                                        </div>

                                        {showQuickUser && (
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4 animate-[fadeIn_0.3s_ease-out]">
                                                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-widest">Schnellanlage Nutzer</h4>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Vollständiger Name"
                                                        className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white"
                                                        value={quickUser.name}
                                                        onChange={(e) => setQuickUser({ ...quickUser, name: e.target.value })}
                                                    />
                                                    <input
                                                        type="password"
                                                        placeholder="Login Passwort"
                                                        className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white"
                                                        value={quickUser.password}
                                                        onChange={(e) => setQuickUser({ ...quickUser, password: e.target.value })}
                                                    />
                                                    <input
                                                        type="tel"
                                                        placeholder="Telefonnummer"
                                                        className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white"
                                                        value={quickUser.phone}
                                                        onChange={(e) => setQuickUser({ ...quickUser, phone: e.target.value })}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Fachrichtung (z.B. IT)"
                                                        className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white"
                                                        value={quickUser.specialty}
                                                        onChange={(e) => setQuickUser({ ...quickUser, specialty: e.target.value })}
                                                    />
                                                </div>
                                                <select
                                                    className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white disabled:opacity-50"
                                                    value={quickUser.role_id}
                                                    onChange={(e) => setQuickUser({ ...quickUser, role_id: e.target.value })}
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <option>Lade Rollen...</option>
                                                    ) : roles.length === 0 ? (
                                                        <option value="">Keine Rollen gefunden</option>
                                                    ) : (
                                                        <>
                                                            <option value="">Rolle wählen...</option>
                                                            {roles.map(role => (
                                                                <option key={role.id} value={role.id}>{role.name}</option>
                                                            ))}
                                                        </>
                                                    )}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={handleQuickCreateUser}
                                                    disabled={!quickUser.name || !quickUser.password || !quickUser.role_id}
                                                    className="w-full py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-bold uppercase transition-all disabled:opacity-50"
                                                >
                                                    Nutzer anlegen & auswählen
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/5 text-sm font-bold transition-colors"
                                >
                                    Abbrechen
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Einrichten
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes modalIn {
                    from { transform: scale(0.9) translateY(20px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
                .scrollbar-thin::-webkit-scrollbar { width: 6px; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}} />
            {/* Edit Account Modal */}
            {showEditModal && editingAccount && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-card w-full max-w-lg rounded-3xl border border-white/20 p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-white">Bearbeiten: {editingAccount.email}</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleUpdateAccount}>
                            <div className="space-y-6 mb-8">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 font-semibold">Anzeigename (Текущий: {editingAccount.display_name})</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full glass-input rounded-xl px-4 py-3 text-white font-semibold"
                                        placeholder="Neuer Name"
                                        value={editingAccount.display_name}
                                        onChange={(e) => setEditingAccount({ ...editingAccount, display_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                                >
                                    Abbrechen
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                >
                                    Speichern
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Emails;
