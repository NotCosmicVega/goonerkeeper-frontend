"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"

export interface SavedContent {
  id: string
  url: string
  comment?: string
  coverImage?: string
  tags: string[]
  createdAt: string
  title?: string
}

export const useSavedContent = () => {
  const [content, setContent] = useState<SavedContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const { token } = useAuth()

  const fetchContent = async () => {
    if (!token) return

    try {
      setIsLoading(true)
      const response = await fetch("/saved", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setContent(data.content || [])

        // Extraer todos los tags únicos
        const allTags = data.content?.flatMap((item: SavedContent) => item.tags) || []
        setTags([...new Set(allTags)])
      }
    } catch (error) {
      console.error("Error fetching content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveContent = async (newContent: Omit<SavedContent, "id" | "createdAt">) => {
    if (!token) return

    try {
      const response = await fetch("/saved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newContent),
      })

      if (response.ok) {
        const savedItem = await response.json()
        setContent((prev) => [savedItem, ...prev])

        // Actualizar tags
        const newTags = [...new Set([...tags, ...newContent.tags])]
        setTags(newTags)
      }
    } catch (error) {
      console.error("Error saving content:", error)
      throw error
    }
  }

  const deleteContent = async (id: string) => {
    if (!token) return

    try {
      const response = await fetch(`/saved/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setContent((prev) => prev.filter((item) => item.id !== id))
      }
    } catch (error) {
      console.error("Error deleting content:", error)
      throw error
    }
  }

  const updateContent = async (id: string, updatedContent: Partial<SavedContent>) => {
    if (!token) return

    try {
      const response = await fetch(`/saved/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedContent),
      })

      if (response.ok) {
        const updated = await response.json()
        setContent((prev) => prev.map((item) => (item.id === id ? updated : item)))
      }
    } catch (error) {
      console.error("Error updating content:", error)
      throw error
    }
  }

  useEffect(() => {
    fetchContent()
  }, [token])

  return {
    content,
    isLoading,
    tags,
    saveContent,
    deleteContent,
    updateContent,
    refetch: fetchContent,
  }
}
