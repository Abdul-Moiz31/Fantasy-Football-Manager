import React from "react";
import { Link } from "react-router-dom";
import { useTeam } from "@/contexts/TeamContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/utils";
import { TEAM_CONSTRAINTS, ROUTES, POSITION_CONFIG } from "@/constants";
import {
  Users,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Shield,
  Target,
  Zap,
  Star,
  ArrowRight,
  Activity,
} from "lucide-react";

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
  bg,
}: {
  icon: React.ElementType;
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  color: string;
  bg: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E0E0E0] shadow-sm p-5 flex items-start gap-4`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-[#424242]/60 font-medium">{title}</p>
        <div className="text-2xl font-bold text-[#212121] mt-0.5 truncate">{value}</div>
        {subtitle && <p className="text-xs text-[#424242]/50 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

function PositionBar({
  label,
  count,
  total,
  color,
  bgColor,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  bgColor: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-[#424242]">{label}</span>
        <span className="text-sm text-[#424242]/60">
          {count} <span className="text-xs">players</span>
        </span>
      </div>
      <div className="w-full h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function QuickActionCard({
  to,
  icon: Icon,
  title,
  description,
  color,
}: {
  to: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link
      to={to}
      className="group bg-white rounded-2xl border border-[#E0E0E0] shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:border-[#2E7D32]/30 transition-all duration-200"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#F5F5F5] group-hover:bg-[#E8F5E9] transition-colors`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#212121] text-sm">{title}</p>
        <p className="text-xs text-[#424242]/60 mt-0.5">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-[#424242]/30 group-hover:text-[#2E7D32] transition-colors flex-shrink-0" />
    </Link>
  );
}

export function HomePage() {
  const { team } = useTeam();
  const { user } = useAuth();

  const players = team?.players || [];
  const totalPlayers = players.length;

  const positionCounts = POSITION_CONFIG.reduce(
    (acc, pos) => {
      acc[pos.key] = players.filter((p: any) => p.position === pos.key).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalValue = players.reduce((sum: number, p: any) => sum + (p.value || 0), 0);
  const listedCount = players.filter((p: any) => p.in_transfer_market).length;
  const availableCount = totalPlayers - listedCount;

  const teamCompletionPct = Math.round((totalPlayers / TEAM_CONSTRAINTS.MAX_PLAYERS) * 100);
  const budgetUtilization =
    totalValue > 0
      ? Math.round((totalValue / (totalValue + (team?.budget || 0))) * 100)
      : 0;

  const displayName = user?.email
    ? user.email.split("@")[0].charAt(0).toUpperCase() + user.email.split("@")[0].slice(1)
    : "Manager";

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-4 py-6 sm:py-8">
      {/* Welcome Banner */}
      <div className="mb-8 bg-gradient-to-r from-[#2E7D32] to-[#43A047] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/80 text-sm font-medium">Welcome back,</p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">{displayName}</h1>
            <p className="text-white/70 text-sm mt-2">
              {team?.name || "Your Team"} &middot; {totalPlayers} players
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-white/70 text-xs">Squad completion</p>
              <p className="text-2xl font-bold">{teamCompletionPct}%</p>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-white/30 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-white/70 mb-1.5">
            <span>{totalPlayers} / {TEAM_CONSTRAINTS.MAX_PLAYERS} players</span>
            <span>Min required: {TEAM_CONSTRAINTS.MIN_PLAYERS}</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${teamCompletionPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          title="Total Players"
          value={`${totalPlayers} / ${TEAM_CONSTRAINTS.MAX_PLAYERS}`}
          subtitle={`${availableCount} available, ${listedCount} listed`}
          color="text-[#2E7D32]"
          bg="bg-[#E8F5E9]"
        />
        <StatCard
          icon={DollarSign}
          title="Available Budget"
          value={formatCurrency(team?.budget || 0)}
          subtitle="Remaining transfer budget"
          color="text-[#1976D2]"
          bg="bg-[#E3F2FD]"
        />
        <StatCard
          icon={TrendingUp}
          title="Squad Value"
          value={formatCurrency(totalValue)}
          subtitle={`${budgetUtilization}% of total assets`}
          color="text-[#FF9800]"
          bg="bg-[#FFF3E0]"
        />
        <StatCard
          icon={ShoppingCart}
          title="On Market"
          value={listedCount}
          subtitle={listedCount === 1 ? "player listed for sale" : "players listed for sale"}
          color="text-[#E53935]"
          bg="bg-[#FFEBEE]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Position Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E0E0E0] shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#212121]">Squad Breakdown</h2>
              <p className="text-sm text-[#424242]/60 mt-0.5">Players by position</p>
            </div>
            <Link
              to={ROUTES.TEAM}
              className="text-sm text-[#2E7D32] hover:text-[#1B5E20] font-medium flex items-center gap-1"
            >
              View Team <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {totalPlayers === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#424242]/30" />
              </div>
              <p className="text-[#424242]/60 font-medium">No players yet</p>
              <p className="text-sm text-[#424242]/40 mt-1">Visit the market to sign players</p>
              <Link
                to={ROUTES.MARKET}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#2E7D32] text-white text-sm font-medium rounded-lg hover:bg-[#1B5E20] transition-colors"
              >
                Browse Market <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {POSITION_CONFIG.map((pos) => (
                <div key={pos.key}>
                  <PositionBar
                    label={pos.label}
                    count={positionCounts[pos.key] || 0}
                    total={totalPlayers}
                    color={pos.color}
                    bgColor=""
                  />
                  {/* Mini player list */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {players
                      .filter((p: any) => p.position === pos.key)
                      .slice(0, 5)
                      .map((p: any) => (
                        <span
                          key={p.id || p.player_id}
                          className="text-xs bg-[#F5F5F5] text-[#424242] px-2 py-1 rounded-lg truncate max-w-[140px]"
                          title={p.name || p.player_name}
                        >
                          {p.name || p.player_name}
                        </span>
                      ))}
                    {(positionCounts[pos.key] || 0) > 5 && (
                      <span className="text-xs text-[#424242]/50 px-2 py-1">
                        +{(positionCounts[pos.key] || 0) - 5} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions + Team Health */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#212121] mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <QuickActionCard
                to={ROUTES.MARKET}
                icon={ShoppingCart}
                title="Browse Market"
                description="Buy or sell players"
                color="text-[#2E7D32]"
              />
              <QuickActionCard
                to={ROUTES.TEAM}
                icon={Users}
                title="Manage Squad"
                description="View and list players"
                color="text-[#1976D2]"
              />
              <QuickActionCard
                to={ROUTES.LEADERBOARD}
                icon={Star}
                title="Leaderboard"
                description="See top teams"
                color="text-[#FF9800]"
              />
            </div>
          </div>

          {/* Team health indicators */}
          <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#212121] mb-4">Team Health</h2>
            <div className="space-y-3">
              {[
                {
                  icon: Shield,
                  label: "Squad size",
                  ok: totalPlayers >= TEAM_CONSTRAINTS.MIN_PLAYERS,
                  msg:
                    totalPlayers >= TEAM_CONSTRAINTS.MIN_PLAYERS
                      ? "Meets minimum requirement"
                      : `Need ${TEAM_CONSTRAINTS.MIN_PLAYERS - totalPlayers} more players`,
                },
                {
                  icon: DollarSign,
                  label: "Budget status",
                  ok: (team?.budget || 0) > 100000,
                  msg:
                    (team?.budget || 0) > 100000
                      ? "Healthy budget"
                      : "Low budget — consider selling",
                },
                {
                  icon: Target,
                  label: "Roster space",
                  ok: totalPlayers < TEAM_CONSTRAINTS.MAX_PLAYERS,
                  msg:
                    totalPlayers < TEAM_CONSTRAINTS.MAX_PLAYERS
                      ? `${TEAM_CONSTRAINTS.MAX_PLAYERS - totalPlayers} spots available`
                      : "Squad is full",
                },
                {
                  icon: Zap,
                  label: "Market activity",
                  ok: listedCount > 0,
                  msg: listedCount > 0 ? `${listedCount} players on market` : "No active listings",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      item.ok ? "bg-[#E8F5E9]" : "bg-[#FFF3E0]"
                    }`}
                  >
                    <item.icon
                      className={`w-4 h-4 ${item.ok ? "text-[#2E7D32]" : "text-[#FF9800]"}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#424242]">{item.label}</p>
                    <p className="text-xs text-[#424242]/60 truncate">{item.msg}</p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ml-auto ${
                      item.ok ? "bg-[#43A047]" : "bg-[#FF9800]"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
