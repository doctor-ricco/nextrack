import { useState, useRef, useEffect } from 'react'

export default function SortDropdown({ currentSort, onSort }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const sortOptions = [
    { label: 'Nome', field: 'name' },
    { label: 'EID', field: 'eid' },
    { label: 'Data de Início', field: 'startDate' },
    { label: 'Data de Fim', field: 'endDate' },
    { label: 'Data de Criação', field: 'createdAt' }
  ]

  // Fecha o dropdown quando clica fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSort = (field) => {
    onSort(field)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 
                   hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
      >
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
          />
        </svg>
        Ordenar por
        <span className="text-gray-400">
          {currentSort.direction === 'asc' ? '↑' : '↓'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                        border border-gray-200 dark:border-gray-700 z-10">
          {sortOptions.map(({ label, field }) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700
                         ${currentSort.field === field ? 'text-blue-500 font-medium' : ''}`}
            >
              <div className="flex items-center justify-between">
                {label}
                {currentSort.field === field && (
                  <span>{currentSort.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 