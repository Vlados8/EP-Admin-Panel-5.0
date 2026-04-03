import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import socketService from '../services/socket';

const NavItem = ({ to, icon, label, isActive, badge }) => (
    <Link
        to={to}
        className={`nav-item px-6 py-3 flex items-center justify-between gap-4 text-sm ${isActive ? 'active' : ''}`}
    >
        <div className="flex items-center gap-4">
            <i className={`fa-solid ${icon} w-5 text-center`}></i> {label}
        </div>
        {badge && (
            <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[1.25rem] text-center">
                {badge}
            </span>
        )}
    </Link>
);

import usePermission from '../hooks/usePermission';

const NavGroup = ({ label, items, currentPath, search }) => {
    const fullPath = search ? currentPath + search : currentPath;
    const isGroupActive = items.some(item => currentPath === item.path || fullPath === item.path);
    const [isOpen, setIsOpen] = useState(isGroupActive);

    if (items.length === 0) return null;

    return (
        <div className="mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-6 py-2 flex items-center justify-between text-xs font-semibold tracking-wider uppercase mb-1 transition-colors ${isGroupActive ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
                <span>{label}</span>
                <i className={`fa-solid fa-chevron-${isOpen ? 'down' : 'right'} w-4 text-center`}></i>
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col gap-1">
                    {items.map(route => (
                        <NavItem
                            key={route.path}
                            to={route.path}
                            icon={route.icon}
                            label={route.label}
                            badge={route.badge}
                            isActive={currentPath === route.path || fullPath === route.path}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Sidebar = ({ isOpen, onClose, currentPath }) => {
    const { user } = useSelector(state => state.auth);
    const location = useLocation();
    const [emailAccounts, setEmailAccounts] = useState([]);

    const canViewUsers = usePermission('VIEW_USERS');
    const canViewSubcontractors = usePermission('VIEW_SUBCONTRACTORS');
    const canViewCustomers = usePermission('VIEW_CUSTOMERS');
    const canViewProjects = usePermission('VIEW_PROJECTS');
    const canViewCategories = usePermission('VIEW_CATEGORIES');
    const canViewInquiries = usePermission('VIEW_INQUIRIES');
    const canViewSupport = usePermission('VIEW_SUPPORT');
    const canViewEmails = usePermission('VIEW_EMAILS');
    const canManageEmails = usePermission('MANAGE_EMAIL_ACCOUNTS');
    const canManageApiKeys = usePermission('MANAGE_API_KEYS');
    const canViewNotes = usePermission('VIEW_NOTES');
    const canViewTasks = usePermission('VIEW_TASKS');

    const fetchAccounts = async () => {
        if (!canViewEmails) return;
        try {
            const res = await api.get('/emails');
            setEmailAccounts(res.data.data.accounts || []);
        } catch (err) {
            console.error('Error fetching email accounts for sidebar:', err);
        }
    };

    useEffect(() => {
        fetchAccounts();

        // Listen for real-time email updates
        const handleNewEmail = () => {
            console.log('New email received, updating sidebar badges...');
            fetchAccounts();
        };

        socketService.on('new_email', handleNewEmail);

        return () => {
            socketService.off('new_email', handleNewEmail);
        };
    }, [canViewEmails]); // Re-fetch if permission changes (rare but good practice)

    const baseMenu = [
        { path: '/dashboard', icon: 'fa-chart-line', label: 'Dashboard', show: true }, // Everyone sees Dashboard
        { path: '/notizen', icon: 'fa-note-sticky', label: 'Notizen', show: canViewNotes },
        { path: '/aufgaben', icon: 'fa-clipboard-list', label: 'Aufgaben', show: canViewTasks },
        { path: '/benutzer', icon: 'fa-users-gear', label: 'Benutzer', show: canViewUsers },
        { path: '/subunternehmer', icon: 'fa-truck-fast', label: 'Subunternehmer', show: canViewSubcontractors },
        { path: '/kunden', icon: 'fa-users', label: 'Kunden', show: canViewCustomers },
        { path: '/projekte', icon: 'fa-building', label: 'Projekte', show: canViewProjects },
        { path: '/kategorien', icon: 'fa-tags', label: 'Kategorien', show: canViewCategories },
        { path: '/anfragen', icon: 'fa-inbox', label: 'Anfragen', show: canViewInquiries },
        { path: '/support', icon: 'fa-headset', label: 'Support', show: canViewSupport }
    ].filter(item => item.show);

    let emailMenuItems = [];
    if (canViewEmails) {
        if (canManageEmails) {
            emailMenuItems.push({ path: '/settings/email-accounts', icon: 'fa-cogs', label: 'Einstellungen' });
        }
        emailMenuItems.push({ 
            path: '/email-messages', 
            icon: 'fa-inbox', 
            label: 'Alle Nachrichten',
            badge: emailAccounts.reduce((sum, acc) => sum + (acc.unread_count || 0), 0) || null
        });
        emailAccounts.forEach(acc => {
            emailMenuItems.push({
                path: `/email-messages?account=${encodeURIComponent(acc.email)}`,
                icon: 'fa-at',
                label: acc.email,
                badge: acc.unread_count > 0 ? acc.unread_count : null
            });
        });
    }

    const apiSettingsItems = [];
    if (canManageApiKeys) {
        apiSettingsItems.push({ path: '/settings/api-keys', icon: 'fa-key', label: 'API-Schlüssel' });
        apiSettingsItems.push({ path: '/settings/api-integration', icon: 'fa-code', label: 'API Integration' });
    }

    const sidebarItems = (
        <>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
                        <i className="fa-solid fa-crown text-amber-400 text-xl"></i>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold tracking-widest uppercase text-white leading-tight">Empire</h1>
                        <span className="text-[10px] text-amber-400 tracking-widest uppercase font-semibold">Premium Bau</span>
                    </div>
                </div>
                <button onClick={onClose} className="md:hidden text-gray-500 hover:text-white p-2">
                    <i className="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 flex flex-col scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {/* Main Menu */}
                <div className="px-6 py-2 text-xs font-semibold tracking-wider uppercase text-gray-500 mb-1">
                    Hauptmenü
                </div>
                <div className="flex flex-col gap-1 mb-4">
                    {baseMenu.map(route => (
                        <NavItem
                            key={route.path}
                            to={route.path}
                            icon={route.icon}
                            label={route.label}
                            isActive={currentPath === route.path}
                        />
                    ))}
                </div>

                {/* E-Mail System */}
                {canViewEmails && emailMenuItems.length > 0 && (
                    <NavGroup 
                        label="E-Mail System" 
                        items={emailMenuItems} 
                        currentPath={currentPath} 
                        search={location.search}
                    />
                )}

                {/* API Settings */}
                {canManageApiKeys && apiSettingsItems.length > 0 && (
                    <NavGroup 
                        label="System & API" 
                        items={apiSettingsItems} 
                        currentPath={currentPath} 
                    />
                )}
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-2">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0D8ABC&color=fff`} alt="User" className="w-10 h-10 rounded-full border border-white/20" />
                    <div>
                        <p className="text-sm font-semibold truncate w-32">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-400">{user?.role?.name || user?.role || 'Mitarbeiter'}</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar Content */}
            <aside className={`fixed md:relative inset-y-0 left-0 w-64 flex-shrink-0 border-r border-white/10 flex flex-col bg-[#0a0a0c] md:bg-transparent z-[70] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                {sidebarItems}
            </aside>
        </>
    );
};

export default Sidebar;
