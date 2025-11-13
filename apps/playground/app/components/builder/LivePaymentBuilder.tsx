'use client'

import { useState, useEffect, useRef } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { ElementCard, ElementType } from './ElementCard'
import { LiveDropZone } from './LiveDropZone'
import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/styles.css'

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
  onElementsChange: (elements: ElementType[]) => void
  showValidationWarning: boolean
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
  onElementsChange,
  showValidationWarning,
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

  // Mount DeonPay elements when client secret is available
  useEffect(() => {
    if (!clientSecret || elementsMountedRef.current) return

    const mountElements = () => {
      try {
        // Clean up previous instances
        if (deonpayRef.current || elementsRef.current) {
          const paymentEl = document.getElementById('live-payment-element')
          const billingEl = document.getElementById('live-billing-element')
          if (paymentEl) paymentEl.innerHTML = ''
          if (billingEl) billingEl.innerHTML = ''
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && over.id === 'live-drop-zone') {
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

    setActiveId(null)
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

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    <li>• Arrastra elementos para construir tu checkout</li>
                    <li>• Configura el monto a cobrar</li>
                    <li>• Haz clic en Pagar para procesar transacciones reales</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Payment Form (Drop Zone) */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Formulario de Pago en Vivo
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Construye y prueba tu checkout con transacciones reales
            </p>
          </div>

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
          />

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