
"use client"

import React, { useState } from "react"
import { ChevronDown, Check } from "lucide-react"

interface FilterDropdownProps {
  onFilterChange: (filter: string) => void
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("All")

  const filters = ["All", "Builder", "User", "Joined", "Unjoined"]

  const handleSelect = (filter: string) => {
    setSelectedFilter(filter)
    onFilterChange(filter)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedFilter}
          <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleSelect(filter)}
                className="flex justify-between items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                {filter}
                {selectedFilter === filter && <Check className="h-5 w-5 text-green-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
