import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, LogOut, Shield, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully signed out.",
    });
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', label: 'Profile', icon: User },
    ...(user?.role === 'admin' ? [
      { path: '/admin', label: 'Manage Jobs', icon: Briefcase },
      { path: '/admin/users', label: 'Manage Users', icon: Shield }
    ] : [])
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <Briefcase size={18} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground hidden sm:inline">Jobora</span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-3 pr-2 border-r">
                   <div className="flex flex-col items-end">
                      <span className="text-xs font-semibold text-foreground leading-tight">{user.name}</span>
                      <span className="text-[10px] text-muted-foreground capitalize">{user.role}</span>
                   </div>
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut size={16} className="mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-accent text-muted-foreground"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && user && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t bg-background"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t">
                 <button
                   onClick={handleLogout}
                   className="flex w-full items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                 >
                   <LogOut size={16} />
                   Logout
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
