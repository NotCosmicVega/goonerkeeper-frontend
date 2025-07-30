"use client"

import type React from "react"
import { useState } from "react"

interface TagFilterProps {
  tags: string[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, onTagsChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    onTagsChange([])
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-700 transition-all flex items-center space-x-2"
      >
        <span>Filter by Tags</span>
        {selectedTags.length > 0 && (
          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">{selectedTags.length}</span>
        )}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto">
          <div className="p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-300">Select Tags</span>
              {selectedTags.length > 0 && (
                <button onClick={clearFilters} className="text-xs text-purple-400 hover:text-purple-300">
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-2">
              {tags.map((tag) => (
                <label key={tag} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">{tag}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TagFilter
