'use client'

import { useEffect, useState } from 'react'
import { PaymentDemo } from './components/PaymentDemo'

export default function PlaygroundPage() {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [theme, setTheme] = useState<'flat' | 'stripe' | 'dark'>('flat')
  const [error, setError] = useState<string>('')

  // Create payment intent on mount
  useEffect(() => {
    async function createPaymentIntent() {
      try {
        const res = await fetch('https://api.deonpay.mx/api/v1/payment_intents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer pk_test_demo_key'
          },
          body: JSON.stringify({
            amount: 10000, // $100.00 MXN
            currency: 'MXN',
            description: 'Playground test payment',
          }),
        })

        const data = await res.json()
        if (data.client_secret) {
          setClientSecret(data.client_secret)
        } else {
          setError('Failed to create payment intent')
        }
      } catch (err) {
        console.error('Error creating payment intent:', err)
        setError('Failed to create payment intent')
      }
    }

    createPaymentIntent()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            DeonPay Elements Playground
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Interactive demo of the DeonPay Elements SDK
          </p>
        </div>

        {/* Theme Selector */}
        <div className="mb-8 text-center">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme
          </label>
          <div className="inline-flex gap-2">
            {(['flat', 'stripe', 'dark'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Payment Demo */}
        {clientSecret ? (
          <PaymentDemo key={theme} clientSecret={clientSecret} theme={theme} />
        ) : !error ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Creating payment intent...
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
