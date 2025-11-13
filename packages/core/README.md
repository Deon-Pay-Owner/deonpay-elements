# @deonpay/elements-core

Core utilities for DeonPay Elements - Card validation, formatting, and brand detection.

## Installation

```bash
npm install @deonpay/elements-core
# or
pnpm add @deonpay/elements-core
# or
yarn add @deonpay/elements-core
```

## Features

- **Luhn Algorithm**: Industry-standard card number validation
- **Brand Detection**: Detect 8 major card brands (Visa, Mastercard, Amex, Discover, Diners, JCB, UnionPay, Maestro)
- **Auto-formatting**: Format card numbers and expiry dates as user types
- **Expiry Validation**: Validate MM/YY format with date validation
- **CVV Validation**: 3-4 digit validation based on card brand
- **TypeScript**: Full type safety

## Usage

### Card Number Validation

```typescript
import { validateCardNumber, isCardNumberComplete } from '@deonpay/elements-core'

const cardNumber = '4242424242424242'
const validation = validateCardNumber(cardNumber, isCardNumberComplete(cardNumber))

console.log(validation.isValid) // true
console.log(validation.errors) // []
```

### Brand Detection

```typescript
import { detectCardBrand } from '@deonpay/elements-core'

const brand = detectCardBrand('4242424242424242')
console.log(brand) // 'visa'
```

### Auto-formatting

```typescript
import { formatCardNumber } from '@deonpay/elements-core'

const formatted = formatCardNumber('4242424242424242')
console.log(formatted) // '4242 4242 4242 4242'
```

### Expiry Validation

```typescript
import { validateExpiry, parseExpiry } from '@deonpay/elements-core'

const expiry = parseExpiry('12/25')
if (expiry) {
  const validation = validateExpiry(expiry.month, expiry.year, true)
  console.log(validation.isValid) // true
}
```

### CVV Validation

```typescript
import { validateCvv } from '@deonpay/elements-core'

const validation = validateCvv('123', '4242424242424242', true)
console.log(validation.isValid) // true
```

## API Reference

See [full documentation](https://docs.deonpay.mx/elements/core) for complete API reference.

## License

MIT
