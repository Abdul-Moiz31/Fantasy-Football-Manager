import React, { useEffect, useState } from "react";
import { teamApi } from "@/services/api";
import { useTeam } from "@/contexts/TeamContext";
import { formatCurrency } from "@/utils";
import { LoadingState } from "@/components/ui/LoadingState";
import { Trophy, Medal, Users, DollarSign, TrendingUp, RefreshCw } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  playerCount: number;
  budget: number;
  squadValue: number;
  totalAssets: number;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
      <Trophy className="w-4 h-4 text-white" />
    </div>
  );
  if (rank === 2) return (
    <div className="w-9 h-9 rounded-full bg-slate-400 flex items-center justify-center flex-shrink-0">
      <Medal className="w-4 h-4 text-white" />
    </div>
  );
  if (rank === 3) return (
    <div className="w-9 h-9 rounded-full bg-amber-700 flex items-center justify-center flex-shrink-0">
      <Medal className="w-4 h-4 text-white" />
    </div>
  );
  return (
    <div className="w-9 h-9 rounded-full bg-[#F5F5F5] border border-[#E0E0E0] flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-bold text-[#424242]">{rank}</span>
    </div>
  );
}

export function LeaderboardPage() {
  const { team: myTeam } = useTeam();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await teamApi.getLeaderboard();
      if (res.success) {
        setEntries(res.data || []);
      } else {
        setError("Failed to load leaderboard.");
      }
    } catch {
      setError("Failed to load leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const myRank = myTeam ? entries.findIndex((e) => e.id === myTeam.id) + 1 : 0;

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#212121]">Leaderboard</h1>
          <p className="text-sm text-[#424242]/60 mt-1">
            Rankings based on total assets (squad value + budget)
          </p>
        </div>
        <button
          onClick={fetchLeaderboard}
          disabled={loading}
          className="p-2.5 rounded-xl bg-white border border-[#E0E0E0] hover:bg-[#E8F5E9] hover:border-[#2E7D32]/30 transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 text-[#2E7D32] ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Your rank banner */}
      {myRank > 0 && (
        <div className="mb-6 bg-gradient-to-r from-[#2E7D32] to-[#43A047] rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-white/70 text-sm">Your current rank</p>
              <p className="text-4xl font-bold mt-1">#{myRank}</p>
              <p className="text-white/80 text-sm mt-1">
                out of {entries.length} teams
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-sm">Total assets</p>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  entries.find((e) => e.id === myTeam?.id)?.totalAssets || 0
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingState message="Loading leaderboard…" />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="px-4 py-2 bg-[#2E7D32] text-white text-sm rounded-lg hover:bg-[#1B5E20]"
          >
            Try again
          </button>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="w-16 h-16 text-[#424242]/20 mx-auto mb-4" />
          <p className="text-[#424242]/60 font-medium">No teams yet</p>
          <p className="text-sm text-[#424242]/40 mt-1">Be the first to build a team!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Column headers */}
          <div className="hidden sm:grid grid-cols-[3rem_1fr_8rem_8rem_9rem_10rem] gap-4 px-4 pb-2 text-xs font-semibold text-[#424242]/50 uppercase tracking-wide">
            <div>Rank</div>
            <div>Team</div>
            <div className="text-right">Players</div>
            <div className="text-right">Budget</div>
            <div className="text-right">Squad Value</div>
            <div className="text-right">Total Assets</div>
          </div>

          {entries.map((entry, idx) => {
            const rank = idx + 1;
            const isMe = entry.id === myTeam?.id;
            return (
              <div
                key={entry.id}
                className={`rounded-xl border px-4 py-3.5 transition-all duration-200 ${
                  isMe
                    ? "bg-[#E8F5E9] border-[#2E7D32]/40 shadow-sm"
                    : rank <= 3
                    ? "bg-white border-[#E0E0E0] shadow-sm"
                    : "bg-white border-[#E0E0E0] hover:shadow-sm"
                }`}
              >
                {/* Mobile layout */}
                <div className="flex items-center gap-3 sm:hidden">
                  <RankBadge rank={rank} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold text-sm truncate ${isMe ? "text-[#2E7D32]" : "text-[#212121]"}`}>
                        {entry.name}
                        {isMe && <span className="ml-1.5 text-xs bg-[#2E7D32] text-white px-1.5 py-0.5 rounded-full">You</span>}
                      </p>
                    </div>
                    <p className="text-xs text-[#424242]/60 mt-0.5">
                      {entry.playerCount} players &middot; {formatCurrency(entry.totalAssets)} total
                    </p>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden sm:grid grid-cols-[3rem_1fr_8rem_8rem_9rem_10rem] gap-4 items-center">
                  <RankBadge rank={rank} />
                  <div className="min-w-0 flex items-center gap-2">
                    <span className={`font-semibold text-sm truncate ${isMe ? "text-[#2E7D32]" : "text-[#212121]"}`}>
                      {entry.name}
                    </span>
                    {isMe && (
                      <span className="flex-shrink-0 text-xs bg-[#2E7D32] text-white px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-right flex items-center justify-end gap-1 text-sm text-[#424242]">
                    <Users className="w-3.5 h-3.5 text-[#424242]/40" />
                    {entry.playerCount}
                  </div>
                  <div className="text-right flex items-center justify-end gap-1 text-sm text-[#1976D2]">
                    <DollarSign className="w-3 h-3" />
                    <span className="font-medium">{formatCurrency(entry.budget)}</span>
                  </div>
                  <div className="text-right flex items-center justify-end gap-1 text-sm text-[#FF9800]">
                    <TrendingUp className="w-3 h-3" />
                    <span className="font-medium">{formatCurrency(entry.squadValue)}</span>
                  </div>
                  <div className={`text-right text-sm font-bold ${isMe ? "text-[#2E7D32]" : rank === 1 ? "text-amber-600" : "text-[#212121]"}`}>
                    {formatCurrency(entry.totalAssets)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
