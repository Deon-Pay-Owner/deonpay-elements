# @deonpay/elements-sdk

DeonPay Elements SDK - Embeddable payment UI components with multi-acquirer routing.

## Installation

```bash
npm install @deonpay/elements-sdk
# or
pnpm add @deonpay/elements-sdk
# or
yarn add @deonpay/elements-sdk
```

## Quick Start

```typescript
import DeonPay from '@deonpay/elements-sdk'
import '@deonpay/elements-sdk/styles.css'

// 1. Initialize DeonPay
const deonpay = DeonPay('pk_test_your_key')

// 2. Create Elements instance
const elements = deonpay.elements({
  clientSecret: 'pi_xxx_secret_yyy',
  appearance: {
    theme: 'stripe' // 'flat' | 'stripe' | 'dark'
  }
})

// 3. Mount payment element
const paymentElement = elements.create('payment')
paymentElement.mount('#payment-element')

// 4. Confirm payment
const { paymentIntent, error } = await deonpay.confirmPayment({
  elements,
  confirmParams: {
    return_url: 'https://yourdomain.com/success'
  }
})
```

## Features

- **Multi-Acquirer Support**: Routes payments through Adyen, Stripe, CyberSource, and more
- **Secure Tokenization**: PCI-DSS compliant, card data never touches your servers
- **3D Secure Ready**: Built-in 3DS 2.0 support
- **Customizable Themes**: 3 built-in themes + full CSS customization
- **TypeScript**: Complete type safety
- **Real-time Validation**: Instant feedback for card inputs

## Documentation

- [Getting Started](https://docs.deonpay.mx/elements/quickstart)
- [API Reference](https://docs.deonpay.mx/elements/api)
- [Customization](https://docs.deonpay.mx/elements/customization)
- [Playground](https://elements.deonpay.mx)

## License

MIT
