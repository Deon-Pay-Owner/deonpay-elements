'use client'

interface StepCardProps {
  number: number
  title: string
  description: string
  children?: React.ReactNode
  isActive?: boolean
}

export function StepCard({
  number,
  title,
  description,
  children,
  isActive = false
}: StepCardProps) {
  return (
    <div
      className={`relative rounded-xl border-2 transition-all duration-300 ${
        isActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-lg'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      {/* Step Number Badge */}
      <div className="absolute -top-4 -left-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg ${
            isActive
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
              : 'bg-gradient-to-br from-gray-400 to-gray-500 text-white'
          }`}
        >
          {number}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
