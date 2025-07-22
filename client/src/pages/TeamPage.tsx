import React, { useState, useEffect } from "react";
import { StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TeamPlayerCard } from "@/components/ui/TeamPlayerCard";
import { Modal } from "@/components/ui/Modal";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatTeamNameFromEmail } from "@/utils";
import { useTeam } from "@/contexts/TeamContext";
import { useAuth } from "@/contexts/AuthContext";
import { marketApi } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { TEAM_CONSTRAINTS, ROUTES } from "@/constants";
import type { PlayerWithId } from "@/interfaces";
import { teamApi } from "@/services/api";

export function TeamPage() {
  const { team, setTeam } = useTeam();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithId | null>(null);
  const [listingPrice, setListingPrice] = useState("");
  const [listingLoading, setListingLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [validationError, setValidationError] = useState("");
  const [lastKnownBudget, setLastKnownBudget] = useState<number | null>(null);

  useEffect(() => {
    if (team?.budget !== undefined) {
      if (lastKnownBudget !== null && team.budget > lastKnownBudget) {
        const profit = team.budget - lastKnownBudget;
        toast({
          title: "Player Sold!",
          description: `One of your players was sold for $${profit.toLocaleString()}`,
          variant: "success",
          duration: 3000
        });
      }
      setLastKnownBudget(team.budget);
    }
  }, [team?.budget, lastKnownBudget]);

  // Periodically refresh team data to detect player sales
  useEffect(() => {
    const interval = setInterval(() => {
      if (team) {
        // Refresh team data silently
        teamApi.getMyTeam().then(response => {
          if (response.success && response.data) {
            setTeam(response.data);
          }
        }).catch(() => {
          // Silent fail - don't show error for background refresh
        });
      }
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [team, setTeam]);

  const userPlayers = team?.players || [];
  const availablePlayers = userPlayers.filter((player: PlayerWithId) => !player.in_transfer_market);
  const listedPlayers = userPlayers.filter((player: PlayerWithId) => player.in_transfer_market);
  const effectiveAvailableCount = availablePlayers.length;

  const handleOpenListing = (player: PlayerWithId) => {
    if (effectiveAvailableCount === TEAM_CONSTRAINTS.MIN_PLAYERS) {
      toast({
        title: "Cannot List Player",
        description: `You cannot list any more players because you have reached the minimum count.`,
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    setSelectedPlayer(player);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPlayer(null);
    setListingPrice("");
    setSuccessMsg("");
    setValidationError("");
  };

  const validatePrice = (price: string): boolean => {
    setValidationError("");
    
    if (!price || price.trim() === "") {
      setValidationError("Please enter a price");
      return false;
    }
    
    const numericPrice = parseFloat(price);
    
    if (isNaN(numericPrice)) {
      setValidationError("Please enter a valid number");
      return false;
    }
    
    if (numericPrice <= 0) {
      setValidationError("Please enter a valid amount greater than $0");
      return false;
    }
    
    return true;
  };

  const handlePriceChange = (value: string) => {
    setListingPrice(value);
    if (value && validationError) {
      // Clear validation error when user starts typing
      setValidationError("");
    }
  };

  const handleListPlayer = async () => {
    if (!selectedPlayer || !validatePrice(listingPrice)) return;
    
    setListingLoading(true);
    setError("");
    try {
      const playerId = selectedPlayer.id || selectedPlayer.player_id;
      if (!playerId) {
        setError("Invalid player ID");
        return;
      }      
      const numericPlayerId = typeof playerId === 'string' ? parseInt(playerId, 10) : playerId;
      if (isNaN(numericPlayerId)) {
        setError("Invalid player ID format");
        return;
      }
      const res = await marketApi.listPlayerForSale(numericPlayerId, listingPrice);
      
      if (res?.success) {
        setSuccessMsg("Player listed successfully!");
        
        if (setTeam && team) {
          const updatedTeam = {
            ...team,
            players: team.players.map((player: PlayerWithId) => {
              const playerIdToCheck = player.id || player.player_id;
              const playerIdToMatch = typeof playerIdToCheck === 'string' ? 
                parseInt(playerIdToCheck, 10) : playerIdToCheck;
              
              if (playerIdToMatch === numericPlayerId) {
                return {
                  ...player,
                  in_transfer_market: true,
                  asking_price: parseInt(listingPrice)
                };
              }
              return player;
            })
          };
          setTeam(updatedTeam);
        }
        
        // Also set from API response if available
        if (res.data) {
          setTeam && setTeam(res.data);
        }
        
        toast({
          title: "Player Listed Successfully!",
          description: `${selectedPlayer.name || selectedPlayer.player_name} listed for $${parseInt(listingPrice).toLocaleString()} (buyers pay ${Math.floor(parseInt(listingPrice) * 0.95).toLocaleString()})`,
          variant: "success",
          duration: 3000
        });
        setTimeout(() => closeModal(), 500);
      } else {
        setError(res?.message || "Failed to list player");
        toast({
          title: "Error",
          description: res?.message || "Failed to list player",
          variant: "destructive"
        });
      }
    } catch (err) {
      setError("Failed to list player");
      toast({
        title: "Error",
        description: "Failed to list player",
        variant: "destructive"
      });
    } finally {
      setListingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] px-2 sm:px-4 py-4 sm:py-8">
      {/* Responsive heading */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#424242] mb-2">My Team</h1>
        <p className="text-sm sm:text-base text-[#424242]/70 mb-4">
          The Rising Stars of the League
        </p>
      </div>

      {loading ? (
        <LoadingState message="Loading your team..." />
      ) : error ? (
        <div className="text-[#D32F2F] text-center py-8">{error}</div>
      ) : (
        <>
          {/* Team Information */}
          <div className="mb-6 sm:mb-8">
            {/* Responsive grid for stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <StatCard
                title="Team Name"
                value={formatTeamNameFromEmail(user?.email || '')}
              />
              <StatCard
                title="Budget"
                value={`$${(team?.budget || 0).toLocaleString()}`}
              />
              <StatCard
                title="Transfer Market"
                value={<Link to={ROUTES.MARKET} className="text-[#2E7D32] hover:text-[#1B5E20] font-medium">View Market</Link>}
              />
            </div>
      </div>
      {/* Simple warning message below cards */}
          {effectiveAvailableCount === TEAM_CONSTRAINTS.MIN_PLAYERS && (
            <div className="mt-2 text-center py-6">
              <p className="text-[#856404] text-sm bg-[#FFF3CD] border border-[#FFEAA7] rounded-lg py-3 px-4">
                You cannot list any more players because you have reached minimum count.
              </p>
            </div>
          )}

          

          {/* Responsive player grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {userPlayers.length === 0 ? (
              <EmptyState
                title="No players in your team"
                description="Start building your squad by visiting the transfer market."
                actionText="Go to Market"
                actionLink={ROUTES.MARKET}
              />
            ) : (
              userPlayers.map((player: PlayerWithId) => (
                <TeamPlayerCard
                  key={player.id || player.player_id}
                  player={player}
                  onListForSale={handleOpenListing}
                  disabled={effectiveAvailableCount === TEAM_CONSTRAINTS.MIN_PLAYERS}
                />
              ))
            )}
          </div>

          
        </>
      )}

      {/* Responsive Listing Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={`List ${selectedPlayer?.name || selectedPlayer?.player_name} for Sale`}
      >
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-[#424242]">
            Set Listing Price ($)
          </label>
          <Input
            type="number"
            min={1}
            value={listingPrice}
            onChange={e => handlePriceChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleListPlayer(); }}
            className={`w-full bg-[#F5F5F5] border text-[#424242] placeholder-[#9E9E9E] focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
              validationError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-[#2E7D32]'
            }`}
            placeholder="Enter price"
          />
          {validationError && (
            <div className="mt-2 text-red-600 text-sm flex items-center gap-2">
              <span className="text-red-500">⚠</span>
              {validationError}
            </div>
          )}
          <div className="mt-2 text-xs text-[#424242]/70">
            Buyers will pay 95% of your listing price
          </div>
        </div>
        
        {error && (
          <div className="text-[#D32F2F] mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {successMsg && (
          <div className="text-[#2E7D32] mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
            {successMsg}
          </div>
        )}
        
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleListPlayer}
            disabled={listingLoading || !listingPrice || !!validationError}
          >
            {listingLoading ? "Listing..." : "List Player"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}