'use client'

import { useDroppable } from '@dnd-kit/core'
import { ElementType } from './ElementCard'
import { ElementPreview } from './ElementPreview'

interface DropZoneProps {
  elements: ElementType[]
  onRemove: (id: string) => void
}

export function DropZone({ elements, onRemove }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'drop-zone'
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[400px] p-6 rounded-xl border-2 border-dashed transition-all duration-200
        ${isOver
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
          : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
        }
      `}
    >
      {elements.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className={`mb-4 ${isOver ? 'animate-bounce' : ''}`}>
            <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {isOver ? '¡Suelta aquí!' : 'Arrastra elementos aquí'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            Arrastra los elementos desde el panel izquierdo para construir tu formulario de pago personalizado
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Vista previa del formulario
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {elements.length} elemento{elements.length !== 1 ? 's' : ''}
            </span>
          </div>

          {elements.map((element, index) => (
            <ElementPreview
              key={element.id}
              element={element}
              index={index}
              onRemove={() => onRemove(element.id)}
            />
          ))}

          {isOver && (
            <div className="border-2 border-blue-400 border-dashed rounded-xl p-4 bg-blue-50 dark:bg-blue-900/20 animate-pulse">
              <p className="text-center text-blue-600 dark:text-blue-400 font-medium">
                Suelta aquí para agregar
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}