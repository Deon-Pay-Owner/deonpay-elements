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
  backgroundColor: string
  borderRadius: number
  fontSize: number
  fontFamily: string
}

interface ButtonConfig {
  backgroundColor?: string
  textColor?: string
  fontFamily?: string
  fontSize?: number
  borderRadius?: number
  text?: string
}

// Complete theme presets with all default values matching the SDK base.css
const themes: ThemeConfig[] = [
  {
    name: 'flat',
    displayName: 'Flat',
    description: 'Diseño moderno y minimalista - fondo blanco, bordes suaves, fuente Inter, esquinas redondeadas',
    primaryColor: '#6366f1', // Indigo vibrante
    backgroundColor: '#ffffff', // Clean white
    borderRadius: 12, // Smooth rounded corners
    fontSize: 15, // Modern readable size
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
  },
  {
    name: 'classic',
    displayName: 'Classic',
    description: 'Estilo profesional corporativo - fondo gris claro, bordes definidos, fuente Georgia serif, etiquetas mayúsculas',
    primaryColor: '#8b5cf6', // Púrpura elegante
    backgroundColor: '#fafafa', // Soft gray background
    borderRadius: 6, // Defined corners
    fontSize: 15, // Professional size
    fontFamily: "'Georgia', 'Times New Roman', serif"
  },
  {
    name: 'dark',
    displayName: 'Dark',
    description: 'Modo oscuro elegante - fondo slate oscuro, sombras luminosas, fuente Poppins, esquinas muy redondeadas',
    primaryColor: '#06b6d4', // Cyan brillante
    backgroundColor: '#0f172a', // Deep slate
    borderRadius: 16, // Very rounded corners
    fontSize: 14, // Compact elegant size
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  }
]

export function DemoSection() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>('flat')
  const [customColor, setCustomColor] = useState('#6366f1')
  const [borderRadius, setBorderRadius] = useState(8)
  const [fontSize, setFontSize] = useState(14)
  const [fontFamily, setFontFamily] = useState('-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif')
  const [showCode, setShowCode] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')

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

  // Auto-load ALL theme configuration when theme changes
  useEffect(() => {
    const theme = themes.find(t => t.name === selectedTheme)
    if (theme) {
      setCustomColor(theme.primaryColor)
      setBackgroundColor(theme.backgroundColor)
      setBorderRadius(theme.borderRadius)
      setFontSize(theme.fontSize)
      setFontFamily(theme.fontFamily)
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
    <div id="demo" className="w-full h-screen flex flex-col overflow-hidden">
      {/* Compact Header - Mobile Responsive */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-full">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Playground de Pagos
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Construye y prueba tu checkout con transacciones reales
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowCode(!showCode)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs sm:text-sm shadow transition-all"
            >
              {showCode ? 'Ocultar Código' : 'Ver Código'}
            </button>
          </div>
        </div>

        {/* API Keys - Compact inline */}
        <div className="mt-3">
          <ApiKeysConfig
            publicKey={publicKey}
            secretKey={secretKey}
            onPublicKeyChange={setPublicKey}
            onSecretKeyChange={setSecretKey}
            onSave={handleSaveKeys}
          />
        </div>

        {/* Validation Messages */}
        {(validation.warnings.length > 0 || validation.errors.length > 0) && (
          <div className="mt-3 space-y-2">
            {validation.warnings.map((warning, idx) => (
              <ValidationBanner key={idx} type="warning" message={warning} />
            ))}
            {validation.errors.map((error, idx) => (
              <ValidationBanner key={idx} type="error" message={error} />
            ))}
          </div>
        )}
      </div>

      {/* Main Content - No scroll needed */}
      <div className="flex-1 overflow-hidden">
        {showCode ? (
          <div className="h-full overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Código de Integración
              </h3>
              <CodeBlock
                code={generatedCode}
                language="typescript"
                title="Configuración de DeonPay Elements"
              />
            </div>
          </div>
        ) : (
          <LivePaymentBuilder
            key={keysVersion}
            publicKey={publicKey}
            secretKey={secretKey}
            theme={selectedTheme}
            customColor={customColor}
            borderRadius={borderRadius}
            fontSize={fontSize}
            fontFamily={fontFamily}
            buttonConfig={buttonConfig}
            backgroundColor={backgroundColor}
            onElementsChange={setFormElements}
            showValidationWarning={validation.requiresBillingElement && validation.hasPaymentElement && !validation.hasBillingElement}
            onThemeChange={setSelectedTheme}
            onColorChange={setCustomColor}
            onBorderRadiusChange={setBorderRadius}
            onFontSizeChange={setFontSize}
            onFontFamilyChange={setFontFamily}
            onButtonConfigChange={setButtonConfig}
            onBackgroundColorChange={setBackgroundColor}
            themes={themes}
          />
        )}
      </div>
    </div>
  )
}