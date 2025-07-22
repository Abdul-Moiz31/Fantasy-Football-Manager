import React, { useState } from 'react';
import { BaseLayout } from './BaseLayout';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { DashboardHeader } from '@/components/navigation/DashboardHeader';
import { LoadingState } from '@/components/ui/LoadingState';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  loading?: boolean;
  actions?: React.ReactNode;
}

export function DashboardLayout({ 
  children, 
  title, 
  subtitle, 
  loading = false,
  actions 
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <BaseLayout className="bg-slate-50">
        <LoadingState message="Loading..." />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout className="flex bg-slate-50">
      {/* Sidebar */}
      <DashboardSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* Header */}
        <DashboardHeader 
          title={title}
          subtitle={subtitle}
          actions={actions}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 px-2 sm:px-4 py-4 sm:py-8">
          {children}
        </main>
      </div>
    </BaseLayout>
  );
} 