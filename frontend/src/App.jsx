import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// President Pages
import MyPetitionsPage from './pages/president/MyPetitionsPage';
import CreatePetitionPage from './pages/president/CreatePetitionPage';
import PetitionDetailPage from './pages/president/PetitionDetailPage';

// Advisor Pages
import AdvisorPetitionsPage from './pages/advisor/AdvisorPetitionsPage';
import AdvisorPetitionDetailPage from './pages/advisor/AdvisorPetitionDetailPage';

// Admin Pages
import PendingPetitionsPage from './pages/admin/PendingPetitionsPage';
import AllPetitionsPage from './pages/admin/AllPetitionsPage';
import AdminPetitionDetailPage from './pages/admin/AdminPetitionDetailPage';
import ClubManagementPage from './pages/admin/ClubManagementPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Dashboard — Takvim Görünümü */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><DashboardPage /></Layout>
        </ProtectedRoute>
      } />

      {/* President Routes */}
      <Route path="/petitions/my" element={
        <ProtectedRoute allowedRoles={['PRESIDENT']}>
          <Layout><MyPetitionsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/petitions/create" element={
        <ProtectedRoute allowedRoles={['PRESIDENT']}>
          <Layout><CreatePetitionPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/petitions/:id" element={
        <ProtectedRoute>
          <Layout><PetitionDetailPage /></Layout>
        </ProtectedRoute>
      } />

      {/* Advisor Routes */}
      <Route path="/advisor/petitions" element={
        <ProtectedRoute allowedRoles={['ADVISOR']}>
          <Layout><AdvisorPetitionsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/advisor/petitions/:id" element={
        <ProtectedRoute allowedRoles={['ADVISOR']}>
          <Layout><AdvisorPetitionDetailPage /></Layout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/petitions/pending" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <Layout><PendingPetitionsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/petitions/all" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <Layout><AllPetitionsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/petitions/:id" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <Layout><AdminPetitionDetailPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/clubs" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <Layout><ClubManagementPage /></Layout>
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
