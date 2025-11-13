# DeonPay Elements

<div align="center">

**Embeddable payment UI components with multi-acquirer routing support**

[![npm version](https://badge.fury.io/js/%40deonpay%2Felements-sdk.svg)](https://www.npmjs.com/package/@deonpay/elements-sdk)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Playground](#-playground) • [API](#-api-reference)

</div>

---

## 🎯 Features

### Multi-Acquirer Support
One SDK, multiple payment processors. Connect to Adyen, Stripe, CyberSource, and more without changing your integration code. DeonPay intelligently routes payments for optimal performance and cost.

### Secure Tokenization
PCI-DSS compliant payment data handling. Card data is tokenized before leaving the browser, ensuring sensitive information never touches your servers.

### Customizable UI
Match your brand perfectly with three built-in themes (flat, stripe, dark) and full CSS customization support. Control every aspect of the payment form appearance.

### 3D Secure Ready
Built-in support for 3DS 2.0 authentication. Handle strong customer authentication (SCA) requirements seamlessly.

### TypeScript First
Full type safety and IntelliSense support for a superior developer experience.

### Real-Time Validation
Smart card validation with instant feedback for card numbers, expiry dates, CVV, and automatic brand detection.

---

## 📦 Packages

This monorepo contains:

| Package | Description | Size |
|---------|-------------|------|
| **@deonpay/elements-sdk** | Main SDK for embedding payment forms | 18.76 KB |
| **@deonpay/elements-core** | Core utilities, validators, and formatters | 5.89 KB |
| **@deonpay/playground** | Interactive demo and testing environment | - |

---

## 🚀 Quick Start

### Installation

```bash
npm install @deonpay/elements-sdk
# or
pnpm add @deonpay/elements-sdk
# or
yarn add @deonpay/elements-sdk
```

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
  <title>Checkout</title>
</head>
<body>
  <div id="payment-element"></div>
  <button id="submit">Pay</button>

  <script type="module">
    import DeonPay from '@deonpay/elements-sdk'

    // 1. Initialize DeonPay with your public key
    const deonpay = DeonPay('pk_live_your_public_key')

    // 2. Create a payment intent on your server and get client secret
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 10000, currency: 'MXN' })
    })
    const { client_secret } = await response.json()

    // 3. Create Elements instance
    const elements = deonpay.elements({
      clientSecret: client_secret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#0070f3'
        }
      }
    })

    // 4. Mount payment element
    const paymentElement = elements.create('payment')
    paymentElement.mount('#payment-element')

    // 5. Handle form submission
    document.getElementById('submit').addEventListener('click', async () => {
      const { paymentIntent, error } = await deonpay.confirmPayment({
        elements,
        confirmParams: {
          return_url: 'https://yourdomain.com/success'
        }
      })

      if (error) {
        console.error(error.message)
      } else {
        console.log('Payment successful!', paymentIntent)
      }
    })
  </script>
</body>
</html>
```

---

## 🎨 Theming

DeonPay Elements comes with three built-in themes:

```javascript
// Flat theme (default)
const elements = deonpay.elements({
  clientSecret: clientSecret,
  appearance: { theme: 'flat' }
})

// Stripe theme
const elements = deonpay.elements({
  clientSecret: clientSecret,
  appearance: { theme: 'stripe' }
})

// Dark theme
const elements = deonpay.elements({
  clientSecret: clientSecret,
  appearance: { theme: 'dark' }
})
```

### Custom Styling

```javascript
const elements = deonpay.elements({
  clientSecret: clientSecret,
  appearance: {
    variables: {
      colorPrimary: '#0070f3',
      colorBackground: '#ffffff',
      colorText: '#1a1a1a',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '8px'
    }
  }
})
```

---

## 🔧 Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/Deon-Pay-Owner/deonpay-elements.git
cd deonpay-elements

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start playground in development mode
cd apps/playground
pnpm dev
```

### Project Structure

```
deonpay-elements/
├── packages/
│   ├── core/              # @deonpay/elements-core
│   │   ├── src/
│   │   │   ├── validation/   # Card validation logic
│   │   │   ├── formatting/   # Card formatting utilities
│   │   │   └── constants/    # Card brand detection
│   │   └── package.json
│   │
│   └── sdk/               # @deonpay/elements-sdk
│       ├── src/
│       │   ├── components/   # React components
│       │   ├── tokenization/ # API client
│       │   ├── types/        # TypeScript definitions
│       │   ├── styles/       # CSS themes
│       │   ├── DeonPay.ts    # Main SDK class
│       │   └── Elements.ts   # Elements manager
│       └── package.json
│
├── apps/
│   └── playground/        # Interactive demo app
│       ├── app/
│       │   ├── api/          # Mock API routes
│       │   └── page.tsx      # Demo page
│       └── package.json
│
├── turbo.json            # Turborepo configuration
├── pnpm-workspace.yaml   # pnpm workspaces
└── package.json          # Root package
```

### Build System

This project uses **Turborepo** for efficient monorepo builds:

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @deonpay/elements-core build
pnpm --filter @deonpay/elements-sdk build
pnpm --filter @deonpay/playground build

# Clean all builds
pnpm clean
```

---

## 📚 Documentation

### Card Validation

The SDK includes robust card validation:

- **Luhn algorithm** for card number validation
- **Brand detection** for Visa, Mastercard, Amex, Discover, Diners, JCB, UnionPay, Maestro
- **Expiry date validation** with MM/YY format
- **CVV validation** (3 digits for most cards, 4 for Amex)
- **Real-time formatting** as user types

### Tokenization Flow

1. User enters card data in the payment element
2. SDK validates card data client-side
3. On submit, SDK creates a secure token via `/api/v1/elements/tokens`
4. Token is encrypted with AES-256-GCM and stored in KV (15-min TTL)
5. Token ID (e.g., `tok_abc123...`) is returned to frontend
6. Frontend confirms payment with token ID
7. Backend retrieves and consumes token (single-use)
8. Payment is processed through multi-acquirer router

### Security Features

- **No PAN storage**: Card numbers are never stored in databases
- **AES-256-GCM encryption**: Token data encrypted at rest
- **Single-use tokens**: Tokens can only be consumed once
- **15-minute expiration**: Tokens automatically expire
- **PCI-DSS compliant**: Reduces PCI scope for merchants

---

## 🎮 Playground

Test the SDK with our interactive playground:

```bash
cd apps/playground
pnpm dev
```

Visit `http://localhost:3000` to see:
- Live theme switching
- Real card validation
- Mock payment processing
- Complete integration example

### Test Cards

| Card Number | Brand | Result |
|-------------|-------|--------|
| 4242 4242 4242 4242 | Visa | Success |
| 5555 5555 5555 4444 | Mastercard | Success |
| 3782 822463 10005 | Amex | Success |
| 4000 0000 0000 0002 | Visa | Declined |
| 4000 0025 0000 3155 | Visa | 3DS Challenge |

Use any future expiry date and any 3-digit CVV (4 digits for Amex).

---

## 📖 API Reference

### DeonPay

Main SDK class for initializing the SDK.

```typescript
const deonpay = DeonPay(publicKey: string, config?: DeonPayConfig)
```

**Parameters:**
- `publicKey` (string, required): Your publishable API key starting with `pk_`
- `config` (DeonPayConfig, optional):
  - `apiUrl` (string): Custom API URL (default: `https://api.deonpay.mx`)
  - `locale` (string): Locale for error messages (`es` | `en`, default: `es`)

**Returns:** DeonPay instance

---

### deonpay.elements()

Creates an Elements instance for mounting payment forms.

```typescript
const elements = deonpay.elements(options: ElementsOptions)
```

**Parameters:**
- `options` (ElementsOptions):
  - `clientSecret` (string, required): Payment intent client secret
  - `appearance` (Appearance, optional): Theming options
  - `locale` (string, optional): Override SDK locale

**Returns:** Elements instance

---

### elements.create()

Creates a payment element.

```typescript
const paymentElement = elements.create('payment', options?: PaymentElementOptions)
```

**Parameters:**
- `type` (string, required): Element type (currently only `'payment'` supported)
- `options` (PaymentElementOptions, optional):
  - `showCardholderName` (boolean): Show cardholder name field (default: `true`)

**Returns:** PaymentElement instance

---

### paymentElement.mount()

Mounts the payment element to a DOM container.

```typescript
paymentElement.mount(selector: string | HTMLElement)
```

**Parameters:**
- `selector` (string | HTMLElement): CSS selector or DOM element

**Returns:** void

---

### deonpay.confirmPayment()

Confirms a payment intent.

```typescript
const result = await deonpay.confirmPayment(params: ConfirmPaymentParams)
```

**Parameters:**
- `params` (ConfirmPaymentParams):
  - `elements` (Elements, required): Elements instance
  - `confirmParams` (object, optional):
    - `return_url` (string): URL to redirect after 3DS
  - `redirect` (string, optional): Redirect behavior (`'if_required'` | `'always'`, default: `'if_required'`)

**Returns:** Promise<ConfirmPaymentResult>
- `paymentIntent` (PaymentIntent): Updated payment intent
- `error` (object): Error if confirmation failed

---

## 🌐 Backend Integration

### Creating a Payment Intent

```javascript
// Node.js example with Express
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body

  const response = await fetch('https://api.deonpay.mx/api/v1/payment_intents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEONPAY_SECRET_KEY}`
    },
    body: JSON.stringify({
      amount,
      currency,
      automatic_payment_methods: { enabled: true }
    })
  })

  const paymentIntent = await response.json()
  res.json({ client_secret: paymentIntent.client_secret })
})
```

### Webhook Handling

```javascript
app.post('/webhooks/deonpay', async (req, res) => {
  const event = req.body

  switch (event.type) {
    case 'payment_intent.succeeded':
      // Handle successful payment
      console.log('Payment succeeded:', event.data.object.id)
      break
    case 'payment_intent.payment_failed':
      // Handle failed payment
      console.log('Payment failed:', event.data.object.id)
      break
  }

  res.json({ received: true })
})
```

---

## 🔗 Links

- **Playground**: [https://elements.deonpay.mx/playground](https://elements.deonpay.mx/playground)
- **API Docs**: [https://docs.deonpay.mx/elements/api](https://docs.deonpay.mx/elements/api)
- **Dashboard**: [https://dashboard.deonpay.mx](https://dashboard.deonpay.mx)
- **GitHub**: [https://github.com/Deon-Pay-Owner/deonpay-elements](https://github.com/Deon-Pay-Owner/deonpay-elements)

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## 💬 Support

- **Email**: support@deonpay.mx
- **Discord**: [Join our community](https://discord.gg/deonpay)
- **Issues**: [GitHub Issues](https://github.com/Deon-Pay-Owner/deonpay-elements/issues)

---

<div align="center">
Built with ❤️ by the DeonPay team
</div>
