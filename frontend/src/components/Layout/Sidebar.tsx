import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  MapPin,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Tableau de bord', icon: Home },
    { path: '/prospects', label: 'Prospects / Clients', icon: Users },
    { path: '/map', label: 'Carte', icon: MapPin },
    { path: '/planning', label: 'Planning', icon: Calendar },
    { path: '/reports', label: 'Rapports', icon: FileText },
    { path: '/stats', label: 'Statistiques', icon: BarChart3 },
    { path: '/settings', label: 'Paramètres', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">HORECA</h1>
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Prospection</p>
      </div>

      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
          
          {/* Admin Only - Gestion des utilisateurs */}
          {user?.role === 'admin' && (
            <li>
              <Link
                to="/users"
                className={`sidebar-item ${isActive('/users') ? 'active' : ''}`}
              >
                <Shield size={20} />
                <span>Utilisateurs</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="p-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="flex items-center gap-3 mb-4 px-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-600 font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="sidebar-item w-full"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

