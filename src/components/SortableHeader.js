export default function SortableHeader({ label, field, currentSort, onSort }) {
  const isActive = currentSort.field === field
  const direction = currentSort.direction

  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 text-left font-semibold hover:text-blue-500"
    >
      {label}
      <span className="flex flex-col text-xs leading-none text-gray-400">
        <svg
          className={`h-2 w-2 ${isActive && direction === 'asc' ? 'text-blue-500' : ''}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 4l-8 8h16z" />
        </svg>
        <svg
          className={`h-2 w-2 ${isActive && direction === 'desc' ? 'text-blue-500' : ''}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 20l-8-8h16z" />
        </svg>
      </span>
    </button>
  )
} 