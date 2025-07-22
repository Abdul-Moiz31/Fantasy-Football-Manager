import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, UserCircle, X, LogOut, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTeam } from '@/contexts/TeamContext';
import { Button } from '@/components/ui/Button';
import { formatTeamNameFromEmail } from '@/utils';
import { ROUTES } from '@/constants';

const navLinks = [
  { to: ROUTES.HOME, label: "Dashboard", icon: Home },
  { to: ROUTES.MARKET, label: "Market", icon: ShoppingCart },
  { to: ROUTES.TEAM, label: "My Team", icon: UserCircle },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const { user, logout } = useAuth();
  const { team } = useTeam();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH);
  };

  return (
    <aside
      className={`fixed z-40 top-0 left-0 h-screen w-64 bg-[#2E7D32] border-r border-[#1B5E20] shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-[#1B5E20]">
        <div className="flex items-center gap-3 text-white font-bold text-xl">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <img src="/football.svg" alt="Football" className="w-6 h-6" />
          </div>
          <span>Fantasy Manager</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto md:hidden p-1.5 rounded-lg hover:bg-white/10 text-white"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-2">
          {navLinks.map(link => {
            const IconComponent = link.icon;
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `group w-full flex items-center px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white/20 text-white shadow-sm border border-white/30"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`
                  }
                  end={link.to === ROUTES.HOME}
                  onClick={onClose}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
-
      {/* User Profile Section */}
      <div className="p-4 border-t border-[#1B5E20]">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
            {/* {user?.email ? user.email[0].toUpperCase() : <UserCircle className="w-5 h-5" />} */}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {formatTeamNameFromEmail(user?.email || '')}
            </div>
            <div className="text-xs text-white/70 truncate">
              {user?.email}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 border border-white/20 hover:bg-red-500/20 hover:border-red-400 hover:text-red-200 rounded-lg transition-colors flex items-center justify-center" 
            onClick={handleLogout}
          >
            <LogOut className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </aside>
  );
} 