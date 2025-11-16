'use client'

import { useState, useEffect, useRef } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { ElementCard, ElementType } from './ElementCard'
import { LiveDropZone } from './LiveDropZone'
import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/styles.css'

// Collapsible Code Snippet Component
function CollapsibleCodeSnippet({
  publicKey,
  theme,
  customColor,
  borderRadius,
  fontSize,
  fontFamily,
}: {
  publicKey: string
  theme: string
  customColor: string
  borderRadius: number
  fontSize: number
  fontFamily: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const codeSnippet = `import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/styles.css'

const deonpay = DeonPay('${publicKey}')

const elements = deonpay.elements({
  clientSecret: 'pi_xxx_secret_xxx',
  appearance: {
    theme: '${theme}',
    variables: {
      colorPrimary: '${customColor}',
      borderRadius: '${borderRadius}px',
      fontSize: '${fontSize}px',
      fontFamily: '${fontFamily}',
    },
  },
})

// Mount elements
const paymentElement = elements.create('payment')
paymentElement.mount('#payment-element')

const billingElement = elements.create('billing')
billingElement.mount('#billing-element')

// Handle payment
await deonpay.confirmPayment({
  elements,
  confirmParams: {
    return_url: window.location.origin + '/success',
  },
})`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Ver Código de Integración
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-3 relative">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white rounded text-xs hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
          >
            {copied ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copiado
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copiar
              </>
            )}
          </button>
          <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  )
}

interface ThemeConfig {
  name: 'flat' | 'classic' | 'dark'
  displayName: string
  description: string
  primaryColor: string
}

interface LivePaymentBuilderProps {
  publicKey: string
  secretKey: string
  theme: 'flat' | 'classic' | 'dark'
  customColor: string
  borderRadius: number
  fontSize: number
  fontFamily: string
  buttonConfig: {
    backgroundColor?: string
    textColor?: string
    fontFamily?: string
    fontSize?: number
    borderRadius?: number
    text?: string
  }
  backgroundColor: string
  onElementsChange: (elements: ElementType[]) => void
  showValidationWarning: boolean
  onThemeChange: (theme: 'flat' | 'classic' | 'dark') => void
  onColorChange: (color: string) => void
  onBorderRadiusChange: (radius: number) => void
  onFontSizeChange: (size: number) => void
  onFontFamilyChange: (font: string) => void
  onButtonConfigChange: (config: any) => void
  onBackgroundColorChange: (color: string) => void
  themes: ThemeConfig[]
}

const availableElements: ElementType[] = [
  {
    id: 'payment-available',
    type: 'payment',
    name: 'Elemento de Pago',
    description: 'Número de tarjeta, fecha de expiración, CVV y nombre del titular',
    icon: 'payment',
  },
  {
    id: 'billing-available',
    type: 'billing',
    name: 'Detalles de Facturación',
    description: 'Nombre, correo, teléfono y dirección del cliente',
    icon: 'billing',
  },
]

export function LivePaymentBuilder({
  publicKey,
  secretKey,
  theme,
  customColor,
  borderRadius,
  fontSize,
  fontFamily,
  buttonConfig,
  backgroundColor,
  onElementsChange,
  showValidationWarning,
  onThemeChange,
  onColorChange,
  onBorderRadiusChange,
  onFontSizeChange,
  onFontFamilyChange,
  onButtonConfigChange,
  onBackgroundColorChange,
  themes,
}: LivePaymentBuilderProps) {
  const [droppedElements, setDroppedElements] = useState<ElementType[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [amount, setAmount] = useState(10000) // Centavos MXN = $100.00 MXN
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  const deonpayRef = useRef<any>(null)
  const elementsRef = useRef<any>(null)
  const elementsMountedRef = useRef(false)

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

  // Create payment intent when amount changes or keys change
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (secretKey === 'sk_test_demo_key' || publicKey === 'pk_test_demo_key') {
        setError('Por favor, configura tus API Keys reales en la sección "Configuración de API Keys"')
        return
      }

      setLoading(true)
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
            amount: amount,
            currency: 'MXN',
            description: `Playground payment - ${(amount / 100).toFixed(2)} MXN`,
          }),
        })

        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text()
          setError(`Error: La API devolvió una respuesta no-JSON. Status: ${res.status}`)
          return
        }

        const data = await res.json()

        if (!res.ok) {
          const errorMsg = data.error?.message || data.message || 'Error desconocido'
          setError(`Error al crear payment intent: ${errorMsg}`)
          return
        }

        if (data.client_secret) {
          setClientSecret(data.client_secret)
          // Re-mount elements with new client secret
          elementsMountedRef.current = false
        } else {
          setError('Error: No se recibió el client_secret')
        }
      } catch (err: any) {
        setError(`Error al conectar con la API: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    createPaymentIntent()
  }, [amount, secretKey, publicKey])

  // Mount DeonPay elements when client secret is available or when appearance changes
  useEffect(() => {
    if (!clientSecret) return

    // Force re-mount when appearance changes
    elementsMountedRef.current = false

    const mountElements = () => {
      try {
        // Properly unmount previous React instances before re-mounting
        if (elementsRef.current) {
          const elements = elementsRef.current.getElements()
          elements.forEach((element: any) => {
            try {
              element.unmount()
            } catch (e) {
              // Ignore unmount errors
            }
          })
        }

        const deonpay = DeonPay(publicKey, {
          apiUrl: 'https://api.deonpay.mx'
        })

        const elements = deonpay.elements({
          clientSecret,
          appearance: {
            theme,
            variables: {
              colorPrimary: customColor,
              borderRadius: `${borderRadius}px`,
              fontSize: `${fontSize}px`,
              fontFamily: fontFamily,
            },
          },
        })

        deonpayRef.current = deonpay
        elementsRef.current = elements
        elementsMountedRef.current = true
        setMounted(true)

        // Mount elements if they're already dropped
        const hasPaymentElement = droppedElements.some(el => el.type === 'payment')
        const hasBillingElement = droppedElements.some(el => el.type === 'billing')

        if (hasPaymentElement) {
          const paymentElement = elements.create('payment')
          paymentElement.mount('#live-payment-element')
        }

        if (hasBillingElement) {
          const billingElement = elements.create('billing', {
            fields: {
              name: 'auto',
              email: 'auto',
              phone: 'auto',
              address: {
                line1: 'auto',
                line2: 'auto',
                city: 'auto',
                state: 'auto',
                postal_code: 'auto',
                country: 'auto',
              },
            },
          })
          billingElement.mount('#live-billing-element')
        }
      } catch (err: any) {
        console.error('Error mounting elements:', err)
        setError(`Error al cargar el formulario: ${err.message}`)
      }
    }

    // Small delay to ensure DOM is ready
    setTimeout(mountElements, 100)
  }, [clientSecret, publicKey, theme, customColor, borderRadius, fontSize, fontFamily, droppedElements])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const addElement = (draggedElement: ElementType) => {
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

      // Mount the element immediately after dropping
      if (elementsRef.current) {
        setTimeout(() => {
          if (draggedElement.type === 'payment' && !document.querySelector('#live-payment-element > *')) {
            const paymentElement = elementsRef.current.create('payment')
            paymentElement.mount('#live-payment-element')
          }
          if (draggedElement.type === 'billing' && !document.querySelector('#live-billing-element > *')) {
            const billingElement = elementsRef.current.create('billing', {
              fields: {
                name: 'auto',
                email: 'auto',
                phone: 'auto',
                address: {
                  line1: 'auto',
                  line2: 'auto',
                  city: 'auto',
                  state: 'auto',
                  postal_code: 'auto',
                  country: 'auto',
                },
              },
            })
            billingElement.mount('#live-billing-element')
          }
        }, 100)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && over.id === 'live-drop-zone') {
      const draggedElement = active.data.current as ElementType
      addElement(draggedElement)
    }

    setActiveId(null)
  }

  const handleTapAdd = (element: ElementType) => {
    addElement(element)
  }

  const handleRemove = (id: string) => {
    const element = droppedElements.find(el => el.id === id)
    if (element) {
      // Clean up the mounted element
      const elementId = element.type === 'payment' ? 'live-payment-element' : 'live-billing-element'
      const domElement = document.getElementById(elementId)
      if (domElement) {
        domElement.innerHTML = ''
      }
    }

    const updatedElements = droppedElements.filter(el => el.id !== id)
    setDroppedElements(updatedElements)
    onElementsChange(updatedElements)
  }

  const handlePayment = async () => {
    if (!deonpayRef.current || !elementsRef.current) {
      setError('Elementos no inicializados')
      return
    }

    setProcessing(true)
    setError('')
    setResult(null)

    try {
      const { error, paymentIntent } = await deonpayRef.current.confirmPayment({
        elements: elementsRef.current,
        confirmParams: {
          return_url: window.location.origin + '/success',
        },
        redirect: 'if_required',
      })

      if (error) {
        setError(error.message)
      } else {
        setResult(paymentIntent)
      }
    } catch (err: any) {
      setError(err.message || 'El pago falló')
    } finally {
      setProcessing(false)
    }
  }

  const handleAmountChange = (value: string) => {
    const numericValue = parseFloat(value)
    if (!isNaN(numericValue) && numericValue > 0) {
      setAmount(Math.round(numericValue * 100))
    }
  }

  const activeElement = activeId ? availableElements.find(el => el.id === activeId) : null

  const [customizationTab, setCustomizationTab] = useState<'theme' | 'button' | 'background'>('theme')
  const [isElementsCollapsed, setIsElementsCollapsed] = useState(false)
  const [isCustomizationCollapsed, setIsCustomizationCollapsed] = useState(false)

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-full flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar - Compact Elements - Collapsible on Mobile */}
        <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 lg:overflow-y-auto">
          {/* Collapsible header for mobile */}
          <button
            onClick={() => setIsElementsCollapsed(!isElementsCollapsed)}
            className="lg:hidden w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Elementos Disponibles
            </h3>
            <svg
              className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isElementsCollapsed ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Desktop title (always visible) */}
          <div className="hidden lg:block p-4 pb-0">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Elementos
            </h3>
          </div>

          {/* Content - collapsible on mobile, always visible on desktop */}
          <div className={`p-4 ${isElementsCollapsed ? 'hidden lg:block' : 'block'}`}>
            <div className="space-y-3">
            {availableElements.map((element) => {
              const isUsed = droppedElements.some(el => el.type === element.type)
              return (
                <div key={element.id} className={isUsed ? 'opacity-50 pointer-events-none' : ''}>
                  {isUsed ? (
                    <div className="relative">
                      <ElementCard element={element} onTapAdd={handleTapAdd} />
                      <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70 rounded-lg flex items-center justify-center">
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Agregado
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ElementCard element={element} onTapAdd={handleTapAdd} />
                  )}
                </div>
              )
            })}
            </div>
          </div>
        </div>

        {/* Center - Payment Form - Full width on mobile, flexible on desktop */}
        <div className="flex-1 overflow-hidden p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 flex flex-col">
          {/* Warning banner for demo keys */}
          {(secretKey === 'sk_test_demo_key' || publicKey === 'pk_test_demo_key') && droppedElements.length > 0 && (
            <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                    Configuracion requerida
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                    Los elementos se cargaran cuando configures tus API Keys en el Manager. Actualmente estas usando claves de demostración.
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    Ve a la seccion "Configuracion de API Keys" arriba para ingresar tus claves reales.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Scaled container for payment preview */}
          <div className="flex-1 overflow-y-auto">
            <div className="origin-top" style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
              <LiveDropZone
                elements={droppedElements}
                onRemove={handleRemove}
                amount={amount}
                onAmountChange={handleAmountChange}
                onPayment={handlePayment}
                loading={loading}
                processing={processing}
                error={error}
                result={result}
                buttonConfig={buttonConfig}
                customColor={customColor}
                borderRadius={borderRadius}
                fontFamily={fontFamily}
                mounted={mounted}
                hasPaymentElement={droppedElements.some(el => el.type === 'payment')}
                backgroundColor={backgroundColor}
              />
            </div>
          </div>

          {showValidationWarning && (
            <div className="mt-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                      CyberSource requiere información de facturación
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                      Agrega "Detalles de Facturación"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Unified Customization - Full width on mobile, fixed width on desktop */}
        <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 lg:overflow-y-auto">
          {/* Collapsible header for mobile */}
          <button
            onClick={() => setIsCustomizationCollapsed(!isCustomizationCollapsed)}
            className="lg:hidden w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Personalización
            </h3>
            <svg
              className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isCustomizationCollapsed ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Content - collapsible on mobile, always visible on desktop */}
          <div className={`p-4 ${isCustomizationCollapsed ? 'hidden lg:block' : 'block'}`}>
            <h3 className="hidden lg:block text-sm font-bold text-gray-900 dark:text-white mb-4">
              Personalización
            </h3>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
              <button
                onClick={() => setCustomizationTab('theme')}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  customizationTab === 'theme'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Tema
              </button>
              <button
                onClick={() => setCustomizationTab('button')}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  customizationTab === 'button'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Botón
              </button>
              <button
                onClick={() => setCustomizationTab('background')}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  customizationTab === 'background'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Fondo
              </button>
            </div>

            {/* Theme Tab */}
            {customizationTab === 'theme' && (
              <div className="space-y-4">
                {/* Theme Selection */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tema Base
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {themes.map((t) => (
                      <button
                        key={t.name}
                        onClick={() => onThemeChange(t.name)}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          theme === t.name
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                          {t.displayName}
                        </div>
                        <div className="h-2 rounded" style={{ backgroundColor: t.primaryColor }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Color */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Primario
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => onColorChange(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => onColorChange(e.target.value)}
                      className="flex-1 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Border Radius */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Border Radius: {borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={borderRadius}
                    onChange={(e) => onBorderRadiusChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="18"
                    value={fontSize}
                    onChange={(e) => onFontSizeChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Font Family */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Letra
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => onFontFamilyChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white cursor-pointer"
                    style={{ fontFamily: fontFamily }}
                  >
                    <option value="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif">
                      System (Default)
                    </option>
                    <option value="'Inter', -apple-system, BlinkMacSystemFont, sans-serif">
                      Inter
                    </option>
                    <option value="'Roboto', -apple-system, BlinkMacSystemFont, sans-serif">
                      Roboto
                    </option>
                    <option value="'Poppins', -apple-system, BlinkMacSystemFont, sans-serif">
                      Poppins
                    </option>
                    <option value="Georgia, 'Times New Roman', serif">
                      Georgia
                    </option>
                    <option value="'Courier New', Courier, monospace">
                      Courier New
                    </option>
                  </select>
                </div>
              </div>
            )}

            {/* Button Tab */}
            {customizationTab === 'button' && (
              <div className="space-y-4">
                {/* Button Text Color */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color del Texto
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={buttonConfig.textColor || '#ffffff'}
                      onChange={(e) => onButtonConfigChange({ ...buttonConfig, textColor: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={buttonConfig.textColor || '#ffffff'}
                      onChange={(e) => onButtonConfigChange({ ...buttonConfig, textColor: e.target.value })}
                      className="flex-1 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Button Font Size */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tamaño de Fuente: {buttonConfig.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={buttonConfig.fontSize}
                    onChange={(e) => onButtonConfigChange({ ...buttonConfig, fontSize: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Preview */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista Previa:</p>
                  <button
                    className="w-full font-semibold py-2.5 px-4 shadow-lg flex items-center justify-center gap-2 text-sm"
                    style={{
                      backgroundColor: customColor,
                      color: buttonConfig.textColor,
                      fontSize: `${buttonConfig.fontSize}px`,
                      borderRadius: `${borderRadius}px`,
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Pagar $100.00
                  </button>
                </div>
              </div>
            )}

            {/* Background Tab */}
            {customizationTab === 'background' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color de Fondo del Formulario
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => onBackgroundColorChange(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => onBackgroundColorChange(e.target.value)}
                      className="flex-1 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Cambia el color de fondo del contenedor del formulario de pago
                  </p>
                </div>

                {/* Quick presets */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Presets Rápidos
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => onBackgroundColorChange('#ffffff')}
                      className="h-10 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
                      style={{ backgroundColor: '#ffffff' }}
                      title="Blanco"
                    />
                    <button
                      onClick={() => onBackgroundColorChange('#f9fafb')}
                      className="h-10 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
                      style={{ backgroundColor: '#f9fafb' }}
                      title="Gris claro"
                    />
                    <button
                      onClick={() => onBackgroundColorChange('#1f2937')}
                      className="h-10 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
                      style={{ backgroundColor: '#1f2937' }}
                      title="Gris oscuro"
                    />
                    <button
                      onClick={() => onBackgroundColorChange('#000000')}
                      className="h-10 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
                      style={{ backgroundColor: '#000000' }}
                      title="Negro"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Code Snippet Section - Collapsible */}
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <CollapsibleCodeSnippet
                publicKey={publicKey}
                theme={theme}
                customColor={customColor}
                borderRadius={borderRadius}
                fontSize={fontSize}
                fontFamily={fontFamily}
              />
            </div>
          </div>
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