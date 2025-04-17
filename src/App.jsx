import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import Layout from './Component/Layout';
import Dashboard from './Pages/Dashboard';
import Leads from './Pages/Leads';
import Profile from './Pages/Profile';
import NotFoundPage from './Component/NotFoundPage';
import Reports from './Pages/Reports';
import MailInbox from './Component/MailInbox';
import UserMaster from './Pages/UserMaster';
import UserPrivileges from './Pages/UserPrivileges';
import Designation from './Pages/Designation';
import Department from './Pages/Department';
import Status from './Pages/Status';
import Organisation from './Pages/Organisation';
import Country from './Pages/Country';
import Scope from './Pages/Scope';
import SectoralScope from './Pages/SectoralScope';
import Currency from './Pages/Currency';
import Region from './Pages/Region';
import LoginHistory from './Pages/LoginHistory';
import History from './Pages/History';
import DataImport from './Pages/DataImport';
import DebugEnv from './Component/DebugEnv';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function App() {
  const { token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token; // Convert token to boolean

  // useEffect(() => {
  //   console.log('Authentication token:', token);
  //   console.log('Is authenticated:', isAuthenticated);
  // }, [token, isAuthenticated]);

  // Protected route component that checks for token
  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/" replace />;
  };

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/about" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />

        {/* Protected routes with Layout */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/dashboard/profile" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<Profile />} />
        </Route>

        <Route path="/dashboard/reports" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<Reports />} />
        </Route>

        <Route path="/dashboard/mail" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<MailInbox />} />
        </Route>

        <Route path="/dashboard/userMaster" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<UserMaster />} />
        </Route>

        <Route path="/dashboard/userprivileges" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<UserPrivileges />} />
        </Route>

        <Route path="/dashboard/program-master/designation" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<Designation />} />
        </Route>

        <Route path="/dashboard/program-master/department" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<Department />} />
        </Route>

        <Route path="/dashboard/program-master/status" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<Status />} />
        </Route>

        <Route path="/dashboard/program-master/organisation" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<Organisation />} />
        </Route>

        <Route path="/dashboard/program-master/currency" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<Currency />} />
        </Route>

        <Route path="/dashboard/program-master/scope" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<Scope />} />
        </Route>

        <Route path="/dashboard/program-master/sectoral-scope" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<SectoralScope />} />
        </Route>

        <Route path="/dashboard/program-master/country" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<Country />} />
        </Route>

        <Route path="/dashboard/program-master/region" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<Region />} />
        </Route>

        <Route path="/dashboard/reports/login-history" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<LoginHistory />} />
        </Route>

        <Route path="/dashboard/reports/history" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<History />} />
        </Route>

        <Route path="/dashboard/settings/dataimport" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<DataImport />} />
        </Route>

        <Route path="/dashboard/DebugEnv" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<DebugEnv />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;