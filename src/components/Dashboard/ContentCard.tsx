"use client"

import type React from "react"
import { useState } from "react"
import type { SavedContent } from "../../hooks/useSavedContent"

interface ContentCardProps {
  content: SavedContent
  onEdit: (content: SavedContent) => void
  onDelete: (id: string) => void
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const getDisplayTitle = () => {
    if (content.title) return content.title
    if (content.comment) return content.comment.substring(0, 50) + (content.comment.length > 50 ? "..." : "")
    try {
      const url = new URL(content.url)
      return url.hostname
    } catch {
      return "Untitled"
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div
      className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative aspect-video bg-gray-900">
        {content.coverImage && !imageError ? (
          <img
            src={content.coverImage || "/placeholder.svg"}
            alt={getDisplayTitle()}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {showActions && (
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={() => onEdit(content)}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(content.id)}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold mb-2 line-clamp-2">{getDisplayTitle()}</h3>

        {content.comment && <p className="text-gray-400 text-sm mb-3 line-clamp-2">{content.comment}</p>}

        <div className="flex flex-wrap gap-2 mb-3">
          {content.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-600/30"
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          <span>Visit Link</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default ContentCard
