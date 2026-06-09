"use client"

import React, { useEffect, useState, useCallback } from "react";
import { marketApi } from "@/services/api";
import { useTeam } from "@/contexts/TeamContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency } from "@/utils";
import { TEAM_CONSTRAINTS, ROUTES } from "@/constants";
import type { PlayerFilters, MarketListing } from "@/interfaces";
import {
  List,
  ShoppingCart,
  RefreshCw,
  DollarSign,
  Users,
  Search,
  AlertTriangle,
  TrendingDown,
  Tag,
} from "lucide-react";

// ─── Stat pill ──────────────────────────────────────────────────────────────
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
        <p className="text-xs text-[#424242]/60">{label}</p>
        <p className="text-base font-bold text-[#212121]">{value}</p>
      </div>
    </div>
  );
}

// ─── Market card ─────────────────────────────────────────────────────────────
function MarketCard({
  listing,
  isOwned,
  canBuy,
  onBuy,
  onRemove,
}: {
  listing: MarketListing;
  isOwned: boolean;
  canBuy: boolean;
  onBuy: (l: MarketListing) => void;
  onRemove: (l: MarketListing) => void;
}) {
  const sellerDisplay = (() => {
    const name = listing.sellerTeamName || "";
    if (name.includes("@")) return name.split("@")[0];
    if (name.includes("'s team")) return name.replace("'s team", "");
    return name || "Unknown";
  })();

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm hover:shadow-md hover:border-[#2E7D32]/30 transition-all duration-200 overflow-hidden">
      {/* Position badge strip */}
      <div
        className={`h-1 w-full ${
          listing.position === "Goalkeeper"
            ? "bg-[#2E7D32]"
            : listing.position === "Defender"
            ? "bg-[#1976D2]"
            : listing.position === "Midfielder"
            ? "bg-[#43A047]"
            : "bg-[#FF9800]"
        }`}
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h3
              className="font-semibold text-sm text-[#212121] truncate"
              title={listing.playerName}
            >
              {listing.playerName}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${
                listing.position === "Goalkeeper"
                  ? "bg-[#E8F5E9] text-[#2E7D32]"
                  : listing.position === "Defender"
                  ? "bg-[#E3F2FD] text-[#1976D2]"
                  : listing.position === "Midfielder"
                  ? "bg-[#E8F5E9] text-[#43A047]"
                  : "bg-[#FFF3E0] text-[#FF9800]"
              }`}
            >
              {listing.position}
            </span>
          </div>
          {isOwned && (
            <span className="flex-shrink-0 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
              Yours
            </span>
          )}
        </div>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#424242]/50">Asking price</span>
            <span className="text-[#424242]">
              {listing.price != null ? formatCurrency(listing.price / TEAM_CONSTRAINTS.MARKET_DISCOUNT) : "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#424242]/50">Buy for (95%)</span>
            <span className="font-bold text-[#2E7D32]">
              {listing.price != null ? formatCurrency(listing.price) : "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#424242]/50">Seller</span>
            <span className="text-[#424242] truncate max-w-[110px]" title={sellerDisplay}>
              {sellerDisplay}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#424242]/50">Listed</span>
            <span className="text-[#424242]">
              {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : "—"}
            </span>
          </div>
        </div>

        {isOwned ? (
          <Button
            className="w-full text-xs py-2 h-8 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
            onClick={() => onRemove(listing)}
          >
            Remove from Market
          </Button>
        ) : (
          <Button
            className={`w-full text-xs py-2 h-8 transition-colors ${
              canBuy
                ? "bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                : "bg-[#E0E0E0] text-[#424242]/50 cursor-not-allowed"
            }`}
            onClick={() => canBuy && onBuy(listing)}
            disabled={!canBuy}
          >
            {canBuy
              ? `Buy — ${listing.price != null ? formatCurrency(listing.price) : "N/A"}`
              : "Cannot buy"}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export function MarketPage() {
  const { team, setTeam } = useTeam();
  const { user } = useAuth();

  const [filters, setFilters] = useState<PlayerFilters>({
    name: "",
    team: "",
    minValue: undefined,
    maxValue: undefined,
  });
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"market" | "my">("market");

  // Buy modal
  const [confirmBuyModal, setConfirmBuyModal] = useState(false);
  const [playerToBuy, setPlayerToBuy] = useState<MarketListing | null>(null);
  const [buying, setBuying] = useState(false);

  // Remove modal
  const [confirmRemoveModal, setConfirmRemoveModal] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState<MarketListing | null>(null);
  const [removing, setRemoving] = useState(false);

  const debouncedFilters = useDebounce(filters, 500);

  const teamSize = team?.players?.length || 0;

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await marketApi.getMarketPlayers({
        name: filters.name,
        minPrice: filters.minValue,
        maxPrice: filters.maxValue,
        my: activeTab === "my",
      });
      setListings(res.data || []);
    } catch {
      setError("Failed to load market listings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters.name, filters.minValue, filters.maxValue, activeTab]);

  useEffect(() => {
    fetchListings();
  }, [debouncedFilters, activeTab]);

  // Client-side filter by seller name (text entered in "seller" field)
  const filteredListings = listings.filter((l) => {
    if (!filters.team) return true;
    const sellerName = (l.sellerTeamName || "").toLowerCase();
    return sellerName.includes(filters.team.toLowerCase());
  });

  const canBuyListing = (listing: MarketListing) =>
    !!team &&
    teamSize < TEAM_CONSTRAINTS.MAX_PLAYERS &&
    team.budget >= (listing.price ?? Infinity);

  // ── Buy handlers ──
  const handleBuy = (listing: MarketListing) => {
    if (teamSize >= TEAM_CONSTRAINTS.MAX_PLAYERS) {
      toast({ title: "Team Full", description: "Sell a player before buying.", variant: "destructive" });
      return;
    }
    if (!team || team.budget < (listing.price ?? Infinity)) {
      toast({ title: "Insufficient Budget", description: "You can't afford this player.", variant: "destructive" });
      return;
    }
    setPlayerToBuy(listing);
    setConfirmBuyModal(true);
  };

  const confirmBuy = async () => {
    if (!playerToBuy) return;
    setBuying(true);
    try {
      const res = await marketApi.buyPlayer(playerToBuy.playerId);
      setTeam(res.data);
      toast({
        title: "Player Signed!",
        description: `${playerToBuy.playerName} joined your team for ${formatCurrency(playerToBuy.price)}.`,
        variant: "success",
        duration: 3000,
      });
      fetchListings();
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Purchase failed", variant: "destructive" });
    } finally {
      setBuying(false);
      setConfirmBuyModal(false);
      setPlayerToBuy(null);
    }
  };

  // ── Remove handlers ──
  const handleRemove = (listing: MarketListing) => {
    setPlayerToRemove(listing);
    setConfirmRemoveModal(true);
  };

  const confirmRemove = async () => {
    if (!playerToRemove) return;
    setRemoving(true);
    try {
      const res = await marketApi.removeFromMarket(playerToRemove.playerId);
      setTeam(res.data);
      toast({
        title: "Listing Removed",
        description: `${playerToRemove.playerName} is no longer on the market.`,
        variant: "success",
        duration: 3000,
      });
      fetchListings();
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to remove listing", variant: "destructive" });
    } finally {
      setRemoving(false);
      setConfirmRemoveModal(false);
      setPlayerToRemove(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#212121]">Transfer Market</h1>
        <p className="text-sm text-[#424242]/60 mt-1">
          Players sell at 95% of their asking price
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatPill icon={Users} label="Your squad" value={`${teamSize} / ${TEAM_CONSTRAINTS.MAX_PLAYERS}`} color="bg-[#2E7D32]" />
        <StatPill icon={DollarSign} label="Budget" value={formatCurrency(team?.budget ?? TEAM_CONSTRAINTS.DEFAULT_BUDGET)} color="bg-[#1976D2]" />
        <StatPill icon={Tag} label="Listings shown" value={filteredListings.length} color="bg-[#FF9800]" />
        <StatPill icon={ShoppingCart} label="Mode" value={activeTab === "my" ? "My listings" : "Browse"} color="bg-[#7B1FA2]" />
      </div>

      {/* Warnings */}
      {teamSize >= TEAM_CONSTRAINTS.MAX_PLAYERS && activeTab === "market" && (
        <div className="mb-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Your squad is full ({TEAM_CONSTRAINTS.MAX_PLAYERS} players). Sell a player before buying.
          </p>
        </div>
      )}
      {team && team.budget < 50000 && teamSize < TEAM_CONSTRAINTS.MAX_PLAYERS && activeTab === "market" && (
        <div className="mb-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <TrendingDown className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Low budget ({formatCurrency(team.budget)}). Consider listing players to raise funds.
          </p>
        </div>
      )}

      {/* Tabs + refresh */}
      <div className="flex items-center gap-3 mb-5">
        {(["market", "my"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeTab === tab
                ? "bg-[#2E7D32] text-white shadow-sm"
                : "bg-white text-[#424242] border border-[#E0E0E0] hover:border-[#2E7D32]/40"
            }`}
          >
            {tab === "market" ? (
              <><ShoppingCart className="w-3.5 h-3.5" /> Market</>
            ) : (
              <><List className="w-3.5 h-3.5" /> My Listings</>
            )}
          </button>
        ))}
        <button
          onClick={fetchListings}
          disabled={loading}
          className="ml-auto p-2 rounded-full hover:bg-[#E8F5E9] transition-colors border border-[#E0E0E0] bg-white"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 text-[#2E7D32] ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-[#E0E0E0] rounded-xl p-4 mb-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#424242]/40" />
            <Input
              placeholder="Player name…"
              value={filters.name || ""}
              onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
              className="pl-9 border-[#E0E0E0] focus:border-[#2E7D32] text-sm"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#424242]/40" />
            <Input
              placeholder="Seller name…"
              value={filters.team || ""}
              onChange={(e) => setFilters((f) => ({ ...f, team: e.target.value }))}
              className="pl-9 border-[#E0E0E0] focus:border-[#2E7D32] text-sm"
            />
          </div>
          <Input
            type="number"
            placeholder="Min buy price"
            value={filters.minValue ?? ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                minValue: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="border-[#E0E0E0] focus:border-[#2E7D32] text-sm"
          />
          <Input
            type="number"
            placeholder="Max buy price"
            value={filters.maxValue ?? ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                maxValue: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="border-[#E0E0E0] focus:border-[#2E7D32] text-sm"
          />
        </div>
      </div>

      {/* Listings */}
      {loading ? (
        <LoadingState message="Loading listings…" />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-3">{error}</p>
          <Button onClick={fetchListings} className="bg-[#2E7D32] text-white hover:bg-[#1B5E20]">
            Try again
          </Button>
        </div>
      ) : filteredListings.length === 0 ? (
        <EmptyState
          title={activeTab === "my" ? "No active listings" : "No players available"}
          description={
            activeTab === "my"
              ? "List players from your team to sell them here."
              : "Check back later or adjust your filters."
          }
          actionText={activeTab === "my" ? "Manage Team" : undefined}
          actionLink={activeTab === "my" ? ROUTES.TEAM : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredListings.map((listing) => (
            <MarketCard
              key={listing.id}
              listing={listing}
              isOwned={activeTab === "my"}
              canBuy={canBuyListing(listing)}
              onBuy={handleBuy}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {/* Buy Confirmation Modal */}
      <Modal isOpen={confirmBuyModal} onClose={() => setConfirmBuyModal(false)} title="Confirm Purchase">
        <div className="mb-5 space-y-3">
          <p className="text-sm text-[#424242]">
            Sign{" "}
            <span className="font-semibold text-[#212121]">{playerToBuy?.playerName}</span>{" "}
            from{" "}
            <span className="font-medium">
              {playerToBuy?.sellerTeamName || "Unknown Team"}
            </span>
            ?
          </p>
          <div className="bg-[#F7F8FA] rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#424242]/60">Asking price</span>
              <span>{playerToBuy ? formatCurrency(playerToBuy.price / TEAM_CONSTRAINTS.MARKET_DISCOUNT) : "—"}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#424242]/60">You pay (95%)</span>
              <span className="font-bold text-[#2E7D32]">
                {playerToBuy ? formatCurrency(playerToBuy.price) : "—"}
              </span>
            </div>
            <div className="flex justify-between text-xs border-t border-[#E0E0E0] pt-2 mt-2">
              <span className="text-[#424242]/60">Budget after</span>
              <span className={`font-semibold ${((team?.budget || 0) - (playerToBuy?.price || 0)) < 0 ? "text-red-600" : ""}`}>
                {formatCurrency((team?.budget || 0) - (playerToBuy?.price || 0))}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-[#E0E0E0] hover:bg-[#BDBDBD] text-[#424242]"
            onClick={() => setConfirmBuyModal(false)}
            disabled={buying}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
            onClick={confirmBuy}
            disabled={buying}
          >
            {buying ? "Signing…" : "Confirm Purchase"}
          </Button>
        </div>
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal isOpen={confirmRemoveModal} onClose={() => setConfirmRemoveModal(false)} title="Remove Listing">
        <div className="mb-5">
          <p className="text-sm text-[#424242]">
            Remove{" "}
            <span className="font-semibold text-[#212121]">{playerToRemove?.playerName}</span>{" "}
            from the market? The player will return to your squad.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-[#E0E0E0] hover:bg-[#BDBDBD] text-[#424242]"
            onClick={() => setConfirmRemoveModal(false)}
            disabled={removing}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={confirmRemove}
            disabled={removing}
          >
            {removing ? "Removing…" : "Remove Listing"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
