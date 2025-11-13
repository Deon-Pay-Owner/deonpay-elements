'use client'

import { useEffect, useState, useRef } from 'react'
import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/styles.css'

interface PaymentDemoProps {
  clientSecret: string
  theme?: 'flat' | 'stripe' | 'dark'
}

export function PaymentDemo({ clientSecret, theme = 'flat' }: PaymentDemoProps) {
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
            colorPrimary: theme === 'dark' ? '#0ea5e9' : '#0070f3',
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
      setError(`Failed to load payment form: ${err.message}`)
    }
  }, [clientSecret, theme])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      if (!deonpayRef.current || !elementsRef.current) {
        throw new Error('Elements not initialized')
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
      setError(err.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Payment Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Payment Form
        </h2>

        <form onSubmit={handleSubmit}>
          <div id="payment-element" className="mb-6"></div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !mounted}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Pay $100.00 MXN'}
          </button>
        </form>

        {!mounted && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Loading payment form...
            </p>
          </div>
        )}
      </div>

      {/* Result Display */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Response
        </h2>

        {result ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm font-medium text-green-800 dark:text-green-400">
                ✓ Payment Successful
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-gray-800 dark:text-gray-200">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Submit the form to see the response
            </p>
          </div>
        )}

        {/* Test Cards */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Test Cards
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Success:</span>
              <code className="text-gray-900 dark:text-white font-mono">4242 4242 4242 4242</code>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Decline:</span>
              <code className="text-gray-900 dark:text-white font-mono">4000 0000 0000 0002</code>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">3DS Required:</span>
              <code className="text-gray-900 dark:text-white font-mono">4000 0027 6000 3184</code>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 pt-2">
              Use any future expiry date and any 3-digit CVV
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
