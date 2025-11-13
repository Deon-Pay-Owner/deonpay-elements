'use client'

import { useState, useEffect } from 'react'
import { PaymentDemo, ButtonConfig } from '../PaymentDemo'
import { ThemeCard } from '../ui/ThemeCard'
import { ColorPicker } from '../ui/ColorPicker'
import { FontPicker } from '../ui/FontPicker'
import { ApiKeysConfig } from '../ui/ApiKeysConfig'
import { CodeBlock } from '../ui/CodeBlock'
import { DragDropBuilder } from '../builder/DragDropBuilder'
import { ElementType } from '../builder/ElementCard'
import { useFormValidation } from '../../hooks/useFormValidation'
import { ValidationBanner } from '../ui/ValidationBanner'

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
    description: 'Diseño moderno y minimalista con colores vibrantes',
    primaryColor: '#6366f1' // Indigo vibrante
  },
  {
    name: 'classic',
    displayName: 'Classic',
    description: 'Estilo profesional con gradientes sutiles',
    primaryColor: '#8b5cf6' // Púrpura elegante
  },
  {
    name: 'dark',
    displayName: 'Dark',
    description: 'Modo oscuro elegante con acentos brillantes',
    primaryColor: '#06b6d4' // Cyan brillante
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

  // Form builder state
  const [formElements, setFormElements] = useState<ElementType[]>([])

  // Button customization state
  const [buttonConfig, setButtonConfig] = useState<ButtonConfig>({
    backgroundColor: undefined, // Will use customColor
    textColor: '#ffffff',
    fontFamily: undefined, // Will use fontFamily
    fontSize: 16,
    borderRadius: undefined, // Will use borderRadius
    text: 'Pagar $100.00 MXN',
  })

  // Form validation
  const validation = useFormValidation(formElements, secretKey)

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

      // Validar que las keys no sean las de demo
      if (secretKey === 'sk_test_demo_key' || publicKey === 'pk_test_demo_key') {
        setError('Por favor, configura tus API Keys reales en la sección "Configuración de API Keys"')
        return
      }

      try {
        console.log('Creating payment intent with SK:', secretKey.substring(0, 20) + '...')

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

        console.log('Response status:', res.status)
        console.log('Response headers:', Object.fromEntries(res.headers.entries()))

        let data
        const contentType = res.headers.get('content-type')

        if (contentType && contentType.includes('application/json')) {
          data = await res.json()
          console.log('Response data:', data)
        } else {
          const text = await res.text()
          console.error('Non-JSON response:', text)
          setError(`Error: La API devolvió una respuesta no-JSON. Status: ${res.status}`)
          return
        }

        if (!res.ok) {
          const errorMsg = data.error?.message || data.message || JSON.stringify(data) || 'Error desconocido'
          console.error('API Error Response:', data)
          setError(`Error al crear payment intent (${res.status}): ${errorMsg}`)
          return
        }

        if (data.client_secret) {
          console.log('Payment Intent created successfully:', data.id)
          setClientSecret(data.client_secret)
        } else {
          console.error('No client_secret in response:', data)
          console.error('Full response structure:', JSON.stringify(data, null, 2))
          setError(`Error: No se recibió el client_secret. Respuesta: ${JSON.stringify(data).substring(0, 200)}`)
        }
      } catch (err: any) {
        console.error('Exception caught:', err)
        setError(`Error al conectar con la API: ${err.message}`)
      }
    }

    createPaymentIntent()
  }, [secretKey, publicKey, keysVersion])

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
          Playground Interactivo
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Construye tu formulario de pago personalizado con drag & drop. Experimenta con diferentes configuraciones en tiempo real.
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

      {/* Validation Warnings */}
      {validation.warnings.length > 0 && (
        <div className="mb-8 space-y-4">
          {validation.warnings.map((warning, idx) => (
            <ValidationBanner key={idx} type="warning" message={warning} />
          ))}
        </div>
      )}

      {validation.errors.length > 0 && (
        <div className="mb-8 space-y-4">
          {validation.errors.map((error, idx) => (
            <ValidationBanner key={idx} type="error" message={error} />
          ))}
        </div>
      )}

      {/* Drag & Drop Form Builder */}
      <div className="mb-12">
        <DragDropBuilder
          onElementsChange={setFormElements}
          showValidationWarning={validation.requiresBillingElement && validation.hasPaymentElement && !validation.hasBillingElement}
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
        <div className="space-y-6">
          {/* Theme Customization */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Personalización del Tema
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
            </div>
          </div>

          {/* Button Customization */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Personalización del Botón
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  value={buttonConfig.text}
                  onChange={(e) => setButtonConfig({ ...buttonConfig, text: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  placeholder="Pagar $100.00 MXN"
                />
              </div>

              <ColorPicker
                label="Color del Texto"
                value={buttonConfig.textColor || '#ffffff'}
                onChange={(color) => setButtonConfig({ ...buttonConfig, textColor: color })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tamaño de Fuente: {buttonConfig.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={buttonConfig.fontSize}
                  onChange={(e) => setButtonConfig({ ...buttonConfig, fontSize: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Button Preview */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Vista Previa:</p>
                <button
                  className="w-full font-semibold py-3 px-6 shadow-lg flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: customColor,
                    color: buttonConfig.textColor,
                    fontSize: `${buttonConfig.fontSize}px`,
                    borderRadius: `${borderRadius}px`,
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  {buttonConfig.text}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowCode(!showCode)}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {showCode ? 'Ocultar Código' : 'Ver Código Generado'}
          </button>
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
          ) : formElements.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                Construye tu formulario
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Arrastra elementos al constructor para comenzar
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <PaymentDemo
                key={`${selectedTheme}-${customColor}-${borderRadius}-${fontSize}-${fontFamily}-${publicKey}-${formElements.map(e => e.id).join('-')}`}
                clientSecret={clientSecret}
                publicKey={publicKey}
                theme={selectedTheme}
                customColor={customColor}
                borderRadius={borderRadius}
                fontSize={fontSize}
                fontFamily={fontFamily}
                elements={formElements}
                buttonConfig={buttonConfig}
                isFormValid={validation.isValid}
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
