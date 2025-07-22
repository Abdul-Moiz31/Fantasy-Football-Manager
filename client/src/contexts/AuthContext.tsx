"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { AuthContextType, User } from "@/interfaces"
import { authApi } from "@/services/api"
import { toast } from "@/hooks/use-toast"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Validate token and restore session on mount
  useEffect(() => {
    const validateAndRestoreSession = async () => {
      const token = localStorage.getItem("auth-token")
      if (token) {
        try {
          const response = await authApi.validateToken()
          if (response.success && response.user) {
            setUser(response.user)
          } else {
            localStorage.removeItem("auth-token")
          }
        } catch (error) {
          localStorage.removeItem("auth-token")
        }
      }
      setLoading(false)
    }
    validateAndRestoreSession()
  }, [])

  const unifiedAuth = async (data: { email: string; password: string; username?: string; teamName?: string }): Promise<{ success: boolean; error?: string; data?: any }> => {
    setLoading(true)
    try {
      const response = await authApi.unifiedAuth(data)
      if (response.success && response.user && response.token) {
        setUser(response.user)
        localStorage.setItem("auth-token", response.token)
        
        // Show success toast based on HTTP status code
        // Status 201 = Registration, Status 200 = Login
        const isRegistration = response.status === 201
        toast({
          title: isRegistration ? "Account created successfully!" : "Welcome back!",
          description: isRegistration ? "Your team is being created..." : "You've been logged in.",
          variant: "default"
        });
        
        return { success: true, data: response }
      }
      return { success: false, error: response.message || "Unknown error" }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Unknown error"
      toast({
        title: "Authentication failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth-token")
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
      variant: "default"
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, unifiedAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
