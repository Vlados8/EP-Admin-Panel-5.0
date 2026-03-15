import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const MainLayout = () => {
    const location = useLocation();
    const { breadcrumbOverride } = useSelector((state) => state.ui);

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
        <div className="h-screen w-screen overflow-hidden flex items-center justify-center p-4 md:p-6 text-slate-50 font-sans relative z-10">
            {/* Main App Container */}
            <div className="glass-panel w-full h-full max-w-[1600px] rounded-3xl flex overflow-hidden">

                {/* Sidebar */}
                <Sidebar currentPath={location.pathname} />

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col overflow-hidden relative">

                    {/* Top Header */}
                    <Header title={pageTitle} />

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8 page-section active">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
