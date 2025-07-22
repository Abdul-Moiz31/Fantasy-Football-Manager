import { Position } from "@/enums"

export interface Player {
  id: number;
  player_id?: number;
  name?: string;
  player_name?: string;
  position: Position | string;
  team?: string;
  team_id?: string | null;
  value?: number;
  player_value?: number;
  age?: number;
  nationality?: string;
  rating?: number;
  is_listed_for_sale?: boolean;
  listed_by_user_id?: string;
  listing_price?: number;
}

export interface User {
  id: string
  username: string
  email: string
  password: string
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
  createdAt: Date
  status: 'pending' | 'ready'
}



export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export interface CreateTeamRequest {
  name: string
}

export interface AddPlayerRequest {
  playerId: number
}

export interface JwtPayload {
  userId: string
  email: string
}


