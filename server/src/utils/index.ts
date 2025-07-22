import { type Player } from "@/interfaces"
import { Position } from "@/enums"
import { TEAM_CONSTRAINTS } from "@/constants"

export function validateTeamComposition(players: Player[]): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (players.length > TEAM_CONSTRAINTS.MAX_PLAYERS) {
    errors.push(`Team cannot have more than ${TEAM_CONSTRAINTS.MAX_PLAYERS} players`)
  }

  const positionCounts = players.reduce(
    (acc, player) => {
      const pos = player.position as Position
      acc[pos] = (acc[pos] || 0) + 1
      return acc
    },
    {} as Record<Position, number>,
  )

  if ((positionCounts[Position.GOALKEEPER] || 0) > TEAM_CONSTRAINTS.MAX_GOALKEEPERS) {
    errors.push(`Team cannot have more than ${TEAM_CONSTRAINTS.MAX_GOALKEEPERS} goalkeeper`)
  }

  if ((positionCounts[Position.DEFENDER] || 0) > TEAM_CONSTRAINTS.MAX_DEFENDERS) {
    errors.push(`Team cannot have more than ${TEAM_CONSTRAINTS.MAX_DEFENDERS} defenders`)
  }

  if ((positionCounts[Position.MIDFIELDER] || 0) > TEAM_CONSTRAINTS.MAX_MIDFIELDERS) {
    errors.push(`Team cannot have more than ${TEAM_CONSTRAINTS.MAX_MIDFIELDERS} midfielders`)
  }

  if ((positionCounts[Position.FORWARD] || 0) > TEAM_CONSTRAINTS.MAX_FORWARDS) {
    errors.push(`Team cannot have more than ${TEAM_CONSTRAINTS.MAX_FORWARDS} forwards`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function asyncHandler(fn: Function) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
