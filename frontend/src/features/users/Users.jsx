import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';

const Users = () => {
    const { user: currentUser } = useSelector(state => state.auth);
    const canManageUsers = currentUser?.role === 'Admin' || currentUser?.role === 'Büro';

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [filterRole, setFilterRole] = useState('Alle');
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role_id: '',
        manager_id: '',
        status: 'active',
        specialty: ''
    });

    const resetForm = () => {
        setFormData({ name: '', email: '', phone: '', password: '', role_id: '', manager_id: '', status: 'active', specialty: '' });
        setEditUserId(null);
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/users');
            setUsers(res.data.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await api.get('/roles');
            // Ensure Admin is first, then Sort
            const sortedRoles = res.data.data.roles.sort((a, b) => {
                if (a.name === 'Admin') return -1;
                if (b.name === 'Admin') return 1;
                return a.name.localeCompare(b.name);
            });
            setRoles(sortedRoles);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleFilter = (roleName) => {
        setFilterRole(roleName);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            // TODO: In production company_id should be handled securely
            // For now, attaching the company of the first user
            const company_id = users[0]?.company?.id;

            await api.post('/users', {
                ...formData,
                company_id
            });
            setIsAddModalOpen(false);
            resetForm();
            fetchUsers(); // Refresh
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Fehler beim Erstellen des Benutzers');
        }
    };

    const handleEditClick = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            password: '', // Leave empty unless changing
            role_id: user.role?.id || '',
            manager_id: user.manager?.id || '',
            status: user.status || 'active',
            specialty: user.specialty || ''
        });
        setEditUserId(user.id);
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role_id: formData.role_id,
                manager_id: formData.manager_id,
                status: formData.status,
                specialty: formData.specialty
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            await api.patch(`/users/${editUserId}`, payload);
            setIsEditModalOpen(false);
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Fehler beim Aktualisieren des Benutzers');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Wollen Sie diesen Benutzer wirklich löschen?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Fehler beim Löschen');
            }
        }
    }

    const filteredUsers = users.filter(u => {
        const matchesRole = filterRole === 'Alle' || u.role?.name === filterRole;
        const query = searchQuery.toLowerCase();
        const matchesSearch = !query ||
            u.name.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            (u.phone && u.phone.toLowerCase().includes(query));
        return matchesRole && matchesSearch;
    });

    // Compute available managers based on selected role
    const getAvailableManagers = () => {
        const selectedRoleObj = roles.find(r => r.id === formData.role_id);
        if (!selectedRoleObj) return [];

        if (selectedRoleObj.name === 'Worker') {
            return users.filter(u => u.role?.name === 'Gruppenleiter' || u.role?.name === 'Projektleiter');
        } else if (selectedRoleObj.name === 'Gruppenleiter') {
            return users.filter(u => u.role?.name === 'Projektleiter');
        }
        return []; // Admin, Büro, or Projektleiter usually report strictly to the top
    };

    const availableManagers = getAvailableManagers();

    return (
        <div className="animate-[fadeIn_0.4s_ease-out_forwards]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold mb-1">Benutzerverwaltung</h2>
                    <p className="text-gray-400 text-sm">
                        Hierarchie: Worker <i className="fa-solid fa-arrow-right text-xs mx-1"></i> Gruppenleiter
                        <i className="fa-solid fa-arrow-right text-xs mx-1"></i> Projektleiter
                        <i className="fa-solid fa-arrow-right text-xs mx-1"></i> Büro / Admin
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                        <input
                            type="text"
                            placeholder="Benutzer suchen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors w-64 shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
                        />
                    </div>
                    {canManageUsers && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm transition-colors shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        >
                            <i className="fa-solid fa-user-plus mr-2"></i>Benutzer anlegen
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
                <div
                    onClick={() => handleFilter('Alle')}
                    className={`glass-card p-2 rounded-lg text-sm text-center cursor-pointer transition-colors ${filterRole === 'Alle' ? 'bg-white/20 border-blue-400/50 border' : 'hover:bg-white/20'}`}
                >Alle</div>
                {['Admin', 'Büro', 'Projektleiter', 'Gruppenleiter', 'Worker'].map(role => (
                    <div
                        key={role}
                        onClick={() => handleFilter(role)}
                        className={`glass-card p-2 rounded-lg text-sm text-center cursor-pointer transition-colors ${filterRole === role ? 'bg-white/20 border-blue-400/50 border' : 'hover:bg-white/20'}`}
                    >{role}</div>
                ))}
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="p-4 rounded-tl-2xl">Mitarbeiter</th>
                            <th className="p-4">Rolle</th>
                            <th className="p-4 flex gap-2 items-center"><i className="fa-solid fa-sitemap text-gray-400"></i> Vorgesetzter</th>
                            <th className="p-4">Kontakt</th>
                            <th className="p-4">Telefon</th>
                            <th className="p-4">Status</th>
                            {canManageUsers && <th className="p-4 text-right rounded-tr-2xl">Aktionen</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr><td colSpan={canManageUsers ? "7" : "6"} className="p-8 text-center text-gray-400">Lädt...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan={canManageUsers ? "7" : "6"} className="p-8 text-center text-gray-400">Keine Benutzer gefunden</td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600/50 to-purple-600/50 p-[2px]">
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1a1a1a&color=fff`} className="w-full h-full rounded-full border border-white/10" alt="avatar" />
                                        </div>
                                        <div>
                                            <div className="font-medium flex items-center gap-2">
                                                {user.name}
                                                {user.specialty && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-normal">
                                                        {user.specialty}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400">{user.company?.name}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded text-xs border ${user.role?.name === 'Admin' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                                            user.role?.name === 'Büro' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                                                user.role?.name === 'Projektleiter' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                                                    user.role?.name === 'Gruppenleiter' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                                                        'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                            }`}>
                                            {user.role ? user.role.name : 'Unassigned'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {user.manager ? (
                                            <div className="flex items-center gap-2 text-gray-300 bg-white/5 px-2 py-1 rounded-lg w-fit">
                                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.manager.name)}&size=24&background=222&color=aaa`} className="rounded-full" alt="manager" />
                                                {user.manager.name}
                                            </div>
                                        ) : <span className="text-gray-500 text-xs italic">-</span>}
                                    </td>
                                    <td className="p-4 text-gray-300"><i className="fa-regular fa-envelope mr-2 text-gray-500"></i>{user.email}</td>
                                    <td className="p-4 text-gray-300">
                                        {user.phone ? <><i className="fa-solid fa-phone mr-2 text-gray-500 text-xs"></i>{user.phone}</> : <span className="text-gray-500 italic">-</span>}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${user.status === 'active' ? 'bg-green-500 text-green-500' : 'bg-red-500 text-red-500'}`}></span>
                                            <span className={user.status === 'active' ? 'text-green-400' : 'text-red-400'}>{user.status === 'active' ? 'Aktiv' : 'Inaktiv'}</span>
                                        </div>
                                    </td>
                                    {canManageUsers && (
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="text-blue-400/80 hover:text-blue-400 hover:bg-blue-400/10 p-2 rounded transition-all opacity-0 group-hover:opacity-100 mr-2"
                                            >
                                                <i className="fa-solid fa-pen"></i>
                                            </button>
                                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-400/50 hover:text-red-400 hover:bg-red-400/10 p-2 rounded transition-all opacity-0 group-hover:opacity-100">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
                    <div className="glass-card w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl animate-[slideUp_0.3s_ease-out]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                                <i className="fa-solid fa-user-plus text-blue-400"></i> Neuer Mitarbeiter
                            </h2>
                            <button onClick={() => { setIsAddModalOpen(false); resetForm(); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 pl-1">Name</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="z.B. Max Mustermann"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 pl-1">E-Mail</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="max@beispiel.de"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 pl-1">Telefonnummer <span className="text-gray-500 text-[10px]">(Optional)</span></label>
                                <div className="relative">
                                    <i className="fa-solid fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="+49 123 456789"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Passwort</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">System-Rolle</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-id-badge absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                        <select
                                            required
                                            value={formData.role_id}
                                            onChange={(e) => setFormData({ ...formData, role_id: e.target.value, manager_id: '' })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none [&>option]:bg-gray-900"
                                        >
                                            <option value="" disabled>Bitte wählen...</option>
                                            {roles.map(r => (
                                                <option key={r.id} value={r.id}>{r.name}</option>
                                            ))}
                                        </select>
                                        <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs"></i>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Fachrichtung (Specialty)</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-briefcase absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                        <input
                                            type="text"
                                            value={formData.specialty}
                                            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            placeholder="z.B. Elektriker"
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Manager Selector based on Hierarchy */}
                                {availableManagers.length > 0 && (
                                    <div className="col-span-2 animate-[fadeIn_0.3s_ease-out]">
                                        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                                            Zuständiger Vorgesetzter
                                        </label>
                                        <div className="relative">
                                            <i className="fa-solid fa-sitemap absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"></i>
                                            <select
                                                required
                                                value={formData.manager_id}
                                                onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
                                                className="w-full bg-blue-500/10 border border-blue-500/30 rounded-xl pl-10 pr-3 py-2.5 text-blue-100 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all appearance-none [&>option]:bg-gray-900"
                                            >
                                                <option value="" disabled>Vorgesetzten wählen...</option>
                                                {availableManagers.map(mgr => (
                                                    <option key={mgr.id} value={mgr.id}>
                                                        {mgr.name} ({mgr.role?.name})
                                                    </option>
                                                ))}
                                            </select>
                                            <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none text-xs"></i>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => { setIsAddModalOpen(false); resetForm(); }}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    Abbrechen
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.5)] transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Benutzer Speichern
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
                    <div className="glass-card w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl animate-[slideUp_0.3s_ease-out]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                                <i className="fa-solid fa-user-pen text-blue-400"></i> Mitarbeiter bearbeiten
                            </h2>
                            <button onClick={() => { setIsEditModalOpen(false); resetForm(); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 pl-1">Name</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 pl-1">E-Mail</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 pl-1">Telefonnummer <span className="text-gray-500 text-[10px]">(Optional)</span></label>
                                <div className="relative">
                                    <i className="fa-solid fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="+49 123 456789"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 pl-1">Neues Passwort</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            placeholder="Leer lassen für keine Änderung"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 pl-1">System-Rolle</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-id-badge absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                        <select
                                            required
                                            value={formData.role_id}
                                            onChange={(e) => setFormData({ ...formData, role_id: e.target.value, manager_id: '' })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none [&>option]:bg-gray-900"
                                        >
                                            <option value="" disabled>Bitte wählen...</option>
                                            {roles.map(r => (
                                                <option key={r.id} value={r.id}>{r.name}</option>
                                            ))}
                                        </select>
                                        <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs"></i>
                                    </div>
                                </div>

                                <div className="space-y-1 col-span-2">
                                    <label className="text-xs font-medium text-gray-400 pl-1">Fachrichtung (Specialty)</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-briefcase absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                        <input
                                            type="text"
                                            value={formData.specialty}
                                            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="z.B. Elektriker"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1 col-span-2 md:col-span-1">
                                    <label className="text-xs font-medium text-gray-400 pl-1">Status</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-circle-check absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none [&>option]:bg-gray-900"
                                        >
                                            <option value="active">Aktiv</option>
                                            <option value="inactive">Inaktiv</option>
                                            <option value="suspended">Gesperrt</option>
                                        </select>
                                        <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs"></i>
                                    </div>
                                </div>

                                {/* Dynamic Manager Selector based on Hierarchy */}
                                {availableManagers.length > 0 && (
                                    <div className="space-y-1 col-span-2 md:col-span-1 animate-[fadeIn_0.3s_ease-out]">
                                        <label className="text-xs font-medium text-gray-400 pl-1">
                                            Vorgesetzter
                                        </label>
                                        <div className="relative">
                                            <i className="fa-solid fa-sitemap absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"></i>
                                            <select
                                                required
                                                value={formData.manager_id}
                                                onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
                                                className="w-full bg-blue-500/10 border border-blue-500/30 rounded-xl pl-10 pr-3 py-2.5 text-blue-100 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all appearance-none [&>option]:bg-gray-900"
                                            >
                                                <option value="" disabled>Wählen...</option>
                                                {availableManagers.map(mgr => (
                                                    <option key={mgr.id} value={mgr.id}>
                                                        {mgr.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none text-xs"></i>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => { setIsEditModalOpen(false); resetForm(); }}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    Abbrechen
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.5)] transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Änderungen Speichern
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Users;
