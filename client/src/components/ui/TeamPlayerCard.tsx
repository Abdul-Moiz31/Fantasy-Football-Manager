"use client"
import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { Button } from "./Button"
import type { PlayerWithId } from "@/interfaces"

interface TeamPlayerCardProps {
  player: PlayerWithId
  onListForSale?: (player: PlayerWithId) => void
  disabled?: boolean
}

export function TeamPlayerCard({
  player,
  onListForSale,
  disabled = false
}: TeamPlayerCardProps) {
  const playerName = player.name || player.player_name || 'Unknown Player'
  const isListed = player.is_listed_for_sale || (player as any).in_transfer_market

  return (
    <Card className={`w-full border shadow-lg rounded-xl transition-all duration-200 min-h-[200px] ${
      isListed 
        ? "bg-gray-100 border-gray-300 opacity-75 hover:opacity-85" 
        : "bg-white border-[#E0E0E0] hover:shadow-xl hover:scale-[1.02]"
    }`}>
      <CardHeader className="pb-2 px-3 sm:px-4">
        <CardTitle className={`text-sm sm:text-lg font-bold mb-1 flex items-center flex-wrap gap-1 ${
          isListed ? "text-gray-600" : "text-[#424242]"
        }`}>
          <span className="truncate">{playerName}</span>
          {isListed && (
            <span className="ml-auto px-2 py-1 text-xs bg-orange-500 text-white rounded whitespace-nowrap">
              Listed
            </span>
          )}
        </CardTitle>
        <div className={`text-xs ${isListed ? "text-gray-500" : "text-[#424242]"}`}>
          Position: {player.position}
        </div>
        {player.rating && (
          <div className={`text-xs ${isListed ? "text-gray-500" : "text-[#424242]"}`}>
            Rating: {player.rating}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0 px-3 sm:px-4">
        <div className="flex flex-col gap-1 mb-3">
          {player.age && (
            <div className={`text-xs ${isListed ? "text-gray-400" : "text-[#424242]/70"}`}>
              Age: {player.age} years
            </div>
          )}
          {player.nationality && (
            <div className={`text-xs truncate ${isListed ? "text-gray-400" : "text-[#424242]/70"}`}>
              Nationality: {player.nationality}
            </div>
          )}
          {isListed && (player as any).asking_price && (
            <div className="text-xs text-orange-600 font-medium">
              Listed for: ${parseInt((player as any).asking_price).toLocaleString()}
            </div>
          )}
        </div>
        <Button
          className={`w-full text-sm py-2 transition-all duration-200 ${
            isListed 
              ? "bg-orange-100 text-orange-700 border border-orange-300 cursor-default hover:bg-orange-100" 
              : "bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
          }`}
          onClick={() => !isListed && onListForSale?.(player)}
          disabled={isListed || disabled}
        >
          {isListed ? "Listed" : "List for Sale"}
        </Button>
      </CardContent>
    </Card>
  )
} 