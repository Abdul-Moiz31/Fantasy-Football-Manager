import { Users, Trophy, Shield } from 'lucide-react';
import { AUTH_STATS } from '@/constants';

interface AuthStatsProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function AuthStats({ variant = 'compact', className = '' }: AuthStatsProps) {
  const stats = [
    { icon: Users, value: AUTH_STATS.ACTIVE_PLAYERS, label: 'Players' },
    { icon: Trophy, value: AUTH_STATS.PRIZE_POOL, label: 'Prizes' },
    { icon: Shield, value: AUTH_STATS.SECURITY, label: 'Secure' },
  ];

  if (variant === 'full') {
    return (
      <div className={`grid grid-cols-3 gap-6 text-white ${className}`}>
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.label} className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-white/90">{stat.label}</div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-3 gap-4 text-center ${className}`}>
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div key={stat.label} className="flex flex-col items-center gap-1">
            <IconComponent className="w-5 h-5 text-[#2E7D32]" />
            <div className="text-sm text-[#424242]">{stat.value} {stat.label}</div>
          </div>
        );
      })}
    </div>
  );
} 