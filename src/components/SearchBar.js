import { useState, useCallback } from 'react'
import { debounce } from 'lodash'

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialValue)

  // Debounce para evitar muitas requisições enquanto digita
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value.trim())
    }, 500), // Aumentamos o delay para 500ms
    [onSearch]
  )

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value) // Atualiza o estado local imediatamente
    debouncedSearch(value) // Agenda a busca após o delay
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search by name, EID or description..."
        className="w-full px-4 py-2 pr-10 border rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   dark:bg-gray-800 dark:border-gray-700"
      />
      <svg
        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
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
  )
} 