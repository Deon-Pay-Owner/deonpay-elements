# DeonPay Elements - Integration Guide

Complete guide for integrating DeonPay Elements into your application.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Frontend Integration](#frontend-integration)
4. [Backend Integration](#backend-integration)
5. [Testing](#testing)
6. [Going Live](#going-live)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- A DeonPay account ([Sign up here](https://dashboard.deonpay.mx/signup))
- API keys (available in your [Dashboard](https://dashboard.deonpay.mx/settings/api-keys))
- Node.js 18+ (for backend integration)
- Basic knowledge of JavaScript/TypeScript

---

## Installation

### NPM/Yarn/PNPM

```bash
# NPM
npm install @deonpay/elements-sdk

# Yarn
yarn add @deonpay/elements-sdk

# PNPM
pnpm add @deonpay/elements-sdk
```

### CDN (for quick testing)

```html
<script type="module">
  import DeonPay from 'https://cdn.jsdelivr.net/npm/@deonpay/elements-sdk@latest/dist/index.mjs'
  import '@deonpay/elements-sdk/dist/style.css'
</script>
```

---

## Frontend Integration

### Step 1: Initialize DeonPay SDK

Create a DeonPay instance with your **publishable key** (starts with `pk_`):

```typescript
import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/dist/style.css'

const deonpay = DeonPay('pk_test_your_publishable_key', {
  apiUrl: 'https://api.deonpay.mx', // Optional, defaults to production
  locale: 'es' // 'es' or 'en'
})
```

**IMPORTANT**: Never use your secret key (`sk_`) in frontend code. It should only be used server-side.

### Step 2: Create a Payment Intent

On your server, create a payment intent and return the `client_secret`:

```typescript
// Frontend code
async function createPaymentIntent(amount: number, currency: string) {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency })
  })

  const data = await response.json()
  return data.client_secret
}
```

### Step 3: Create Elements Instance

```typescript
const clientSecret = await createPaymentIntent(10000, 'MXN')

const elements = deonpay.elements({
  clientSecret,
  appearance: {
    theme: 'stripe', // 'flat' | 'stripe' | 'dark'
    variables: {
      colorPrimary: '#0070f3',
      borderRadius: '8px'
    }
  },
  locale: 'es'
})
```

### Step 4: Create and Mount Payment Element

```typescript
// Create payment element
const paymentElement = elements.create('payment', {
  showCardholderName: true // Show cardholder name field (default: true)
})

// Mount to DOM
paymentElement.mount('#payment-element')

// Listen for changes
paymentElement.on('change', (event) => {
  if (event.complete) {
    console.log('Payment info is complete')
  }

  if (event.error) {
    console.error('Validation error:', event.error.message)
  }
})

// Listen for ready event
paymentElement.on('ready', () => {
  console.log('Payment element is ready')
})
```

### Step 5: Handle Form Submission

```typescript
const form = document.getElementById('payment-form')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  // Disable submit button
  const submitButton = document.getElementById('submit-button')
  submitButton.disabled = true

  try {
    const { paymentIntent, error } = await deonpay.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'https://yourdomain.com/payment/success'
      },
      redirect: 'if_required'
    })

    if (error) {
      // Show error to customer
      alert(error.message)
      submitButton.disabled = false
    } else if (paymentIntent) {
      // Payment succeeded
      if (paymentIntent.status === 'succeeded') {
        window.location.href = '/payment/success'
      } else if (paymentIntent.status === 'requires_action') {
        // 3DS authentication required (will auto-redirect)
        console.log('3DS authentication in progress...')
      }
    }
  } catch (err) {
    console.error('Payment error:', err)
    submitButton.disabled = false
  }
})
```

### Complete Frontend Example (React)

```tsx
'use client'

import { useEffect, useState } from 'react'
import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/dist/style.css'

export default function CheckoutForm() {
  const [deonpay, setDeonpay] = useState<any>(null)
  const [elements, setElements] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize DeonPay
    const dp = DeonPay('pk_test_your_key')
    setDeonpay(dp)

    // Create payment intent
    async function init() {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 10000, currency: 'MXN' })
      })
      const { client_secret } = await response.json()

      // Create elements
      const els = dp.elements({
        clientSecret: client_secret,
        appearance: { theme: 'stripe' }
      })
      setElements(els)

      // Mount payment element
      const paymentElement = els.create('payment')
      paymentElement.mount('#payment-element')
    }

    init()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!deonpay || !elements) return

    setLoading(true)
    setError(null)

    const { paymentIntent, error } = await deonpay.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/success'
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (paymentIntent?.status === 'succeeded') {
      window.location.href = '/success'
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div id="payment-element"></div>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Pay $100.00 MXN'}
      </button>
    </form>
  )
}
```

---

## Backend Integration

### Step 1: Install DeonPay SDK (Node.js)

For backend operations, you can use direct API calls or install a server SDK:

```bash
npm install node-fetch
```

### Step 2: Create Payment Intent Endpoint

```typescript
// Node.js with Express
import express from 'express'

const app = express()
app.use(express.json())

app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body

  try {
    const response = await fetch('https://api.deonpay.mx/api/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEONPAY_SECRET_KEY}`
      },
      body: JSON.stringify({
        amount, // Amount in cents (e.g., 10000 = $100.00)
        currency, // 'MXN', 'USD', etc.
        automatic_payment_methods: { enabled: true },
        description: 'Payment for order #12345',
        metadata: {
          order_id: '12345',
          customer_email: 'customer@example.com'
        }
      })
    })

    const paymentIntent = await response.json()

    // Return only client_secret to frontend
    res.json({ client_secret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    res.status(500).json({ error: 'Failed to create payment intent' })
  }
})

app.listen(3000)
```

### Step 3: Handle Webhooks

Set up a webhook endpoint to receive payment status updates:

```typescript
app.post('/webhooks/deonpay', express.raw({ type: 'application/json' }), async (req, res) => {
  const event = req.body

  // Verify webhook signature (recommended in production)
  // const signature = req.headers['deonpay-signature']
  // const isValid = verifyWebhookSignature(event, signature, WEBHOOK_SECRET)
  // if (!isValid) return res.status(401).send('Invalid signature')

  // Handle event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      console.log(`Payment ${paymentIntent.id} succeeded`)
      // Update your database, send confirmation email, etc.
      await fulfillOrder(paymentIntent.metadata.order_id)
      break

    case 'payment_intent.payment_failed':
      console.log(`Payment ${event.data.object.id} failed`)
      // Notify customer, log for analysis
      break

    case 'payment_intent.requires_action':
      console.log(`Payment ${event.data.object.id} requires 3DS`)
      // Customer is completing 3DS authentication
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  res.json({ received: true })
})

async function fulfillOrder(orderId: string) {
  // Your order fulfillment logic
  console.log(`Fulfilling order ${orderId}`)
  // Update database, send products, etc.
}
```

### Step 4: Configure Webhook in Dashboard

1. Go to [Dashboard > Settings > Webhooks](https://dashboard.deonpay.mx/settings/webhooks)
2. Add endpoint: `https://yourdomain.com/webhooks/deonpay`
3. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.requires_action`
4. Save and copy the webhook secret

---

## Testing

### Test Mode

Use test API keys (starting with `pk_test_` and `sk_test_`) for development.

### Test Cards

| Card Number | Brand | Scenario |
|-------------|-------|----------|
| 4242 4242 4242 4242 | Visa | Success |
| 5555 5555 5555 4444 | Mastercard | Success |
| 3782 822463 10005 | Amex | Success (4-digit CVV) |
| 4000 0000 0000 0002 | Visa | Card declined |
| 4000 0025 0000 3155 | Visa | 3DS authentication required |
| 4000 0000 0000 0341 | Visa | Attach succeeds, charge fails |

**Expiry**: Use any future date (e.g., 12/25)
**CVV**: Use any 3 digits (4 for Amex)

### Testing 3D Secure

1. Use card `4000 0025 0000 3155`
2. Complete payment normally
3. You'll be redirected to a 3DS challenge page
4. Click "Authorize" to complete authentication
5. You'll be redirected back to your `return_url`

### Webhook Testing

Use tools like [ngrok](https://ngrok.com/) for local webhook testing:

```bash
# Start ngrok
ngrok http 3000

# Copy the HTTPS URL and add it as webhook endpoint in Dashboard
# Example: https://abc123.ngrok.io/webhooks/deonpay
```

---

## Going Live

### Checklist

- [ ] Replace test API keys with live keys (`pk_live_`, `sk_live_`)
- [ ] Configure production webhook endpoints
- [ ] Test with real payment methods in test mode
- [ ] Implement proper error handling
- [ ] Add loading states and user feedback
- [ ] Secure your API keys (never commit to version control)
- [ ] Set up monitoring and alerting
- [ ] Review PCI compliance requirements
- [ ] Test on mobile devices
- [ ] Implement CSP headers if needed

### Environment Variables

```bash
# .env.local (Never commit this file!)
DEONPAY_SECRET_KEY=sk_live_your_secret_key
DEONPAY_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_DEONPAY_PUBLISHABLE_KEY=pk_live_your_publishable_key
```

### Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Validate webhook signatures** to prevent fake events
3. **Use HTTPS** for all webhook endpoints
4. **Implement rate limiting** on payment endpoints
5. **Log payment attempts** for fraud detection
6. **Use CSP headers** to prevent XSS attacks
7. **Sanitize user input** before processing

---

## Troubleshooting

### Common Issues

#### "Invalid API key" Error

**Problem**: API key not recognized
**Solution**:
- Check that you're using the correct key format (`pk_` for frontend, `sk_` for backend)
- Verify the key in your Dashboard
- Ensure you're using the right environment (test vs live)

#### Payment Element Not Appearing

**Problem**: Element doesn't mount
**Solution**:
- Ensure CSS is imported: `import '@deonpay/elements-sdk/dist/style.css'`
- Check that DOM element exists before mounting
- Verify `clientSecret` is valid
- Check browser console for errors

#### "Client secret is invalid" Error

**Problem**: Payment intent not found
**Solution**:
- Verify payment intent was created successfully
- Check that `client_secret` format is correct: `pi_xxx_secret_yyy`
- Ensure you're using matching environment keys (both test or both live)

#### 3DS Redirect Loop

**Problem**: Stuck in 3DS authentication
**Solution**:
- Verify `return_url` is a valid HTTPS URL
- Check that return URL is whitelisted in Dashboard
- Ensure cookies are enabled in browser

#### Webhook Not Receiving Events

**Problem**: Webhook endpoint not called
**Solution**:
- Verify endpoint is publicly accessible (use ngrok for local testing)
- Check webhook is enabled in Dashboard
- Verify endpoint returns 200 status code
- Check webhook signature validation isn't failing

### Debug Mode

Enable debug logging:

```typescript
const deonpay = DeonPay('pk_test_xxx', {
  debug: true // Enable console logging
})
```

### Getting Help

- **Documentation**: [docs.deonpay.mx](https://docs.deonpay.mx)
- **Support Email**: support@deonpay.mx
- **Discord Community**: [discord.gg/deonpay](https://discord.gg/deonpay)
- **GitHub Issues**: [github.com/Deon-Pay-Owner/deonpay-elements/issues](https://github.com/Deon-Pay-Owner/deonpay-elements/issues)

---

## Advanced Topics

### Custom Validation

Add custom validation logic:

```typescript
paymentElement.on('change', (event) => {
  if (event.complete) {
    // Add custom validation
    const cardData = paymentElement.getCardData()
    if (cardData.brand === 'amex' && !acceptAmex) {
      showError('American Express not accepted')
      return
    }
  }
})
```

### Retry Logic

Implement automatic retry for failed payments:

```typescript
async function confirmWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const { paymentIntent, error } = await deonpay.confirmPayment({
      elements,
      confirmParams: { return_url }
    })

    if (!error) return paymentIntent

    // Retry on network errors only
    if (error.type === 'api_connection_error' && i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      continue
    }

    throw error
  }
}
```

### Multiple Payment Methods

Support multiple payment methods in one session:

```typescript
// Create elements for each payment method
const cardElement = elements.create('payment', { showCardholderName: true })
const bankElement = elements.create('bank_transfer')

// Mount to different containers
cardElement.mount('#card-payment')
bankElement.mount('#bank-payment')

// User selects payment method
const selectedMethod = getSelectedPaymentMethod()
const selectedElement = selectedMethod === 'card' ? cardElement : bankElement

// Confirm with selected method
await deonpay.confirmPayment({ elements: selectedElement })
```

---

## Migration Guide

### From Stripe Elements

If you're migrating from Stripe Elements, the API is very similar:

```diff
- import { loadStripe } from '@stripe/stripe-js'
+ import DeonPay from '@deonpay/elements-sdk'

- const stripe = await loadStripe('pk_test_xxx')
+ const deonpay = DeonPay('pk_test_xxx')

- const elements = stripe.elements({ clientSecret })
+ const elements = deonpay.elements({ clientSecret })

- const paymentElement = elements.create('payment')
+ const paymentElement = elements.create('payment')

- const { error } = await stripe.confirmPayment({ elements })
+ const { error } = await deonpay.confirmPayment({ elements })
```

Key differences:
- DeonPay is synchronous (no `loadStripe` needed)
- Multi-acquirer routing happens automatically
- Slightly different API endpoint structure

---

## Next Steps

- Explore [API Reference](https://docs.deonpay.mx/elements/api)
- Try the [Interactive Playground](https://elements.deonpay.mx/playground)
- Join our [Discord Community](https://discord.gg/deonpay)
- Read about [Multi-Acquirer Routing](https://docs.deonpay.mx/routing)

---

**Happy building!** 🚀
