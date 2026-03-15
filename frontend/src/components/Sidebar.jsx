import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NavItem = ({ to, icon, label, isActive }) => (
    <Link
        to={to}
        className={`nav-item px-6 py-3 flex items-center gap-4 text-sm ${isActive ? 'active' : ''}`}
    >
        <i className={`fa-solid ${icon} w-5 text-center`}></i> {label}
    </Link>
);

const NavGroup = ({ label, items, currentPath }) => {
    const isGroupActive = items.some(item => currentPath === item.path);
    const [isOpen, setIsOpen] = useState(isGroupActive);

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
                            isActive={currentPath === route.path}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Sidebar = () => {
    const { user } = useSelector(state => state.auth);
    console.log('DEBUG: Current User Role:', user?.role);
    const location = useLocation();
    const currentPath = location.pathname;

    const mainItems = [
        { path: '/dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
        { path: '/notizen', icon: 'fa-note-sticky', label: 'Notizen' },
        { path: '/aufgaben', icon: 'fa-clipboard-list', label: 'Aufgaben' },
        { path: '/benutzer', icon: 'fa-users-gear', label: 'Benutzer' },
        { path: '/subunternehmer', icon: 'fa-truck-fast', label: 'Subunternehmer' },
        { path: '/kunden', icon: 'fa-users', label: 'Kunden' },
        { path: '/projekte', icon: 'fa-building', label: 'Projekte' },
        { path: '/kategorien', icon: 'fa-tags', label: 'Kategorien' },
        { path: '/anfragen', icon: 'fa-inbox', label: 'Anfragen' },
        { path: '/support', icon: 'fa-headset', label: 'Support' }
    ];

    const apiGroup = {
        label: 'System & API',
        items: [
            { path: '/settings/api-keys', icon: 'fa-key', label: 'API-Schlüssel' },
            { path: '/settings/api-integration', icon: 'fa-code', label: 'API Integration' }
        ]
    };

    return (
        <aside className="w-64 flex-shrink-0 border-r border-white/10 flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
                    <i className="fa-solid fa-helmet-safety text-blue-400 text-xl"></i>
                </div>
                <h1 className="text-xl font-bold tracking-wider">Build<span className="text-blue-400">Admin</span></h1>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 flex flex-col scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {/* Main Menu - Always Visible */}
                <div className="px-6 py-2 text-xs font-semibold tracking-wider uppercase text-gray-500 mb-1">
                    Hauptmenü
                </div>
                <div className="flex flex-col gap-1 mb-4">
                    {mainItems.map(route => (
                        <NavItem
                            key={route.path}
                            to={route.path}
                            icon={route.icon}
                            label={route.label}
                            isActive={currentPath === route.path}
                        />
                    ))}
                </div>

                {/* API Settings - Collapsible - Only for Admins */}
                {(user?.role?.name?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'admin') && (
                    <NavGroup 
                        label={apiGroup.label} 
                        items={apiGroup.items} 
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
        </aside>
    );
};

export default Sidebar;
