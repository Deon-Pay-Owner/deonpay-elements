'use client'

import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  maxHeight?: string
}

export function CodeBlock({
  code,
  language = 'typescript',
  title,
  showLineNumbers = true,
  maxHeight = '500px'
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const lines = code.split('\n')

  return (
    <div className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
            {language}
          </span>
        </div>
      )}

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className={`absolute top-3 right-3 z-10 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
          title ? 'top-14' : 'top-3'
        } ${
          copied
            ? 'bg-green-500 text-white'
            : 'bg-gray-700 text-gray-200 hover:bg-gray-600 opacity-0 group-hover:opacity-100'
        }`}
      >
        {copied ? (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copiado
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copiar
          </span>
        )}
      </button>

      {/* Code Content */}
      <div
        className="overflow-x-auto overflow-y-auto p-4 font-mono text-sm"
        style={{ maxHeight }}
      >
        <pre className="text-gray-800 dark:text-gray-200">
          {showLineNumbers ? (
            <table className="w-full">
              <tbody>
                {lines.map((line, index) => (
                  <tr key={index}>
                    <td className="pr-4 text-right text-gray-400 dark:text-gray-600 select-none" style={{ minWidth: '3em' }}>
                      {index + 1}
                    </td>
                    <td className="pl-4">
                      <code>{line || '\n'}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>
    </div>
  )
}
