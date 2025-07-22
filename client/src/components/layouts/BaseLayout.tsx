import React from 'react';
import { Toaster } from '@/components/ui/Toaster';

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function BaseLayout({ children, className = '' }: BaseLayoutProps) {
  return (
    <div className={`min-h-screen ${className}`}>
      {children}
      <Toaster />
    </div>
  );
} 