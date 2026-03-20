import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const MainLayout = () => {
    const location = useLocation();
    const { breadcrumbOverride } = useSelector((state) => state.ui);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar on route change on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const pageTitle = useMemo(() => {
        if (breadcrumbOverride && location.pathname.includes(breadcrumbOverride.path)) {
            return breadcrumbOverride.title;
        }

        const path = location.pathname.substring(1);
        if (!path) return 'Dashboard';

        // Handle nested paths like "projekte/:id"
        if (path.startsWith('projekte/')) {
            return 'Projekte';
        }

        if (path.startsWith('settings/')) {
            const sub = path.split('/')[1];
            if (sub === 'api-keys') return 'API-Schlüssel';
            if (sub === 'api-integration') return 'API Integration';
            return 'Einstellungen';
        }

        return path.charAt(0).toUpperCase() + path.slice(1);
    }, [location.pathname, breadcrumbOverride]);

    return (
        <div className="h-screen w-screen overflow-hidden flex items-center justify-center md:p-4 lg:p-6 text-slate-50 font-sans relative z-10">
            {/* Main App Container */}
            <div className="glass-panel w-full h-full max-w-[1600px] md:rounded-3xl flex overflow-hidden relative">

                {/* Sidebar */}
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)} 
                    currentPath={location.pathname} 
                />

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col overflow-hidden relative">

                    {/* Top Header */}
                    <Header 
                        title={pageTitle} 
                        onMenuClick={() => setIsSidebarOpen(true)} 
                    />

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 page-section active">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
