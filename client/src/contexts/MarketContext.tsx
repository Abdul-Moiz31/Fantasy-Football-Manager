"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Player, PlayerFilters } from "@/interfaces"
import { playerApi } from "@/services/api"

interface MarketContextValue {
  players: Player[]
  filteredPlayers: Player[]
  filters: PlayerFilters
  setFilters: (filters: PlayerFilters) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  loading: boolean
}

const MarketContext = createContext<MarketContextValue | undefined>(undefined)

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([])
  const [filters, setFilters] = useState<PlayerFilters>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    setLoading(true)
    try {
      const response = await playerApi.getAllPlayers()
      if (response.success && response.data) {
        setPlayers(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch players:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers = players.filter((player) => {
    // Search term filter
    if (
      searchTerm &&
      !player.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !player.team.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Team filter
    if (filters.team && player.team !== filters.team) {
      return false
    }

    // Value filters
    if (filters.minValue && player.value < filters.minValue) {
      return false
    }
    if (filters.maxValue && player.value > filters.maxValue) {
      return false
    }

    return true
  })

  return (
    <MarketContext.Provider
      value={{
        players,
        filteredPlayers,
        filters,
        setFilters,
        searchTerm,
        setSearchTerm,
        loading,
      }}
    >
      {children}
    </MarketContext.Provider>
  )
}

export function useMarket() {
  const context = useContext(MarketContext)
  if (context === undefined) {
    throw new Error("useMarket must be used within a MarketProvider")
  }
  return context
}
