"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { TeamContextType, Team, Player } from "@/interfaces"
import { teamApi } from "@/services/api"
import { useAuth } from "./AuthContext"

const TeamContext = createContext<TeamContextType | undefined>(undefined)

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchTeam()
    } else {
      setTeam(null)
    }
  }, [user])

  const fetchTeam = async () => {
    try {
      const response = await teamApi.getMyTeam()
      if (response.success && response.data) {
        setTeam(response.data)
      }
    } catch (error) {
      // Team doesn't exist yet
      setTeam(null)
    }
  }

  const createTeam = async (name: string): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await teamApi.createTeam({ name })
      if (response.success && response.data) {
        setTeam(response.data)
        return true
      }
      return false
    } catch (error) {
      return false
    } finally {
      setLoading(false)
    }
  }

  const addPlayerToTeam = async (player: Player): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await teamApi.addPlayer({ playerId: player.id })
      if (response.success && response.data) {
        setTeam(response.data)
        return true
      }
      return false
    } catch (error) {
      return false
    } finally {
      setLoading(false)
    }
  }

  const removePlayerFromTeam = async (playerId: number): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await teamApi.removePlayer(playerId)
      if (response.success && response.data) {
        setTeam(response.data)
        return true
      }
      return false
    } catch (error) {
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <TeamContext.Provider
      value={{
        team,
        setTeam,
        createTeam,
        addPlayerToTeam,
        removePlayerFromTeam,
        loading,
      }}
    >
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const context = useContext(TeamContext)
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider")
  }
  return context
}
