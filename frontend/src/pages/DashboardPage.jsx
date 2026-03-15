import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const roleRoutes = {
  PRESIDENT: '/petitions/my',
  ADVISOR: '/advisor/petitions',
  ADMIN: '/admin/petitions/pending',
};

export default function DashboardPage() {
  const { user, token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const target = roleRoutes[user?.role] || '/login';
  return <Navigate to={target} replace />;
}
