import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const features = [
    { emoji: '⚽', text: '20-player squads auto-assigned on sign-up' },
    { emoji: '💰', text: '$5M starting budget for transfers' },
    { emoji: '📈', text: 'Live transfer market with other managers' },
    { emoji: '🏆', text: 'Compete on the global leaderboard' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2E7D32] p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute bottom-10 -left-10 w-60 h-60 rounded-full bg-black/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-12">
            <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
              <img src="/football.svg" alt="Football" className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold">Fantasy Football Manager</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Build your<br />dream squad
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            Manage transfers, climb the leaderboard, and become the top fantasy football manager.
          </p>

          <div className="space-y-4">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-lg flex-shrink-0">
                  {f.emoji}
                </div>
                <span className="text-white/90 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4 text-center">
          {[
            { value: '50K+', label: 'Active managers' },
            { value: '$5M', label: 'Starting budget' },
            { value: '1000+', label: 'Real players' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        {children}
      </div>
    </div>
  );
} 