'use client'

import { useState } from 'react'
import { StepCard } from '../ui/StepCard'
import { CodeBlock } from '../ui/CodeBlock'

const steps = [
  {
    number: 1,
    title: 'Instalación',
    description: 'Instala el SDK de DeonPay Elements en tu proyecto',
    code: `# Con npm
npm install @deonpay/elements-sdk

# Con yarn
yarn add @deonpay/elements-sdk

# Con pnpm
pnpm add @deonpay/elements-sdk`
  },
  {
    number: 2,
    title: 'Configuración Inicial',
    description: 'Importa y configura DeonPay en tu aplicación',
    code: `import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/styles.css'

// Inicializa DeonPay con tu API key
const deonpay = DeonPay('pk_tu_api_key_aqui', {
  apiUrl: 'https://api.deonpay.mx' // Opcional: URL de la API
})`
  },
  {
    number: 3,
    title: 'Crear Payment Intent (Backend)',
    description: 'Crea un Payment Intent desde tu servidor para comenzar el proceso de pago',
    code: `// Backend (Node.js/Express ejemplo)
const fetch = require('node-fetch')

app.post('/create-payment-intent', async (req, res) => {
  try {
    const response = await fetch('https://api.deonpay.mx/api/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk_tu_secret_key_aqui' // Usa tu SECRET key
      },
      body: JSON.stringify({
        amount: 10000, // Monto en centavos (100.00 MXN)
        currency: 'MXN',
        description: 'Pago de producto',
        // Opciones adicionales
        metadata: {
          order_id: '12345',
          customer_email: 'cliente@ejemplo.com'
        }
      })
    })

    const data = await response.json()

    // Envía el client_secret al frontend
    res.json({
      clientSecret: data.client_secret
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})`
  },
  {
    number: 4,
    title: 'Montar el Formulario (Frontend)',
    description: 'Monta el formulario de pago en tu página usando el client_secret',
    code: `// Frontend (React ejemplo)
import { useEffect, useRef } from 'react'
import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/styles.css'

function CheckoutForm() {
  const elementsRef = useRef(null)

  useEffect(() => {
    async function setupPayment() {
      // 1. Obtener client_secret del backend
      const response = await fetch('/create-payment-intent', {
        method: 'POST'
      })
      const { clientSecret } = await response.json()

      // 2. Inicializar DeonPay
      const deonpay = DeonPay('pk_tu_api_key_aqui')

      // 3. Crear Elements con configuración
      const elements = deonpay.elements({
        clientSecret,
        appearance: {
          theme: 'flat', // 'flat', 'classic', o 'dark'
          variables: {
            colorPrimary: '#0070f3',
            borderRadius: '8px'
          }
        }
      })

      // 4. Crear y montar Payment Element
      const paymentElement = elements.create('payment')
      paymentElement.mount('#payment-element')

      elementsRef.current = { deonpay, elements }
    }

    setupPayment()
  }, [])

  return (
    <form id="payment-form">
      {/* El formulario se montará aquí */}
      <div id="payment-element"></div>
      <button type="submit">Pagar</button>
    </form>
  )
}`
  },
  {
    number: 5,
    title: 'Procesar el Pago',
    description: 'Maneja el envío del formulario y confirma el pago',
    code: `async function handleSubmit(event) {
  event.preventDefault()

  const { deonpay, elements } = elementsRef.current

  // Confirmar el pago
  const { error, paymentIntent } = await deonpay.confirmPayment({
    elements: elements,
    confirmParams: {
      return_url: window.location.origin + '/success', // URL de éxito
      // Datos adicionales opcionales
      payment_method_data: {
        billing_details: {
          name: 'Juan Pérez',
          email: 'juan@ejemplo.com'
        }
      }
    },
    redirect: 'if_required' // No redirigir si no es necesario (ej: 3DS)
  })

  if (error) {
    // Mostrar error al usuario
    console.error(error.message)
    alert('Error: ' + error.message)
  } else {
    // Pago exitoso
    console.log('Pago exitoso:', paymentIntent)

    // Redirigir o mostrar mensaje de éxito
    if (paymentIntent.status === 'succeeded') {
      alert('¡Pago exitoso!')
      // Redirigir a página de éxito
      window.location.href = '/success'
    }
  }
}`
  },
  {
    number: 6,
    title: 'Webhooks (Recomendado)',
    description: 'Configura webhooks para recibir notificaciones de eventos de pago',
    code: `// Backend - Endpoint para recibir webhooks
app.post('/webhooks/deonpay', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['deonpay-signature']
  const payload = req.body

  try {
    // Verificar la firma del webhook
    const event = verifyWebhookSignature(payload, signature, 'tu_webhook_secret')

    // Manejar diferentes eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Pago exitoso - Actualizar base de datos
        const paymentIntent = event.data.object
        await updateOrderStatus(paymentIntent.metadata.order_id, 'paid')
        break

      case 'payment_intent.payment_failed':
        // Pago fallido - Notificar al usuario
        console.log('Pago fallido:', event.data.object)
        break

      case 'charge.refunded':
        // Reembolso procesado
        console.log('Reembolso:', event.data.object)
        break
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Error en webhook:', error)
    res.status(400).send('Webhook Error: ' + error.message)
  }
})

// Eventos disponibles:
// - payment_intent.created
// - payment_intent.succeeded
// - payment_intent.payment_failed
// - payment_intent.canceled
// - charge.succeeded
// - charge.failed
// - charge.refunded`
  }
]

export function IntegrationGuide() {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <div id="integration" className="max-w-7xl mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Guía de Integración
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Sigue estos pasos para integrar DeonPay Elements en tu aplicación.
          La integración completa toma aproximadamente 5-10 minutos.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700 rounded-full -translate-y-1/2" />
          <div
            className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full -translate-y-1/2 transition-all duration-500"
            style={{ width: `${(activeStep / steps.length) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() => setActiveStep(step.number)}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                  activeStep >= step.number
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-110'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                } hover:scale-125`}
              >
                {step.number}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          {steps.map((step) => (
            <div key={step.number} className="text-center" style={{ width: '80px' }}>
              <p className={`text-xs font-medium ${
                activeStep >= step.number
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-500'
              }`}>
                Paso {step.number}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-8 max-w-5xl mx-auto">
        {steps.map((step) => (
          <StepCard
            key={step.number}
            number={step.number}
            title={step.title}
            description={step.description}
            isActive={activeStep === step.number}
          >
            <CodeBlock
              code={step.code}
              language={step.number === 1 ? 'bash' : 'typescript'}
              title={`Paso ${step.number}: ${step.title}`}
              maxHeight="400px"
            />

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-6">
              {step.number > 1 && (
                <button
                  onClick={() => setActiveStep(step.number - 1)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>
              )}
              {step.number < steps.length && (
                <button
                  onClick={() => setActiveStep(step.number + 1)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-auto"
                >
                  Siguiente
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              {step.number === steps.length && (
                <button
                  onClick={() => setActiveStep(1)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-auto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Completado - Volver al inicio
                </button>
              )}
            </div>
          </StepCard>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="mt-16 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border border-blue-200 dark:border-gray-700 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Recursos Adicionales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="https://docs.deonpay.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg hover:shadow-lg transition-shadow"
            >
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Documentación API
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Referencia completa de la API REST
                </p>
              </div>
            </a>

            <a
              href="https://github.com/deonpay/elements-examples"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg hover:shadow-lg transition-shadow"
            >
              <svg className="w-6 h-6 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Ejemplos en GitHub
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Proyectos de ejemplo completos
                </p>
              </div>
            </a>

            <a
              href="https://dashboard.deonpay.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg hover:shadow-lg transition-shadow"
            >
              <svg className="w-6 h-6 text-pink-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Dashboard
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gestiona tus pagos y API keys
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
