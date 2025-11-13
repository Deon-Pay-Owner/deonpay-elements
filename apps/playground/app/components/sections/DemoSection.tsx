'use client'

import { useState, useEffect } from 'react'
import { PaymentDemo } from '../PaymentDemo'
import { ThemeCard } from '../ui/ThemeCard'
import { ColorPicker } from '../ui/ColorPicker'
import { FontPicker } from '../ui/FontPicker'
import { ApiKeysConfig } from '../ui/ApiKeysConfig'
import { CodeBlock } from '../ui/CodeBlock'

type ThemeName = 'flat' | 'classic' | 'dark'

interface ThemeConfig {
  name: ThemeName
  displayName: string
  description: string
  primaryColor: string
}

const themes: ThemeConfig[] = [
  {
    name: 'flat',
    displayName: 'Flat',
    description: 'Diseño moderno y minimalista con colores planos',
    primaryColor: '#0070f3'
  },
  {
    name: 'classic',
    displayName: 'Classic',
    description: 'Estilo profesional con bordes definidos',
    primaryColor: '#5469d4'
  },
  {
    name: 'dark',
    displayName: 'Dark',
    description: 'Modo oscuro elegante y moderno',
    primaryColor: '#0ea5e9'
  }
]

export function DemoSection() {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>('flat')
  const [customColor, setCustomColor] = useState('#0070f3')
  const [borderRadius, setBorderRadius] = useState(8)
  const [fontSize, setFontSize] = useState(14)
  const [fontFamily, setFontFamily] = useState('-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif')
  const [error, setError] = useState<string>('')
  const [showCode, setShowCode] = useState(false)

  // API Keys state
  const [publicKey, setPublicKey] = useState('pk_test_demo_key')
  const [secretKey, setSecretKey] = useState('sk_test_demo_key')
  const [keysVersion, setKeysVersion] = useState(0) // Para forzar recreación del payment intent

  // Cargar API keys desde localStorage al montar
  useEffect(() => {
    const savedPublicKey = localStorage.getItem('deonpay_public_key')
    const savedSecretKey = localStorage.getItem('deonpay_secret_key')

    if (savedPublicKey) setPublicKey(savedPublicKey)
    if (savedSecretKey) setSecretKey(savedSecretKey)
  }, [])

  // Crear payment intent cuando cambian las keys
  useEffect(() => {
    async function createPaymentIntent() {
      setError('')
      setClientSecret('')

      try {
        const res = await fetch('https://api.deonpay.mx/api/v1/payment_intents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secretKey}`
          },
          body: JSON.stringify({
            amount: 10000,
            currency: 'MXN',
            description: 'Demo payment - DeonPay Elements',
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          const errorMsg = data.error?.message || data.message || 'Error desconocido'
          console.error('API Error:', data)
          setError(`Error al crear payment intent: ${errorMsg}`)
          return
        }

        if (data.client_secret) {
          setClientSecret(data.client_secret)
        } else {
          console.error('No client_secret in response:', data)
          setError('Error: No se recibió el client_secret')
        }
      } catch (err: any) {
        console.error('Error:', err)
        setError(`Error al conectar con la API: ${err.message}`)
      }
    }

    createPaymentIntent()
  }, [secretKey, keysVersion])

  // Actualizar color cuando cambia el tema
  useEffect(() => {
    const theme = themes.find(t => t.name === selectedTheme)
    if (theme) {
      setCustomColor(theme.primaryColor)
    }
  }, [selectedTheme])

  // Handler para guardar las API keys
  const handleSaveKeys = () => {
    localStorage.setItem('deonpay_public_key', publicKey)
    localStorage.setItem('deonpay_secret_key', secretKey)
    setKeysVersion(v => v + 1) // Forzar recreación del payment intent
  }

  const generatedCode = `import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/styles.css'

const deonpay = DeonPay('pk_tu_api_key')

const elements = deonpay.elements({
  clientSecret: '${clientSecret.slice(0, 30)}...',
  appearance: {
    theme: '${selectedTheme}',
    variables: {
      colorPrimary: '${customColor}',
      borderRadius: '${borderRadius}px',
      fontSize: '${fontSize}px',
      fontFamily: '${fontFamily}',
    },
  },
})

const paymentElement = elements.create('payment')
paymentElement.mount('#payment-element')`

  return (
    <div id="demo" className="max-w-7xl mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Demo Interactiva
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Experimenta con DeonPay Elements en tiempo real. Personaliza el tema y los estilos para ver los cambios al instante.
        </p>
      </div>

      {/* API Keys Configuration */}
      <div className="mb-12">
        <ApiKeysConfig
          publicKey={publicKey}
          secretKey={secretKey}
          onPublicKeyChange={setPublicKey}
          onSecretKeyChange={setSecretKey}
          onSave={handleSaveKeys}
        />
      </div>

      {/* Theme Selection */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Selecciona un Tema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <ThemeCard
              key={theme.name}
              name={theme.name}
              displayName={theme.displayName}
              description={theme.description}
              isSelected={selectedTheme === theme.name}
              onSelect={() => setSelectedTheme(theme.name)}
              preview={
                <div className="space-y-3">
                  <div className={`h-10 rounded-md ${
                    theme.name === 'dark' ? 'bg-gray-800 border border-gray-600' : 'bg-white border border-gray-300'
                  }`} />
                  <div className="flex gap-2">
                    <div className={`h-10 flex-1 rounded-md ${
                      theme.name === 'dark' ? 'bg-gray-800 border border-gray-600' : 'bg-white border border-gray-300'
                    }`} />
                    <div className={`h-10 w-20 rounded-md ${
                      theme.name === 'dark' ? 'bg-gray-800 border border-gray-600' : 'bg-white border border-gray-300'
                    }`} />
                  </div>
                  <button
                    className={`w-full h-10 rounded-md font-semibold text-white`}
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Pagar
                  </button>
                </div>
              }
            />
          ))}
        </div>
      </div>

      {/* Customization Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Personalización
          </h3>
          <div className="space-y-6">
            <ColorPicker
              label="Color Primario"
              value={customColor}
              onChange={setCustomColor}
            />

            <FontPicker
              value={fontFamily}
              onChange={setFontFamily}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <svg className="w-4 h-4 inline-block mr-2 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Border Radius: {borderRadius}px
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <svg className="w-4 h-4 inline-block mr-2 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="18"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <button
              onClick={() => setShowCode(!showCode)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {showCode ? 'Ocultar Código' : 'Ver Código Generado'}
            </button>
          </div>
        </div>

        {/* Payment Demo */}
        <div className="lg:col-span-2">
          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : !clientSecret ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Cargando demo...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <PaymentDemo
                key={`${selectedTheme}-${customColor}-${borderRadius}-${fontSize}-${fontFamily}-${publicKey}`}
                clientSecret={clientSecret}
                publicKey={publicKey}
                theme={selectedTheme}
                customColor={customColor}
                borderRadius={borderRadius}
                fontSize={fontSize}
                fontFamily={fontFamily}
              />
            </div>
          )}
        </div>
      </div>

      {/* Generated Code */}
      {showCode && clientSecret && (
        <div className="mb-12 animate-fade-in">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Código Generado
          </h3>
          <CodeBlock
            code={generatedCode}
            language="typescript"
            title="Configuración de DeonPay Elements"
          />
        </div>
      )}
    </div>
  )
}
