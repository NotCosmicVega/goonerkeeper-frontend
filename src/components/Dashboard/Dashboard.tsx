"use client"

import type React from "react"
import { useState, useMemo } from "react"
import Navbar from "./Navbar"
import ContentCard from "./ContentCard"
import TagFilter from "./TagFilter"
import AddContentForm from "./AddContentForm"
import EditContentModal from "./EditContentModal"
import { useSavedContent, type SavedContent } from "../../hooks/useSavedContent"

const Dashboard: React.FC = () => {
  const { content, isLoading, tags, deleteContent } = useSavedContent()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingContent, setEditingContent] = useState<SavedContent | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => item.tags.includes(tag))

      const matchesSearch =
        searchQuery === "" ||
        item.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesTags && matchesSearch
    })
  }, [content, selectedTags, searchQuery])

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      await deleteContent(id)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your content...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Collection</h1>
            <p className="text-gray-400">
              {content.length} {content.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Content</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content..."
                className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <TagFilter tags={tags} selectedTags={selectedTags} onTagsChange={setSelectedTags} />
        </div>

        {/* Content Grid */}
        {filteredContent.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {content.length === 0 ? "No content yet" : "No matching content"}
            </h3>
            <p className="text-gray-500 mb-6">
              {content.length === 0
                ? "Start building your collection by adding your first link"
                : "Try adjusting your search or filter criteria"}
            </p>
            {content.length === 0 && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Add Your First Link
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContent.map((item) => (
              <ContentCard key={item.id} content={item} onEdit={setEditingContent} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddForm && <AddContentForm onClose={() => setShowAddForm(false)} existingTags={tags} />}

      {editingContent && (
        <EditContentModal content={editingContent} onClose={() => setEditingContent(null)} existingTags={tags} />
      )}
    </div>
  )
}

export default Dashboard
