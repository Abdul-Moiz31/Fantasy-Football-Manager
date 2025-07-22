import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageLayout({ 
  children, 
  title, 
  subtitle, 
  actions, 
  className = '' 
}: PageLayoutProps) {
  return (
    <div className={className}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#424242] mb-2">{title}</h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-[#424242]/70">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="mt-4 sm:mt-0">
            {actions}
          </div>
        )}
      </div>
      
      {/* Page Content */}
      {children}
    </div>
  );
} 