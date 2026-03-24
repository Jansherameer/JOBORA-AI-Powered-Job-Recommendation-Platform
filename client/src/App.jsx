import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminJobs from './pages/AdminJobs';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import ServerError from './pages/ServerError';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { Loader2 } from 'lucide-react';
import { Toaster } from './components/ui/toaster';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50 mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Unauthorized />;

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50 mb-4" />
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" />;
  return children;
}

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminJobs /></ProtectedRoute>} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/error" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
