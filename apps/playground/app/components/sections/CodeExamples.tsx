'use client'

import { useState } from 'react'
import { CodeBlock } from '../ui/CodeBlock'

type Framework = 'react' | 'nextjs' | 'vue' | 'vanilla' | 'angular'

interface Example {
  id: Framework
  name: string
  icon: string
  code: string
}

const examples: Example[] = [
  {
    id: 'react',
    name: 'React',
    icon: '⚛️',
    code: `import { useEffect, useRef, useState } from 'react'
import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/styles.css'

export function CheckoutForm() {
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const elementsRef = useRef(null)

  useEffect(() => {
    // Crear Payment Intent
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 10000, currency: 'MXN' })
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
  }, [])

  useEffect(() => {
    if (!clientSecret) return

    // Inicializar DeonPay Elements
    const deonpay = DeonPay('pk_tu_api_key')
    const elements = deonpay.elements({
      clientSecret,
      appearance: {
        theme: 'flat',
        variables: { colorPrimary: '#0070f3' }
      }
    })

    const paymentElement = elements.create('payment')
    paymentElement.mount('#payment-element')

    elementsRef.current = { deonpay, elements }
  }, [clientSecret])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { deonpay, elements } = elementsRef.current
    const { error, paymentIntent } = await deonpay.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/success'
      },
      redirect: 'if_required'
    })

    if (error) {
      setError(error.message)
    } else {
      console.log('Pago exitoso:', paymentIntent)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div id="payment-element" />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading || !clientSecret}>
        {loading ? 'Procesando...' : 'Pagar'}
      </button>
    </form>
  )
}`
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: '▲',
    code: `// app/checkout/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/styles.css'

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const elementsRef = useRef(null)

  useEffect(() => {
    // Crear Payment Intent usando Route Handler
    fetch('/api/payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 10000,
        currency: 'MXN'
      })
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
  }, [])

  useEffect(() => {
    if (!clientSecret) return

    const deonpay = DeonPay(process.env.NEXT_PUBLIC_DEONPAY_KEY!)
    const elements = deonpay.elements({ clientSecret })

    const paymentElement = elements.create('payment')
    paymentElement.mount('#payment-element')

    elementsRef.current = { deonpay, elements }
  }, [clientSecret])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { deonpay, elements } = elementsRef.current!
    const result = await deonpay.confirmPayment({
      elements,
      redirect: 'if_required'
    })

    if (result.error) {
      console.error(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div id="payment-element" className="mb-6" />
        <button
          type="submit"
          disabled={loading || !clientSecret}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          {loading ? 'Procesando...' : 'Pagar'}
        </button>
      </form>
    </div>
  )
}

// app/api/payment-intent/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { amount, currency } = await request.json()

  const response = await fetch('https://api.deonpay.mx/api/v1/payment_intents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${process.env.DEONPAY_SECRET_KEY}\`
    },
    body: JSON.stringify({ amount, currency })
  })

  const data = await response.json()
  return NextResponse.json({ clientSecret: data.client_secret })
}`
  },
  {
    id: 'vue',
    name: 'Vue 3',
    icon: '💚',
    code: `<!-- CheckoutForm.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <div id="payment-element"></div>
    <div v-if="error" class="error">{{ error }}</div>
    <button type="submit" :disabled="loading || !clientSecret">
      {{ loading ? 'Procesando...' : 'Pagar' }}
    </button>
  </form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/styles.css'

const clientSecret = ref('')
const loading = ref(false)
const error = ref('')
const elementsRef = ref(null)

onMounted(async () => {
  // Crear Payment Intent
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 10000, currency: 'MXN' })
  })
  const data = await response.json()
  clientSecret.value = data.clientSecret
})

watch(clientSecret, (newSecret) => {
  if (!newSecret) return

  // Inicializar DeonPay Elements
  const deonpay = DeonPay('pk_tu_api_key')
  const elements = deonpay.elements({
    clientSecret: newSecret,
    appearance: {
      theme: 'flat',
      variables: { colorPrimary: '#42b883' }
    }
  })

  const paymentElement = elements.create('payment')
  paymentElement.mount('#payment-element')

  elementsRef.value = { deonpay, elements }
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  const { deonpay, elements } = elementsRef.value
  const result = await deonpay.confirmPayment({
    elements,
    confirmParams: {
      return_url: window.location.origin + '/success'
    },
    redirect: 'if_required'
  })

  if (result.error) {
    error.value = result.error.message
  } else {
    console.log('Pago exitoso:', result.paymentIntent)
  }

  loading.value = false
}
</script>

<style scoped>
.error {
  color: red;
  margin: 1rem 0;
}
</style>`
  },
  {
    id: 'vanilla',
    name: 'Vanilla JS',
    icon: '🍦',
    code: `<!-- index.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DeonPay Checkout</title>
  <link rel="stylesheet" href="https://cdn.deonpay.mx/elements/v1/styles.css">
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 500px;
      margin: 50px auto;
      padding: 20px;
    }
    #payment-element {
      margin: 20px 0;
    }
    button {
      width: 100%;
      padding: 12px;
      background: #0070f3;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .error {
      color: red;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <h1>Checkout</h1>
  <form id="payment-form">
    <div id="payment-element"></div>
    <div id="error-message" class="error"></div>
    <button type="submit" id="submit-button">Pagar</button>
  </form>

  <script type="module">
    import DeonPay from 'https://cdn.deonpay.mx/elements/v1/deonpay-elements.js'

    let deonpay, elements

    // Crear Payment Intent
    async function initialize() {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 10000, currency: 'MXN' })
      })
      const { clientSecret } = await response.json()

      // Inicializar DeonPay
      deonpay = DeonPay('pk_tu_api_key')
      elements = deonpay.elements({
        clientSecret,
        appearance: { theme: 'flat' }
      })

      // Montar formulario
      const paymentElement = elements.create('payment')
      paymentElement.mount('#payment-element')

      // Habilitar botón
      document.getElementById('submit-button').disabled = false
    }

    // Manejar submit
    document.getElementById('payment-form').addEventListener('submit', async (e) => {
      e.preventDefault()

      const submitButton = document.getElementById('submit-button')
      submitButton.disabled = true
      submitButton.textContent = 'Procesando...'

      const { error, paymentIntent } = await deonpay.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/success'
        },
        redirect: 'if_required'
      })

      if (error) {
        document.getElementById('error-message').textContent = error.message
        submitButton.disabled = false
        submitButton.textContent = 'Pagar'
      } else {
        console.log('Pago exitoso:', paymentIntent)
        window.location.href = '/success'
      }
    })

    // Inicializar
    initialize()
  </script>
</body>
</html>`
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: '🅰️',
    code: `// checkout.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core'
import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/styles.css'

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  clientSecret: string = ''
  loading: boolean = false
  error: string = ''
  private deonpay: any
  private elements: any

  async ngOnInit() {
    // Crear Payment Intent
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 10000, currency: 'MXN' })
    })
    const data = await response.json()
    this.clientSecret = data.clientSecret

    // Inicializar DeonPay
    this.deonpay = DeonPay('pk_tu_api_key')
    this.elements = this.deonpay.elements({
      clientSecret: this.clientSecret,
      appearance: {
        theme: 'flat',
        variables: { colorPrimary: '#dd0031' }
      }
    })

    // Montar elemento
    const paymentElement = this.elements.create('payment')
    paymentElement.mount('#payment-element')
  }

  async handleSubmit(event: Event) {
    event.preventDefault()
    this.loading = true
    this.error = ''

    const result = await this.deonpay.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: window.location.origin + '/success'
      },
      redirect: 'if_required'
    })

    if (result.error) {
      this.error = result.error.message
    } else {
      console.log('Pago exitoso:', result.paymentIntent)
    }

    this.loading = false
  }
}

// checkout.component.html
<div class="checkout-container">
  <h1>Checkout</h1>
  <form (submit)="handleSubmit($event)">
    <div id="payment-element"></div>
    <div *ngIf="error" class="error">{{ error }}</div>
    <button type="submit" [disabled]="loading || !clientSecret">
      {{ loading ? 'Procesando...' : 'Pagar' }}
    </button>
  </form>
</div>`
  }
]

export function CodeExamples() {
  const [selectedFramework, setSelectedFramework] = useState<Framework>('react')

  const currentExample = examples.find(e => e.id === selectedFramework)!

  return (
    <div id="examples" className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Ejemplos de Código
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Implementaciones completas para diferentes frameworks y librerías.
          Copia y personaliza según tus necesidades.
        </p>
      </div>

      {/* Framework Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => setSelectedFramework(example.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              selectedFramework === example.id
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{example.icon}</span>
            <span>{example.name}</span>
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div className="max-w-5xl mx-auto">
        <CodeBlock
          code={currentExample.code}
          language="typescript"
          title={`Implementación completa en ${currentExample.name}`}
          maxHeight="700px"
        />

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Nota Importante
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>Reemplaza <code className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">pk_tu_api_key</code> con tu API key pública</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>Asegúrate de crear el endpoint backend para generar el Payment Intent</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>Nunca expongas tu SECRET key en el frontend</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>Implementa webhooks para recibir notificaciones de eventos de pago</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
