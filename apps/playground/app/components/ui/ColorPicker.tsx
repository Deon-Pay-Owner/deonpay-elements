'use client'

import { useState } from 'react'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
  presetColors?: string[]
}

export function ColorPicker({
  label,
  value,
  onChange,
  presetColors = [
    '#0070f3',
    '#7928ca',
    '#ff0080',
    '#ff4438',
    '#f5a623',
    '#50e3c2',
    '#0ea5e9',
    '#8b5cf6',
    '#ec4899',
    '#10b981'
  ]
}: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <div className="flex items-center gap-3">
        {/* Color Display */}
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="relative w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden hover:scale-110 transition-transform shadow-md"
          style={{ backgroundColor: value }}
        >
          <span className="sr-only">Seleccionar color</span>
        </button>

        {/* Hex Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* HTML Color Picker */}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
        />
      </div>

      {/* Preset Colors */}
      {showPicker && (
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg animate-fade-in">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">
            Colores predefinidos
          </p>
          <div className="grid grid-cols-5 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  onChange(color)
                  setShowPicker(false)
                }}
                className={`w-full h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                  value === color
                    ? 'border-gray-900 dark:border-white ring-2 ring-offset-2 ring-blue-500'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
              >
                <span className="sr-only">{color}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
