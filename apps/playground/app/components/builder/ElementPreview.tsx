'use client'

import { ElementType } from './ElementCard'

interface ElementPreviewProps {
  element: ElementType
  onRemove: () => void
  index: number
}

export function ElementPreview({ element, onRemove, index }: ElementPreviewProps) {
  return (
    <div className="relative group animate-fadeIn">
      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
        title="Eliminar elemento"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Reorder Handle */}
      <div className="absolute top-3 left-3 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </div>

      {/* Element Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
            {element.icon}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {element.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {element.type === 'payment' ? 'Tarjeta de pago' : 'Información de facturación'}
            </p>
          </div>
        </div>

        {/* Preview Fields */}
        <div className="mt-4 space-y-3">
          {element.type === 'payment' ? (
            <>
              <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}