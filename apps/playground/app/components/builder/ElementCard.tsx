'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export interface ElementType {
  id: string
  type: 'payment' | 'billing'
  name: string
  description: string
  icon: string
  required?: boolean
}

interface ElementCardProps {
  element: ElementType
  isDragging?: boolean
}

function getIcon(type: string) {
  if (type === 'payment') {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  }
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

export function ElementCard({ element, isDragging = false }: ElementCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging: isCurrentlyDragging } = useDraggable({
    id: element.id,
    data: element
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isCurrentlyDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative p-4 bg-white dark:bg-gray-800 rounded-xl border-2
        ${isCurrentlyDragging ? 'border-blue-500 shadow-2xl scale-105' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'}
        cursor-grab active:cursor-grabbing transition-all duration-200
        hover:shadow-lg transform hover:-translate-y-1
      `}
    >
      {/* Drag Handle Icon */}
      <div className="absolute top-2 right-2 text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
          {getIcon(element.icon)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {element.name}
            {element.required && (
              <span className="ml-2 text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                Requerido
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {element.description}
          </p>
        </div>
      </div>
    </div>
  )
}