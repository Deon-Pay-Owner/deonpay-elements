'use client'

import { useEffect, useState, useRef } from 'react'
import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/styles.css'

interface PaymentDemoProps {
  clientSecret: string
  theme?: 'flat' | 'classic' | 'dark'
  customColor?: string
  borderRadius?: number
  fontSize?: number
  fontFamily?: string
}

export function PaymentDemo({
  clientSecret,
  theme = 'flat',
  customColor = '#0070f3',
  borderRadius = 8,
  fontSize = 14,
  fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
}: PaymentDemoProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [result, setResult] = useState<any>(null)
  const elementMounted = useRef(false)
  const deonpayRef = useRef<any>(null)
  const elementsRef = useRef<any>(null)

  useEffect(() => {
    if (elementMounted.current) return

    try {
      const deonpay = DeonPay('pk_test_demo_key', {
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

      const paymentElement = elements.create('payment')
      paymentElement.mount('#payment-element')

      paymentElement.on('change', (event: any) => {
        if (event.error) {
          setError(event.error.message)
        } else {
          setError('')
        }
      })

      deonpayRef.current = deonpay
      elementsRef.current = elements
      elementMounted.current = true
      setMounted(true)
    } catch (err: any) {
      console.error('Error mounting elements:', err)
      setError(`Error al cargar el formulario: ${err.message}`)
    }
  }, [clientSecret, theme, customColor, borderRadius, fontSize, fontFamily])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      if (!deonpayRef.current || !elementsRef.current) {
        throw new Error('Elements no inicializado')
      }

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
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Payment Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Formulario de Pago
          </h3>
          <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-semibold">
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div id="payment-element" className="mb-6"></div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !mounted}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pagar $100.00 MXN
              </>
            )}
          </button>
        </form>

        {!mounted && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Cargando formulario...
            </p>
          </div>
        )}
      </div>

      {/* Result Display */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Respuesta
        </h3>

        {result ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-green-800 dark:text-green-400">
                  Pago Exitoso
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
              <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">
              Esperando pago
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Completa el formulario para ver la respuesta
            </p>
          </div>
        )}

        {/* Test Cards */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Tarjetas de Prueba
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Exitoso:</span>
              <code className="text-gray-900 dark:text-white font-mono text-xs">4242 4242 4242 4242</code>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Rechazado:</span>
              <code className="text-gray-900 dark:text-white font-mono text-xs">4000 0000 0000 0002</code>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">3DS:</span>
              <code className="text-gray-900 dark:text-white font-mono text-xs">4000 0027 6000 3184</code>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 px-3">
            Usa cualquier fecha futura y CVV de 3 dígitos
          </p>
        </div>
      </div>
    </div>
  )
}
