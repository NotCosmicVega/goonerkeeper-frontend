"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mover la inicialización de localStorage aquí
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem("token") : null
    setToken(storedToken)
    
    const initAuth = async () => {
      if (storedToken) {
        try {
          const response = await fetch("/auth/verify", {
            headers: { Authorization: `Bearer ${storedToken}` },
          })
          if (response.ok) {
            const userData = await response.json()
            setUser(userData.user)
          } else {
            if (typeof window !== 'undefined') {
              localStorage.removeItem("token")
            }
            setToken(null)
          }
        } catch (error) {
          console.error("Auth verification failed:", error)
          if (typeof window !== 'undefined') {
            localStorage.removeItem("token")
          }
          setToken(null)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      setUser(data.user)
      setToken(data.token)
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", data.token)
      }
    } catch (error) {
      throw error
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      const data = await response.json()
      setUser(data.user)
      setToken(data.token)
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", data.token)
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token")
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}
