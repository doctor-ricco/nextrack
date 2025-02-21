export default function ProgressBar({ progress = 0 }) {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
      <div 
        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
} 