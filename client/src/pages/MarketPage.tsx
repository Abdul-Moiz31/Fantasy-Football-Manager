"use client"

import React, { useEffect, useState } from "react";
import { marketApi } from "@/services/api";
import { useTeam } from "@/contexts/TeamContext";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { TabGroup } from "@/components/ui/TabGroup";
import { MarketListingCard } from "@/components/ui/MarketListingCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { toast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { List, ShoppingCart, RefreshCw } from "lucide-react";
import { TEAM_CONSTRAINTS, COLORS, ROUTES } from "@/constants";
import type { PlayerFilters, MarketListing } from "@/interfaces";

export function MarketPage() {
  const { team, setTeam } = useTeam();
  const { user } = useAuth();
  const [filters, setFilters] = useState<PlayerFilters>({ name: "", team: "", minValue: undefined, maxValue: undefined });
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"my" | "market">("market");
  const [confirmRemoveModal, setConfirmRemoveModal] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState<MarketListing | null>(null);
  const [removing, setRemoving] = useState(false);
  const [confirmBuyModal, setConfirmBuyModal] = useState(false);
  const [playerToBuy, setPlayerToBuy] = useState<MarketListing | null>(null);
  const [buying, setBuying] = useState(false);

  const debouncedFilters = useDebounce(filters, 500);

  const userListings = listings.filter(l => l.userId === user?.id);
  const effectiveTeamSize = team?.players?.length || 0; // Listed players are already included in team.players

  const tabs = [
    {
      id: "my",
      label: "My Listings",
      shortLabel: "My",
      icon: <List className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      id: "market",
      label: "Market Listings",
      shortLabel: "Market",
      icon: <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
    }
  ];

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await marketApi.getMarketPlayers({
        name: filters.name,
        team: filters.team,
        minPrice: filters.minValue,
        maxPrice: filters.maxValue,
        my: activeTab === "my"
      });
      setListings(res.data || []);
    } catch (err) {
      setError("Failed to load market listings");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchListings();
  };

  useEffect(() => {
    fetchListings();
  }, [debouncedFilters, activeTab]);

  const handleBuy = async (listing: MarketListing) => {
    if (effectiveTeamSize >= TEAM_CONSTRAINTS.MAX_PLAYERS) {
      toast({
        title: "Team Size Limit Reached",
        description: `You can't buy any more players because your effective team size (${effectiveTeamSize}/${TEAM_CONSTRAINTS.MAX_PLAYERS}) would exceed the limit.`,
        variant: "destructive"
      });
      return;
    }
    
    if (!team || team.budget < (listing.price ?? Infinity)) {
      toast({
        title: "Insufficient Budget",
        description: `You don't have enough budget to buy this player.`,
        variant: "destructive"
      });
      return;
    }
    
    setPlayerToBuy(listing);
    setConfirmBuyModal(true);
  };

  const confirmBuyPlayer = async () => {
    if (!playerToBuy) return;
    
    setBuying(true);
    try {
      const res = await marketApi.buyPlayer(playerToBuy.playerId);
      setTeam(res.data);
      toast({
        title: "Player Bought Successfully!",
        description: `Bought ${playerToBuy.playerName} for $${playerToBuy.price.toLocaleString()}. New budget: $${res.data.budget.toLocaleString()}`,
        variant: "success",
        duration: 3000
      });
      fetchListings();
      setConfirmBuyModal(false);
      setPlayerToBuy(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to buy player",
        variant: "destructive"
      });
    } finally {
      setBuying(false);
    }
  };

  const cancelBuyPlayer = () => {
    setConfirmBuyModal(false);
    setPlayerToBuy(null);
  };

  const handleSell = async (listing: MarketListing) => {
    if (effectiveTeamSize <= TEAM_CONSTRAINTS.MIN_PLAYERS) {
      toast({
        title: "Cannot Remove Player",
        description: `You can't remove this player because your effective team size (${effectiveTeamSize}/${TEAM_CONSTRAINTS.MIN_PLAYERS}) would be below the minimum.`,
        variant: "destructive"
      });
      return;
    }
    
    setPlayerToRemove(listing);
    setConfirmRemoveModal(true);
  };

  const confirmRemovePlayer = async () => {
    if (!playerToRemove) return;
    
    setRemoving(true);
    try {
      const res = await marketApi.removeFromMarket(playerToRemove.playerId);
      setTeam(res.data);
      toast({
        title: "Player Removed Successfully!",
        description: `${playerToRemove.playerName} has been removed from the market.`,
        variant: "success",
        duration: 3000
      });
      fetchListings();
      setConfirmRemoveModal(false);
      setPlayerToRemove(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to remove listing",
        variant: "destructive"
      });
    } finally {
      setRemoving(false);
    }
  };

  const cancelRemovePlayer = () => {
    setConfirmRemoveModal(false);
    setPlayerToRemove(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#424242] mb-2">Market Place</h1>
        <p className="text-[#424242]/70">Buy and sell players at {TEAM_CONSTRAINTS.MARKET_DISCOUNT * 100}% of their value</p>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <StatCard
          title="Team Size"
          value={`${effectiveTeamSize}/${TEAM_CONSTRAINTS.MAX_PLAYERS}`}
        />
        <StatCard
          title="Budget"
          value={`$${(team?.budget ?? TEAM_CONSTRAINTS.DEFAULT_BUDGET).toLocaleString()}`}
        />
        <StatCard
          title="Market Actions"
          value={activeTab === "my" ? "My Listings" : "Buy & Sell"}
        />
      </div>

      {/* Responsive Tabs */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <TabGroup
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as "my" | "market")}
          />
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 hover:bg-[#E8F5E9] rounded-full transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-[#2E7D32] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Responsive Filter Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-[#E0E0E0] shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Input
              placeholder="Search by player name..."
              value={filters.name || ""}
              onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
              className="w-full border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-[#2E7D32]"
            />
            <Input
              placeholder="Filter by team..."
              value={filters.team || ""}
              onChange={e => setFilters(f => ({ ...f, team: e.target.value }))}
              className="w-full border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-[#2E7D32]"
            />
            <Input
              type="number"
              placeholder="Min price"
              value={filters.minValue ?? ""}
              onChange={e => setFilters(f => ({ ...f, minValue: e.target.value ? Number(e.target.value) : undefined }))}
              className="w-full border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-[#2E7D32]"
            />
            <Input
              type="number"
              placeholder="Max price"
              value={filters.maxValue ?? ""}
              onChange={e => setFilters(f => ({ ...f, maxValue: e.target.value ? Number(e.target.value) : undefined }))}
              className="w-full border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-[#2E7D32]"
            />
          </div>
        </div>
      </div>

      {/* Team Full Warning Banner */}
      {effectiveTeamSize >= TEAM_CONSTRAINTS.MAX_PLAYERS && activeTab === "market" && (
        <div className="mb-4 sm:mb-6">
          <div className="bg-[#FFF3CD] border border-[#FFEAA7] rounded-lg p-3 sm:p-4 flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-[#856404] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-[#856404] mb-1">
                Team Size Limit Reached
              </h3>
              <p className="text-sm text-[#856404]">
                You already have {effectiveTeamSize} players. You must sell a player before buying more. 
                <span className="font-medium"> Maximum allowed: {TEAM_CONSTRAINTS.MAX_PLAYERS} players.</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Low Budget Warning Banner */}
      {team && team.budget < 50000 && activeTab === "market" && effectiveTeamSize < TEAM_CONSTRAINTS.MAX_PLAYERS && (
        <div className="mb-4 sm:mb-6">
          <div className="bg-[#FFF3CD] border border-[#FFEAA7] rounded-lg p-3 sm:p-4 flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-[#856404] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-[#856404] mb-1">
                Low Budget Warning
              </h3>
              <p className="text-sm text-[#856404]">
                Your current budget is ${team.budget.toLocaleString()}. You may not be able to afford many players. 
                <span className="font-medium"> Consider selling some players to increase your budget.</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Player Cards Grid */}
      {loading ? (
        <LoadingState message="Loading market listings..." />
      ) : error ? (
        <div className="text-[#E53935] text-center py-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {listings.length === 0 ? (
            <EmptyState
              title={activeTab === "my" ? "No players listed for sale" : "No players available"}
              description={
                activeTab === "my"
                  ? "You haven't listed any players for sale yet."
                  : "Check back later for new listings."
              }
            />
          ) : (
            listings.map(listing => (
              <MarketListingCard
                key={listing.id}
                listing={listing}
                isOwned={activeTab === "my"}
                onBuy={handleBuy}
                onSell={handleSell}
                disabled={!team || effectiveTeamSize >= TEAM_CONSTRAINTS.MAX_PLAYERS || team.budget < (listing.price ?? Infinity)}
              />
            ))
          )}
        </div>
      )}

      {/* Remove Player Confirmation Modal */}
      <Modal
        isOpen={confirmRemoveModal}
        onClose={cancelRemovePlayer}
        title="Remove Player from Market"
      >
        <div className="mb-6">
          <p className="text-[#424242] mb-4">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-[#2E7D32]">
              {playerToRemove?.playerName}
            </span>{" "}
            from the market?
          </p>
          <p className="text-sm text-[#424242]/70">
            This action will make the player unavailable for purchase by other users.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            onClick={cancelRemovePlayer}
            className="flex-1 bg-[#E0E0E0] hover:bg-[#BDBDBD] text-[#424242] border border-[#E0E0E0]"
            disabled={removing}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmRemovePlayer}
            className="flex-1 bg-[#E53935] hover:bg-[#C62828] text-white"
            disabled={removing}
          >
            {removing ? "Removing..." : "Yes, Remove"}
          </Button>
        </div>
      </Modal>

      {/* Buy Player Confirmation Modal */}
      <Modal
        isOpen={confirmBuyModal}
        onClose={cancelBuyPlayer}
        title="Confirm Purchase"
      >
        <div className="mb-6">
          <p className="text-[#424242] mb-4">
            Are you sure you want to buy{" "}
            <span className="font-semibold text-[#2E7D32]">
              {playerToBuy?.playerName}
            </span>{" "}
            for ${playerToBuy?.price?.toLocaleString() || '0'}?
          </p>
          <div className="bg-[#F5F5F5] p-3 rounded-lg mb-3">
            <div className="text-sm text-[#424242]">
              <div className="flex justify-between mb-1">
                <span>Asking Price:</span>
                <span className="font-medium">${Math.floor((playerToBuy?.price || 0) / 0.95).toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Your Price (95%):</span>
                <span className="font-semibold text-[#2E7D32]">${playerToBuy?.price?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining Budget:</span>
                <span>${((team?.budget || 0) - (playerToBuy?.price || 0)).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-[#424242]/70">
            This purchase will be deducted from your account budget.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            onClick={cancelBuyPlayer}
            className="flex-1 bg-[#E0E0E0] hover:bg-[#BDBDBD] text-[#424242] border border-[#E0E0E0]"
            disabled={buying}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmBuyPlayer}
            className="flex-1 bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white"
            disabled={buying}
          >
            {buying ? "Buying..." : "Yes, Buy"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
