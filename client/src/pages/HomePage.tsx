"use client"
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useTeam } from "@/contexts/TeamContext";
import { TEAM_CONSTRAINTS } from "@/constants";

const positions = [
  { key: "Goalkeeper", label: "Goalkeepers", color: "#2E7D32" },
  { key: "Defender", label: "Defenders", color: "#1976D2" },
  { key: "Midfielder", label: "Midfielders", color: "#43A047" },
  { key: "Forward", label: "Forwards", color: "#FF9800" },
];

export function HomePage() {
  const { team } = useTeam();

  const getPlayersByPosition = (position: string) => {
    return team?.players?.filter((player: any) => player.position === position) || [];
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#424242] mb-2">Dashboard</h1>
        <p className="text-[#424242]/70">Manage your fantasy football team</p>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="bg-white border border-[#E0E0E0] shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#424242]">Team Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2E7D32]">
              {team?.players?.length || 0}/{TEAM_CONSTRAINTS.MAX_PLAYERS} Players
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#E0E0E0] shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#424242]">Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2E7D32]">
              ${(team?.budget || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#E0E0E0] shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#424242]">Team Name</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2E7D32]">
              {team?.name || "My Team"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Position Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {positions.map((pos) => {
          const players = getPlayersByPosition(pos.key);
          return (
            <Card key={pos.key} className="w-full bg-white border border-[#E0E0E0] shadow-lg rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-[1.02] min-h-[200px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg font-bold text-[#424242] mb-1 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pos.color }}></div>
                  {pos.label}
                </CardTitle>
                <div className="text-sm text-[#424242]/70">{players.length} players</div>
              </CardHeader>
              <CardContent className="pt-0">
                {players.length === 0 ? (
                  <div className="text-[#424242]/60 text-sm italic">No {pos.label.toLowerCase()} in your team.</div>
                ) : (
                  <div className="space-y-1">
                    {players.slice(0, 3).map((player: any) => (
                      <div key={player.player_id || player.id} className="text-xs md:text-sm font-medium text-[#424242] truncate hover:text-[#2E7D32] transition-colors duration-200">
                        {player.name || player.player_name}
                      </div>
                    ))}
                    {players.length > 3 && (
                      <div className="text-xs text-[#424242]/60">+{players.length - 3} more</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
