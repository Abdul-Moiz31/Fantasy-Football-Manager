export interface Player {
  id: number
  name: string
  position: Position
  team: string
  value: number
}

export interface User {
  id: string
  username: string
  email: string
  budget: number
  teamId?: string
  createdAt: string
}

export interface Team {
  id: string
  name: string
  userId: string
  players: Player[]
  budget: number
  createdAt: string
  status: 'pending' | 'ready'
}

export interface MarketListing {
  id: number
  userId: string
  teamId: string | null
  playerId: number
  price: number
  createdAt: Date
  player: {
    id: number
    name: string
    position: string
    team: string
    value: number
  }
  position: string
  sellerTeamName: string
  playerName: string
}

export enum Position {
  GOALKEEPER = "Goalkeeper",
  DEFENDER = "Defender",
  MIDFIELDER = "Midfielder",
  FORWARD = "Forward",
}

export interface PlayerFilters {
  name?: string
  team?: string
  minValue?: number
  maxValue?: number
}

export interface AuthContextType {
  user: User | null
  unifiedAuth: (data: { email: string; password: string; username?: string; teamName?: string }) => Promise<{ success: boolean; error?: string; data?: any }>
  logout: () => void
  loading: boolean
}

export interface TeamContextType {
  team: Team | null
  setTeam: (team: Team | null) => void
  createTeam: (name: string) => Promise<boolean>
  addPlayerToTeam: (player: Player) => Promise<boolean>
  removePlayerFromTeam: (playerId: number) => Promise<boolean>
  loading: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

// Utility type for consistent player field access - matches TeamPlayerCard expectations
export interface PlayerWithId {
  id?: string | number
  player_id?: string | number
  name?: string
  player_name?: string
  position: string
  value?: number
  rating?: number
  age?: number
  nationality?: string
  team?: string
  is_listed_for_sale?: boolean
  in_transfer_market?: boolean
  asking_price?: number
}


