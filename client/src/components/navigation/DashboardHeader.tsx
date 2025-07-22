import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onMenuClick: () => void;
}

const getPageInfo = (pathname: string) => {
  switch (pathname) {
    case ROUTES.HOME:
      return { title: 'Dashboard', subtitle: 'Overview & Statistics', icon: '🏠' };
    case ROUTES.MARKET:
      return { title: 'Transfer Market', subtitle: 'Buy & Sell Players', icon: '🛒' };
    case ROUTES.TEAM:
      return { title: 'My Team', subtitle: 'Manage Your Squad', icon: '⚽' };
    default:
      return { title: 'Dashboard', subtitle: 'Overview', icon: '🏠' };
  }
};

export function DashboardHeader({ title, subtitle, actions, onMenuClick }: DashboardHeaderProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const pageInfo = getPageInfo(location.pathname);
  const displayTitle = title || pageInfo.title;
  const displaySubtitle = subtitle || pageInfo.subtitle;

  return (
    <header className="sticky top-0 z-20 bg-[#2E7D32] backdrop-blur-md border-b border-[#1B5E20] shadow-sm">
      <div className="h-16 flex items-center px-4 sm:px-6 justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5 text-white" />
          </Button>

          {/* Page title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-xs sm:text-sm">{pageInfo.icon}</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                {displayTitle}
              </h2>
              <p className="text-xs text-white/70 truncate hidden sm:block">
                {displaySubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Custom actions */}
          {actions}
          
          {/* Search - hidden on mobile */}
          <div className="hidden sm:flex items-center relative">
            <Search className="w-4 h-4 absolute left-3 text-white/70" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-48 lg:w-64 text-sm bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all text-white placeholder-white/70"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5 text-white" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>
    </header>
  );
} 