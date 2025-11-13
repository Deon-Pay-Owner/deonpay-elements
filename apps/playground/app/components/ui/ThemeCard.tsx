'use client'

interface ThemeCardProps {
  name: string
  displayName: string
  description: string
  preview: React.ReactNode
  isSelected: boolean
  onSelect: () => void
}

export function ThemeCard({
  name,
  displayName,
  description,
  preview,
  isSelected,
  onSelect
}: ThemeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`relative group rounded-xl border-2 p-6 text-left transition-all duration-300 hover:scale-105 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-xl'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg'
      }`}
    >
      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          Seleccionado
        </div>
      )}

      {/* Theme Name */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {displayName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      {/* Preview */}
      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 p-4">
        {preview}
      </div>

      {/* Hover Indicator */}
      <div className={`absolute inset-0 rounded-xl transition-opacity ${
        isSelected ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl" />
      </div>
    </button>
  )
}
