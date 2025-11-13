'use client'

import { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { ElementCard, ElementType } from './ElementCard'
import { DropZone } from './DropZone'

interface DragDropBuilderProps {
  onElementsChange: (elements: ElementType[]) => void
  showValidationWarning: boolean
}

const availableElements: ElementType[] = [
  {
    id: 'payment-available',
    type: 'payment',
    name: 'Elemento de Pago',
    description: 'Número de tarjeta, fecha de expiración, CVV y nombre del titular',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: 'billing-available',
    type: 'billing',
    name: 'Detalles de Facturación',
    description: 'Nombre, correo, teléfono y dirección del cliente',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export function DragDropBuilder({ onElementsChange, showValidationWarning }: DragDropBuilderProps) {
  const [droppedElements, setDroppedElements] = useState<ElementType[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  // Load saved configuration from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('deonpay_form_config')
    if (saved) {
      try {
        const config = JSON.parse(saved)
        setDroppedElements(config)
        onElementsChange(config)
      } catch (e) {
        console.error('Failed to load saved form configuration')
      }
    }
  }, [])

  // Save configuration to localStorage
  useEffect(() => {
    if (droppedElements.length > 0) {
      localStorage.setItem('deonpay_form_config', JSON.stringify(droppedElements))
    }
  }, [droppedElements])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && over.id === 'drop-zone') {
      const draggedElement = active.data.current as ElementType

      // Check if this type of element is already in the drop zone
      const existingElement = droppedElements.find(el => el.type === draggedElement.type)

      if (!existingElement) {
        const newElement: ElementType = {
          ...draggedElement,
          id: `${draggedElement.type}-${Date.now()}`,
        }
        const updatedElements = [...droppedElements, newElement]
        setDroppedElements(updatedElements)
        onElementsChange(updatedElements)
      }
    }

    setActiveId(null)
  }

  const handleRemove = (id: string) => {
    const updatedElements = droppedElements.filter(el => el.id !== id)
    setDroppedElements(updatedElements)
    onElementsChange(updatedElements)
  }

  const activeElement = activeId ? availableElements.find(el => el.id === activeId) : null

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Elements Panel */}
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Elementos Disponibles
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Arrastra estos elementos para construir tu formulario
            </p>
          </div>

          <div className="space-y-4">
            {availableElements.map((element) => {
              // Check if this type is already in the drop zone
              const isUsed = droppedElements.some(el => el.type === element.type)

              if (isUsed) {
                return (
                  <div key={element.id} className="opacity-50 pointer-events-none">
                    <div className="relative">
                      <ElementCard element={element} />
                      <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70 rounded-xl flex items-center justify-center">
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Ya agregado
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              return <ElementCard key={element.id} element={element} />
            })}

            {/* Tips Section */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-1">Consejos:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Cada elemento solo puede agregarse una vez</li>
                    <li>• Puedes eliminar elementos haciendo clic en la X</li>
                    <li>• Tu configuración se guarda automáticamente</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drop Zone */}
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Tu Formulario
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Suelta los elementos aquí para construir tu formulario
            </p>
          </div>

          <DropZone elements={droppedElements} onRemove={handleRemove} />

          {/* Validation Warning */}
          {showValidationWarning && (
            <div className="mt-4 animate-slideIn">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      CyberSource requiere información de facturación
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      Agrega el elemento "Detalles de Facturación" para procesar pagos con CyberSource.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeElement && (
          <div className="opacity-80 rotate-3">
            <ElementCard element={activeElement} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}