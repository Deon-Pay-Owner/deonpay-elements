'use client'

import { useState } from 'react'

interface Font {
  name: string
  value: string
  category: string
}

interface FontPickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

const FONT_OPTIONS: Font[] = [
  {
    name: 'System (Default)',
    value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    category: 'System'
  },
  {
    name: 'Inter',
    value: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    category: 'Modern'
  },
  {
    name: 'Roboto',
    value: '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
    category: 'Modern'
  },
  {
    name: 'Open Sans',
    value: '"Open Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    category: 'Modern'
  },
  {
    name: 'Lato',
    value: '"Lato", -apple-system, BlinkMacSystemFont, sans-serif',
    category: 'Modern'
  },
  {
    name: 'Montserrat',
    value: '"Montserrat", -apple-system, BlinkMacSystemFont, sans-serif',
    category: 'Modern'
  },
  {
    name: 'Poppins',
    value: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif',
    category: 'Modern'
  },
  {
    name: 'Source Sans Pro',
    value: '"Source Sans Pro", -apple-system, BlinkMacSystemFont, sans-serif',
    category: 'Modern'
  },
  {
    name: 'Georgia',
    value: 'Georgia, "Times New Roman", serif',
    category: 'Serif'
  },
  {
    name: 'Times New Roman',
    value: '"Times New Roman", Times, serif',
    category: 'Serif'
  },
  {
    name: 'Courier New',
    value: '"Courier New", Courier, monospace',
    category: 'Monospace'
  },
  {
    name: 'Monaco',
    value: 'Monaco, "Courier New", monospace',
    category: 'Monospace'
  }
]

export function FontPicker({ value, onChange, label = 'Fuente' }: FontPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedFont = FONT_OPTIONS.find(font => font.value === value) || FONT_OPTIONS[0]

  const groupedFonts = FONT_OPTIONS.reduce((acc, font) => {
    if (!acc[font.category]) {
      acc[font.category] = []
    }
    acc[font.category].push(font)
    return acc
  }, {} as Record<string, Font[]>)

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        <svg className="w-4 h-4 inline-block mr-2 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10M12 21V3M5.5 5h13M5.5 5L4 7.5M18.5 5L20 7.5" />
        </svg>
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left flex items-center justify-between hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        >
          <span style={{ fontFamily: selectedFont.value }} className="text-gray-900 dark:text-white">
            {selectedFont.name}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
              {Object.entries(groupedFonts).map(([category, fonts]) => (
                <div key={category}>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 sticky top-0">
                    {category}
                  </div>
                  {fonts.map((font) => (
                    <button
                      key={font.value}
                      type="button"
                      onClick={() => {
                        onChange(font.value)
                        setIsOpen(false)
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        font.value === value ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          style={{ fontFamily: font.value }}
                          className="text-gray-900 dark:text-white"
                        >
                          {font.name}
                        </span>
                        {font.value === value && (
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div
                        style={{ fontFamily: font.value }}
                        className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                      >
                        0123456789 • Ejemplo de texto
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Preview Card */}
      <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista Previa:</div>
        <div style={{ fontFamily: value }} className="space-y-2">
          <div className="text-lg text-gray-900 dark:text-white font-semibold">
            DeonPay Elements
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Número de Tarjeta: 4242 4242 4242 4242
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Integración de pagos moderna y segura
          </div>
        </div>
      </div>
    </div>
  )
}
