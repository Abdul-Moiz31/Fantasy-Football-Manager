"use client"
import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { Button } from "./Button"
import { formatTeamNameFromEmail } from "@/utils"
import { formatCurrency } from "@/utils"
import { TEAM_CONSTRAINTS } from "@/constants"
import type { MarketListing } from "@/interfaces"

interface MarketListingCardProps {
  listing: MarketListing
  isOwned: boolean
  onBuy?: (listing: MarketListing) => void
  onSell?: (listing: MarketListing) => void
  disabled?: boolean
}

export function MarketListingCard({
  listing,
  isOwned,
  onBuy,
  onSell,
  disabled = false
}: MarketListingCardProps) {
  return (
    <Card className="w-full bg-white border border-[#E0E0E0] shadow-lg rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-[1.02] min-h-[200px]">
      <CardHeader className="pb-2 px-3 sm:px-4">
        <CardTitle className="text-sm sm:text-lg font-bold text-[#424242] mb-1 truncate">
          {listing.playerName}
        </CardTitle>
        <div className="text-xs text-[#424242]">Position: {listing.position}</div>
        <div className="text-xs text-[#424242]">Asking Price: {listing.price != null ? formatCurrency(listing.price / TEAM_CONSTRAINTS.MARKET_DISCOUNT) : 'N/A'}</div>
        <div className="text-xs text-[#2E7D32] font-semibold">Buy Price ({TEAM_CONSTRAINTS.MARKET_DISCOUNT * 100}%): {listing.price != null ? formatCurrency(listing.price) : 'N/A'}</div>
      </CardHeader>
      <CardContent className="pt-0 px-3 sm:px-4">
        <div className="flex flex-col gap-1 mb-3">
          <div className="text-xs text-[#424242]/70 truncate">Listed by: {(() => {
            const teamName = listing.sellerTeamName || '';
            if (teamName.includes('@')) {
              return formatTeamNameFromEmail(teamName);
            }
            // If it's in format "Arsenal3399's team", extract just the team name
            if (teamName.includes("'s team")) {
              return teamName.replace("'s team", "");
            }
            return teamName;
          })()}</div>
          <div className="text-xs text-[#424242]/70">Listed: {new Date(listing.createdAt).toLocaleDateString()}</div>
        </div>
        {isOwned ? (
          <Button 
            className="w-full bg-[#E53935] hover:bg-[#E53935]/90 text-white text-sm py-2"
            onClick={() => onSell?.(listing)}
          >
            Remove from Market
          </Button>
        ) : (
          <Button
            className="w-full bg-[#43A047] hover:bg-[#43A047]/90 text-white disabled:bg-[#E0E0E0] disabled:text-[#424242]/50 text-sm py-2"
            onClick={() => onBuy?.(listing)}
            disabled={disabled}
          >
            Buy for {listing.price != null ? formatCurrency(listing.price) : 'N/A'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
} 