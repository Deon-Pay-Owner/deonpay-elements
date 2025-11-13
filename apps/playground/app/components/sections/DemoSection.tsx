'use client'

import { useState, useEffect } from 'react'
import { ThemeCard } from '../ui/ThemeCard'
import { ColorPicker } from '../ui/ColorPicker'
import { FontPicker } from '../ui/FontPicker'
import { ApiKeysConfig } from '../ui/ApiKeysConfig'
import { CodeBlock } from '../ui/CodeBlock'
import { LivePaymentBuilder } from '../builder/LivePaymentBuilder'
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

interface ButtonConfig {
  backgroundColor?: string
  textColor?: string
  fontFamily?: string
  fontSize?: number
  borderRadius?: number
  text?: string
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
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>('flat')
  const [customColor, setCustomColor] = useState('#6366f1')
  const [borderRadius, setBorderRadius] = useState(8)
  const [fontSize, setFontSize] = useState(14)
  const [fontFamily, setFontFamily] = useState('-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif')
  const [showCode, setShowCode] = useState(false)

  // API Keys state
  const [publicKey, setPublicKey] = useState('pk_test_demo_key')
  const [secretKey, setSecretKey] = useState('sk_test_demo_key')
  const [keysVersion, setKeysVersion] = useState(0)

  // Form builder state
  const [formElements, setFormElements] = useState<ElementType[]>([])

  // Button customization state
  const [buttonConfig, setButtonConfig] = useState<ButtonConfig>({
    backgroundColor: undefined, // Will use customColor
    textColor: '#ffffff',
    fontFamily: undefined, // Will use fontFamily
    fontSize: 16,
    borderRadius: undefined, // Will use borderRadius
    text: 'Pagar',
  })

  // Form validation
  const validation = useFormValidation(formElements, secretKey)

  // Load API keys from localStorage on mount
  useEffect(() => {
    const savedPublicKey = localStorage.getItem('deonpay_public_key')
    const savedSecretKey = localStorage.getItem('deonpay_secret_key')

    if (savedPublicKey) setPublicKey(savedPublicKey)
    if (savedSecretKey) setSecretKey(savedSecretKey)
  }, [])

  // Update color when theme changes
  useEffect(() => {
    const theme = themes.find(t => t.name === selectedTheme)
    if (theme) {
      setCustomColor(theme.primaryColor)
    }
  }, [selectedTheme])

  // Handler to save API keys
  const handleSaveKeys = () => {
    localStorage.setItem('deonpay_public_key', publicKey)
    localStorage.setItem('deonpay_secret_key', secretKey)
    setKeysVersion(v => v + 1) // Force recreation of payment intent in the builder
  }

  const generatedCode = `import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/styles.css'

const deonpay = DeonPay('${publicKey}')

const elements = deonpay.elements({
  clientSecret: 'pi_xxx_secret_xxx',
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

// Mount payment element
const paymentElement = elements.create('payment')
paymentElement.mount('#payment-element')

// Mount billing element (if needed)
const billingElement = elements.create('billing')
billingElement.mount('#billing-element')

// Handle form submission
const form = document.getElementById('payment-form')
form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const { error, paymentIntent } = await deonpay.confirmPayment({
    elements,
    confirmParams: {
      return_url: window.location.origin + '/success',
    },
    redirect: 'if_required',
  })

  if (error) {
    console.error(error)
  } else {
    console.log('Payment successful!', paymentIntent)
  }
})`

  return (
    <div id="demo" className="max-w-7xl mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Playground de Pagos en Vivo
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Construye y prueba tu formulario de pago con transacciones reales.
          Arrastra elementos, configura el monto y procesa pagos que aparecerán en tu dashboard.
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

      {/* Live Payment Builder - The main unified interface */}
      <div className="mb-12">
        <LivePaymentBuilder
          key={keysVersion} // Re-mount when keys change
          publicKey={publicKey}
          secretKey={secretKey}
          theme={selectedTheme}
          customColor={customColor}
          borderRadius={borderRadius}
          fontSize={fontSize}
          fontFamily={fontFamily}
          buttonConfig={buttonConfig}
          onElementsChange={setFormElements}
          showValidationWarning={validation.requiresBillingElement && validation.hasPaymentElement && !validation.hasBillingElement}
        />
      </div>

      {/* Theme Selection */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Personaliza el Tema
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
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
                Pagar $100.00 MXN
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowCode(!showCode)}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {showCode ? 'Ocultar Código' : 'Ver Código de Integración'}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Code */}
      {showCode && (
        <div className="mb-12 animate-fade-in">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Código de Integración
          </h3>
          <CodeBlock
            code={generatedCode}
            language="typescript"
            title="Configuración de DeonPay Elements"
          />
        </div>
      )}

      {/* Info Box */}
      <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-900 dark:text-blue-200">
            <p className="font-semibold mb-2">Cómo usar este playground:</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Configura tus API Keys (PK y SK)</li>
              <li>Arrastra el "Elemento de Pago" al formulario</li>
              <li>Opcionalmente agrega "Detalles de Facturación" (requerido para CyberSource)</li>
              <li>Ajusta el monto a cobrar en el campo superior</li>
              <li>Llena los datos de la tarjeta</li>
              <li>Haz clic en el botón de pagar</li>
              <li>¡La transacción aparecerá en tu dashboard!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}