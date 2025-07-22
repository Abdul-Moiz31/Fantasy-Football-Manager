import React from 'react';
import { AuthStats } from '@/components/auth/AuthStats';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2E7D32] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <img src="/football.svg" alt="Football" className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold">Fantasy Football Manager</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-6">Build Your Dream Team</h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Join thousands of managers competing in the ultimate fantasy football experience. 
            Create your squad, make transfers, and climb the leaderboards.
          </p>
        </div>
        
        <AuthStats variant="full" className="relative z-10" />
      </div>
      
      {/* Right side - Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
} 