"use client"

import type React from "react"
import { useAuth } from "../../contexts/AuthContext"

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            LinkVault
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-gray-300">
            Welcome, <span className="text-purple-400 font-semibold">{user?.username}</span>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
