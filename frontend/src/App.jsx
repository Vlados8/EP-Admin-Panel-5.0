import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from './layouts/MainLayout';
import Dashboard from './features/dashboard/Dashboard';
import Notes from './features/notes/Notes';
import Tasks from './features/tasks/Tasks';
import Users from './features/users/Users';
import Projects from './features/projects/Projects';
import Support from './features/support/Support';
import Login from './features/auth/Login';
import Subcontractors from './features/subcontractors/Subcontractors';
import Customers from './features/customers/Customers';
import Categories from './features/categories/Categories';
import Inquiries from './features/inquiries/Inquiries';
import ProjectDetails from './features/projects/ProjectDetails';
import ApiKeys from './pages/Settings/ApiKeys';
import ApiIntegration from './pages/Settings/ApiIntegration';
import Emails from './features/emails/Emails';
import EmailMessages from './features/emails/EmailMessages';
import EmailApi from './features/emails/EmailApi';

// Protect Routes with actual auth state
const RequireAuth = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                    <RequireAuth>
                        <MainLayout />
                    </RequireAuth>
                }>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="notizen" element={<Notes />} />
                    <Route path="aufgaben" element={<Tasks />} />
                    <Route path="benutzer" element={<Users />} />
                    <Route path="subunternehmer" element={<Subcontractors />} />
                    <Route path="kunden" element={<Customers />} />
                    <Route path="projekte" element={<Projects />} />
                    <Route path="projekte/:id" element={<ProjectDetails />} />
                    <Route path="kategorien" element={<Categories />} />
                    <Route path="anfragen" element={<Inquiries />} />
                    <Route path="support" element={<Support />} />
                    <Route path="emails" element={<Emails />} />
                    <Route path="email-messages" element={<EmailMessages />} />
                    <Route path="settings">
                        <Route path="email-api" element={<EmailApi />} />
                        <Route path="api-keys" element={<ApiKeys />} />
                        <Route path="api-integration" element={<ApiIntegration />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
