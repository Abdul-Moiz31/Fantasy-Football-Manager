"use client"

import { TEAM_CONSTRAINTS } from "@/constants"
import { useTeam } from "@/contexts/TeamContext"
import { useApiError } from "./useApiError"

export function useTeamConstraints() {
  const { team } = useTeam()
  const { handleError } = useApiError()

  const effectiveTeamSize = team?.players?.length || 0

  const canAddPlayer = () => {
    if (effectiveTeamSize >= TEAM_CONSTRAINTS.MAX_PLAYERS) {
      handleError(
        null,
        `Team is full (${TEAM_CONSTRAINTS.MAX_PLAYERS} players maximum)`,
        "Team Size Limit Reached"
      )
      return false
    }
    return true
  }

  const canRemovePlayer = () => {
    if (effectiveTeamSize <= TEAM_CONSTRAINTS.MIN_PLAYERS) {
      handleError(
        null,
        `Cannot remove player. Team size would be below minimum (${TEAM_CONSTRAINTS.MIN_PLAYERS} players)`,
        "Cannot Remove Player"
      )
      return false
    }
    return true
  }

  const canAfford = (price: number) => {
    if (!team || team.budget < price) {
      handleError(
        null,
        "You don't have enough budget for this action",
        "Insufficient Budget"
      )
      return false
    }
    return true
  }

  const getTeamStats = () => ({
    currentSize: effectiveTeamSize,
    maxSize: TEAM_CONSTRAINTS.MAX_PLAYERS,
    minSize: TEAM_CONSTRAINTS.MIN_PLAYERS,
    budget: team?.budget || 0,
    canAdd: effectiveTeamSize < TEAM_CONSTRAINTS.MAX_PLAYERS,
    canRemove: effectiveTeamSize > TEAM_CONSTRAINTS.MIN_PLAYERS
  })

  return {
    effectiveTeamSize,
    canAddPlayer,
    canRemovePlayer, 
    canAfford,
    getTeamStats
  }
} 