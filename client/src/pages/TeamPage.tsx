import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatTeamNameFromEmail } from "@/utils";
import { useTeam } from "@/contexts/TeamContext";
import { useAuth } from "@/contexts/AuthContext";
import { marketApi, teamApi } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { TEAM_CONSTRAINTS, ROUTES, POSITION_CONFIG } from "@/constants";
import type { PlayerWithId } from "@/interfaces";
import {
  DollarSign,
  Users,
  ShoppingCart,
  Tag,
  AlertTriangle,
  Trophy,
} from "lucide-react";

function StatPill({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm px-4 py-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs text-[#424242]/60 leading-none">{label}</p>
        <p className="text-base font-bold text-[#212121] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function PlayerCard({
  player,
  onListForSale,
  disabled,
}: {
  player: PlayerWithId;
  onListForSale: (player: PlayerWithId) => void;
  disabled: boolean;
}) {
  const name = player.name || player.player_name || "Unknown Player";
  const isListed = !!(player as any).in_transfer_market;
  const value = player.value || 0;
  const askingPrice = (player as any).asking_price;

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm transition-all duration-200 overflow-hidden ${
        isListed
          ? "border-orange-200 bg-orange-50/30"
          : "border-[#E0E0E0] hover:shadow-md hover:border-[#2E7D32]/30"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h3
              className={`font-semibold text-sm truncate ${
                isListed ? "text-orange-800" : "text-[#212121]"
              }`}
              title={name}
            >
              {name}
            </h3>
            <p className="text-xs text-[#424242]/60 mt-0.5">{player.position}</p>
          </div>
          {isListed && (
            <span className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full border border-orange-200">
              Listed
            </span>
          )}
        </div>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#424242]/50">Market Value</span>
            <span className="font-semibold text-[#2E7D32]">{formatCurrency(value)}</span>
          </div>
          {isListed && askingPrice && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#424242]/50">Listed at</span>
              <span className="font-semibold text-orange-600">
                {formatCurrency(parseInt(askingPrice))}
              </span>
            </div>
          )}
          {player.age && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#424242]/50">Age</span>
              <span className="text-[#424242]">{player.age} yrs</span>
            </div>
          )}
          {player.nationality && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#424242]/50">Nationality</span>
              <span className="text-[#424242] truncate max-w-[100px]">{player.nationality}</span>
            </div>
          )}
        </div>

        <Button
          className={`w-full text-xs py-2 h-8 transition-all duration-200 ${
            isListed
              ? "bg-orange-100 text-orange-700 border border-orange-300 cursor-default hover:bg-orange-100"
              : disabled
              ? "bg-[#E0E0E0] text-[#424242]/50 cursor-not-allowed"
              : "bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
          }`}
          onClick={() => !isListed && !disabled && onListForSale(player)}
          disabled={isListed || disabled}
        >
          {isListed ? "On Market" : "List for Sale"}
        </Button>
      </div>
    </div>
  );
}

export function TeamPage() {
  const { team, setTeam } = useTeam();
  const { user } = useAuth();
  const [loading] = useState(false);
  const [error] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithId | null>(null);
  const [listingPrice, setListingPrice] = useState("");
  const [listingLoading, setListingLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [activePosition, setActivePosition] = useState<string>("All");

  const userPlayers: PlayerWithId[] = team?.players || [];
  const availablePlayers = userPlayers.filter((p) => !(p as any).in_transfer_market);
  const listedPlayers = userPlayers.filter((p) => (p as any).in_transfer_market);
  const totalValue = userPlayers.reduce((s, p) => s + (p.value || 0), 0);

  // Silent refresh every 10 s to catch sales by other users
  useEffect(() => {
    const interval = setInterval(() => {
      if (team) {
        teamApi
          .getMyTeam()
          .then((r) => { if (r.success && r.data) setTeam(r.data); })
          .catch(() => {});
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [team, setTeam]);

  const positions = ["All", ...POSITION_CONFIG.map((p) => p.key)];

  const displayedPlayers =
    activePosition === "All"
      ? userPlayers
      : userPlayers.filter((p) => p.position === activePosition);

  const handleOpenListing = (player: PlayerWithId) => {
    if (availablePlayers.length <= TEAM_CONSTRAINTS.MIN_PLAYERS) {
      toast({
        title: "Cannot List Player",
        description: `You need at least ${TEAM_CONSTRAINTS.MIN_PLAYERS} available players. Listing would drop you below that.`,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setSelectedPlayer(player);
    setListingPrice("");
    setValidationError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPlayer(null);
    setListingPrice("");
    setValidationError("");
  };

  const validatePrice = (price: string): boolean => {
    if (!price || !price.trim()) {
      setValidationError("Please enter a price");
      return false;
    }
    const n = parseFloat(price);
    if (isNaN(n) || n <= 0) {
      setValidationError("Please enter a valid amount greater than $0");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleListPlayer = async () => {
    if (!selectedPlayer || !validatePrice(listingPrice)) return;

    setListingLoading(true);
    try {
      const playerId = selectedPlayer.id || selectedPlayer.player_id;
      const numericId = typeof playerId === "string" ? parseInt(playerId, 10) : playerId;
      if (!numericId || isNaN(numericId as number)) {
        toast({ title: "Error", description: "Invalid player ID", variant: "destructive" });
        return;
      }

      const res = await marketApi.listPlayerForSale(numericId as number, listingPrice);
      if (res?.success) {
        if (res.data) setTeam(res.data);
        toast({
          title: "Player Listed!",
          description: `${selectedPlayer.name || selectedPlayer.player_name} listed for ${formatCurrency(parseInt(listingPrice))}. Buyers pay ${formatCurrency(Math.floor(parseInt(listingPrice) * 0.95))}.`,
          variant: "success",
          duration: 3000,
        });
        closeModal();
      } else {
        toast({ title: "Error", description: res?.message || "Failed to list player", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to list player", variant: "destructive" });
    } finally {
      setListingLoading(false);
    }
  };

  const minReached = availablePlayers.length <= TEAM_CONSTRAINTS.MIN_PLAYERS;

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-4 py-6 sm:py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#212121]">My Team</h1>
        <p className="text-sm text-[#424242]/60 mt-1">
          {formatTeamNameFromEmail(user?.email || "")}
        </p>
      </div>

      {loading ? (
        <LoadingState message="Loading your team..." />
      ) : error ? (
        <div className="text-[#D32F2F] text-center py-8">{error}</div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatPill
              icon={Users}
              label="Squad size"
              value={`${userPlayers.length} / ${TEAM_CONSTRAINTS.MAX_PLAYERS}`}
              color="bg-[#2E7D32]"
            />
            <StatPill
              icon={DollarSign}
              label="Budget"
              value={formatCurrency(team?.budget || 0)}
              color="bg-[#1976D2]"
            />
            <StatPill
              icon={Trophy}
              label="Squad value"
              value={formatCurrency(totalValue)}
              color="bg-[#FF9800]"
            />
            <StatPill
              icon={Tag}
              label="Listed"
              value={`${listedPlayers.length} players`}
              color="bg-[#E53935]"
            />
          </div>

          {/* Min players warning */}
          {minReached && (
            <div className="mb-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                You've reached the minimum squad size ({TEAM_CONSTRAINTS.MIN_PLAYERS} available
                players). You must buy a player before listing more.
              </p>
            </div>
          )}

          {/* Position filter tabs */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {positions.map((pos) => {
              const count =
                pos === "All"
                  ? userPlayers.length
                  : userPlayers.filter((p) => p.position === pos).length;
              return (
                <button
                  key={pos}
                  onClick={() => setActivePosition(pos)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    activePosition === pos
                      ? "bg-[#2E7D32] text-white shadow-sm"
                      : "bg-white text-[#424242] border border-[#E0E0E0] hover:border-[#2E7D32]/40 hover:bg-[#F5F5F5]"
                  }`}
                >
                  {pos}{" "}
                  <span
                    className={`${
                      activePosition === pos ? "text-white/80" : "text-[#424242]/50"
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
            <div className="ml-auto flex items-center gap-2">
              <Link
                to={ROUTES.MARKET}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E7D32] text-white text-xs font-semibold rounded-full hover:bg-[#1B5E20] transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Transfer Market
              </Link>
            </div>
          </div>

          {/* Players grid */}
          {displayedPlayers.length === 0 ? (
            <EmptyState
              title={activePosition === "All" ? "No players in your team" : `No ${activePosition}s`}
              description={
                activePosition === "All"
                  ? "Visit the transfer market to build your squad."
                  : `You don't have any ${activePosition.toLowerCase()}s yet.`
              }
              actionText="Go to Market"
              actionLink={ROUTES.MARKET}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {displayedPlayers.map((player) => (
                <PlayerCard
                  key={player.id || player.player_id}
                  player={player}
                  onListForSale={handleOpenListing}
                  disabled={minReached && !(player as any).in_transfer_market}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* List for Sale Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={`List ${selectedPlayer?.name || selectedPlayer?.player_name || "Player"} for Sale`}
      >
        <div className="mb-5">
          {selectedPlayer?.value && (
            <div className="bg-[#F5F5F5] rounded-lg p-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-[#424242]/70">Market value</span>
              <span className="font-semibold text-[#2E7D32]">
                {formatCurrency(selectedPlayer.value)}
              </span>
            </div>
          )}
          <label className="block text-sm font-medium mb-2 text-[#424242]">
            Your asking price ($)
          </label>
          <Input
            type="number"
            min={1}
            value={listingPrice}
            onChange={(e) => {
              setListingPrice(e.target.value);
              if (validationError) setValidationError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleListPlayer();
            }}
            className={`w-full border ${
              validationError
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-[#2E7D32]"
            }`}
            placeholder="Enter asking price"
          />
          {validationError && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {validationError}
            </p>
          )}
          {listingPrice && !validationError && parseFloat(listingPrice) > 0 && (
            <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-lg">
              <p className="text-xs text-[#424242]/70">
                Buyers will pay{" "}
                <span className="font-semibold text-[#2E7D32]">
                  {formatCurrency(Math.floor(parseFloat(listingPrice) * 0.95))}
                </span>{" "}
                (95% of your asking price)
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            className="flex-1 bg-[#E0E0E0] hover:bg-[#BDBDBD] text-[#424242]"
            onClick={closeModal}
            disabled={listingLoading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleListPlayer}
            disabled={listingLoading || !listingPrice || !!validationError}
          >
            {listingLoading ? "Listing…" : "List Player"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
