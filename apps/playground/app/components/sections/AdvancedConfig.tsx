'use client'

import { CodeBlock } from '../ui/CodeBlock'

export function AdvancedConfig() {
  const validationCode = `// Validación personalizada de campos
const paymentElement = elements.create('payment', {
  fields: {
    billingDetails: {
      name: 'auto',  // 'auto', 'never'
      email: 'auto',
      phone: 'never',
      address: {
        line1: 'never',
        line2: 'never',
        city: 'never',
        state: 'never',
        postalCode: 'auto',
        country: 'auto'
      }
    }
  },
  terms: {
    card: 'never' // 'auto', 'always', 'never'
  }
})

// Escuchar eventos de validación
paymentElement.on('change', (event) => {
  if (event.complete) {
    console.log('Formulario completo y válido')
  } else if (event.error) {
    console.error('Error de validación:', event.error.message)
  }
})`

  const errorHandlingCode = `async function handlePayment() {
  try {
    const { error, paymentIntent } = await deonpay.confirmPayment({
      elements,
      redirect: 'if_required'
    })

    if (error) {
      // Tipos de errores comunes
      switch (error.type) {
        case 'card_error':
          // Error con la tarjeta (declinada, fondos insuficientes, etc.)
          showError('Error con la tarjeta: ' + error.message)
          break

        case 'validation_error':
          // Datos de pago inválidos
          showError('Por favor revisa los datos ingresados')
          break

        case 'api_error':
          // Error del servidor
          showError('Error del servidor. Intenta de nuevo.')
          break

        case 'authentication_error':
          // Error de autenticación 3DS
          showError('Error de autenticación')
          break

        default:
          showError('Ocurrió un error inesperado')
      }

      // Log para debugging
      console.error('Payment error:', {
        type: error.type,
        code: error.code,
        message: error.message,
        declineCode: error.decline_code
      })

    } else {
      // Verificar estados del payment intent
      switch (paymentIntent.status) {
        case 'succeeded':
          showSuccess('¡Pago exitoso!')
          redirectToSuccess()
          break

        case 'processing':
          showInfo('Pago en proceso...')
          // Mostrar estado de procesamiento
          break

        case 'requires_payment_method':
          showError('Método de pago inválido')
          break

        case 'requires_action':
          // 3DS u otra acción requerida
          // DeonPay maneja esto automáticamente
          break
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    showError('Error inesperado. Por favor contacta a soporte.')
  }
}`

  const threeDSCode = `// Configurar 3D Secure
const { error, paymentIntent } = await deonpay.confirmPayment({
  elements,
  confirmParams: {
    return_url: window.location.origin + '/success'
  },
  redirect: 'if_required' // Solo redirige si es necesario (ej: 3DS)
})

// Si se requiere 3DS, DeonPay:
// 1. Abre el modal de autenticación automáticamente
// 2. Espera la verificación del usuario
// 3. Completa el pago o retorna error

// Manejar el retorno de 3DS
if (window.location.search.includes('payment_intent')) {
  const urlParams = new URLSearchParams(window.location.search)
  const clientSecret = urlParams.get('payment_intent_client_secret')

  const deonpay = DeonPay('pk_tu_api_key')

  // Obtener estado final del pago
  const { error, paymentIntent } = await deonpay.retrievePaymentIntent(clientSecret)

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Payment status:', paymentIntent.status)
  }
}`

  const testCardsCode = `// Tarjetas de prueba para diferentes escenarios

// ✅ PAGOS EXITOSOS
const successCards = {
  visa: '4242 4242 4242 4242',
  mastercard: '5555 5555 5555 4444',
  amex: '3782 822463 10005'
}

// ❌ PAGOS DECLINADOS
const declinedCards = {
  generic: '4000 0000 0000 0002',      // Declinado genérico
  insufficientFunds: '4000 0000 0000 9995', // Fondos insuficientes
  lostCard: '4000 0000 0000 9987',      // Tarjeta perdida
  stolenCard: '4000 0000 0000 9979',    // Tarjeta robada
  expiredCard: '4000 0000 0000 0069',   // Tarjeta expirada
  incorrectCVC: '4000 0000 0000 0127',  // CVC incorrecto
  processingError: '4000 0000 0000 0119' // Error de procesamiento
}

// 🔐 3D SECURE
const threeDSCards = {
  required: '4000 0027 6000 3184',      // Requiere autenticación 3DS
  optional: '4000 0025 0000 3155',      // 3DS opcional
  notSupported: '4000 0000 0000 3055'   // No soporta 3DS
}

// 🌍 TARJETAS INTERNACIONALES
const internationalCards = {
  mexicanCard: '4000 0048 4000 0000',   // Tarjeta mexicana
  usCard: '4000 0084 0000 0000',        // Tarjeta estadounidense
  canadianCard: '4000 0012 4000 0000'   // Tarjeta canadiense
}

// 💡 Uso en testing
// - Usa cualquier fecha futura para expiración
// - Usa cualquier CVV de 3 dígitos (4 para AMEX)
// - Usa cualquier código postal válido`

  const webhooksCode = `// Verificar firma de webhook
import crypto from 'crypto'

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')

  if (signature !== expectedSignature) {
    throw new Error('Invalid webhook signature')
  }

  return payload
}

// Endpoint de webhook
app.post('/webhooks/deonpay',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['deonpay-signature']
    const webhookSecret = process.env.DEONPAY_WEBHOOK_SECRET

    try {
      const event = verifyWebhookSignature(
        req.body,
        signature,
        webhookSecret
      )

      // Manejar evento
      console.log('Webhook event:', event.type)

      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePaymentSuccess(event.data.object)
          break

        case 'payment_intent.payment_failed':
          await handlePaymentFailure(event.data.object)
          break

        case 'charge.refunded':
          await handleRefund(event.data.object)
          break
      }

      res.json({ received: true })
    } catch (error) {
      console.error('Webhook error:', error)
      res.status(400).send('Webhook Error')
    }
  }
)

// Importante: Los webhooks son esenciales para:
// - Confirmar pagos de forma confiable
// - Manejar pagos asíncronos (transferencias, etc.)
// - Recibir notificaciones de reembolsos
// - Actualizar estados de órdenes`

  return (
    <div id="advanced" className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Configuración Avanzada
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explora características avanzadas para casos de uso específicos.
        </p>
      </div>

      {/* Sections */}
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Validation */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Validaciones Personalizadas
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Controla qué campos se muestran y cómo se validan los datos del formulario.
          </p>
          <CodeBlock
            code={validationCode}
            title="Configurar campos y validaciones"
          />
        </section>

        {/* Error Handling */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Manejo de Errores
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Implementa un manejo robusto de errores para mejorar la experiencia del usuario.
          </p>
          <CodeBlock
            code={errorHandlingCode}
            title="Manejo completo de errores"
            maxHeight="600px"
          />
        </section>

        {/* 3D Secure */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            3D Secure (3DS)
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            DeonPay maneja automáticamente la autenticación 3D Secure cuando es requerida por el banco emisor.
          </p>
          <CodeBlock
            code={threeDSCode}
            title="Configuración de 3D Secure"
          />
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Importante sobre 3DS
            </h4>
            <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
              <li>• 3DS2 es obligatorio para cumplir con PSD2 en Europa</li>
              <li>• En México, algunos bancos requieren 3DS para mayor seguridad</li>
              <li>• DeonPay maneja el flujo completo automáticamente</li>
              <li>• No necesitas código adicional, solo asegúrate de configurar el return_url</li>
            </ul>
          </div>
        </section>

        {/* Test Cards */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tarjetas de Prueba
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Usa estas tarjetas para probar diferentes escenarios en modo de prueba.
          </p>
          <CodeBlock
            code={testCardsCode}
            title="Tarjetas de prueba completas"
            maxHeight="600px"
          />
        </section>

        {/* Webhooks */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Webhooks
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Los webhooks son críticos para un sistema de pagos robusto. Permiten que tu servidor
            reciba notificaciones de eventos de pago de forma confiable.
          </p>
          <CodeBlock
            code={webhooksCode}
            title="Implementar webhooks seguros"
            maxHeight="600px"
          />
        </section>

        {/* Best Practices */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Mejores Prácticas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Seguridad
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Nunca expongas tu SECRET key</li>
                    <li>• Usa HTTPS en producción</li>
                    <li>• Verifica firmas de webhooks</li>
                    <li>• Implementa rate limiting</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Performance
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Carga el SDK de forma asíncrona</li>
                    <li>• Reutiliza instancias de Elements</li>
                    <li>• Implementa loading states</li>
                    <li>• Optimiza el bundle size</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    UX
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Muestra errores claramente</li>
                    <li>• Indica estado de carga</li>
                    <li>• Valida en tiempo real</li>
                    <li>• Usa animaciones sutiles</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Testing
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Prueba todos los escenarios</li>
                    <li>• Usa tarjetas de prueba</li>
                    <li>• Verifica webhooks</li>
                    <li>• Test en múltiples navegadores</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
