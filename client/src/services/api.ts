import axios from "axios"
import type {
  ApiResponse,
  User,
  Team,
  Player,
} from "@/interfaces"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-token")
      if (window.location.pathname !== "/auth") {
        window.location.href = "/auth"
      }
    }
    return Promise.reject(error)
  }
)
export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post("/auth/login", credentials)
    return response.data
  },

  register: async (userData: { email: string; password: string; username?: string }): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post("/auth/register", userData)
    return response.data
  },

  unifiedAuth: async (data: { email: string; password: string }): Promise<{ success: boolean; user?: any; token?: string; team?: any; message?: string; status?: number }> => {
    const response = await api.post("/auth", data)
    return { ...response.data, status: response.status }
  },

  validateToken: async (): Promise<{ success: boolean; user?: any; team?: any; message?: string }> => {
    const response = await api.get("/auth/validate")
    return response.data
  },
}
export const teamApi = {
  createTeam: async (teamData: { name: string }): Promise<ApiResponse<Team>> => {
    const response = await api.post("/teams", teamData)
    return response.data
  },

  getMyTeam: async (): Promise<ApiResponse<Team>> => {
    const response = await api.get("/teams/my-team")
    return response.data
  },

  getAllTeams: async (): Promise<ApiResponse<Team[]>> => {
    const response = await api.get("/teams")
    return response.data
  },

  addPlayer: async (playerData: { playerId: number }): Promise<ApiResponse<Team>> => {
    const response = await api.post("/teams/add-player", playerData)
    return response.data
  },

  removePlayer: async (playerId: number): Promise<ApiResponse<Team>> => {
    const response = await api.delete(`/teams/remove-player/${playerId}`)
    return response.data
  },
}
export const playerApi = {
  getAllPlayers: async (): Promise<ApiResponse<Player[]>> => {
    const response = await api.get("/players")
    return response.data
  },

  getPlayer: async (id: number): Promise<ApiResponse<Player>> => {
    const response = await api.get(`/players/${id}`)
    return response.data
  },
}
export const marketApi = {
  getMarketPlayers: async (filters: { name?: string; team?: string; minPrice?: number; maxPrice?: number; my?: boolean }) => {
    const params = new URLSearchParams();
    if (filters.name) params.append("name", filters.name);
    if (filters.team) params.append("team", filters.team);
    if (filters.minPrice !== undefined) params.append("minPrice", String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.append("maxPrice", String(filters.maxPrice));
    if (filters.my) params.append("my", "true");
    const response = await api.get(`/market/players?${params.toString()}`);
    return response.data;
  },
  buyPlayer: async (playerId: number) => {
    const response = await api.post("/market/buy", { playerId });
    return response.data;
  },
  sellPlayer: async (playerId: number) => {
    const response = await api.post("/market/sell", { playerId });
    return response.data;
  },
  removeFromMarket: async (playerId: number) => {
    const response = await api.patch("/market/remove", { playerId });
    return response.data;
  },
  getAllPlayers: async () => {
    // Use the playerApi endpoint to get all players
    const response = await api.get("/players");
    return response.data;
  },
  listPlayerForSale: async (playerId: number, listing_price: number | string) => {
    // Use the /market/sell endpoint to list a player for sale
    const response = await api.post("/market/sell", { playerId, listing_price });
    return response.data;
  },
};

export default api
