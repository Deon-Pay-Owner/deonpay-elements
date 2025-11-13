/**
 * @deonpay/elements-sdk
 * DeonPay Elements SDK - Embeddable payment UI components
 */

import { DeonPay } from './DeonPay'
import type {
  DeonPayConfig,
  ElementsOptions,
  PaymentElementOptions,
  Appearance,
  ConfirmPaymentParams,
  ConfirmPaymentResult,
} from './types'

// Import styles
import './styles/base.css'

/**
 * Creates a new DeonPay instance
 * @param publicKey - Your DeonPay public key (starts with pk_)
 * @param config - Optional configuration
 * @returns DeonPay instance
 *
 * @example
 * ```typescript
 * const deonpay = DeonPay('pk_test_your_key_here')
 *
 * const elements = deonpay.elements({
 *   clientSecret: 'pi_xxx_secret_yyy'
 * })
 *
 * const paymentElement = elements.create('payment')
 * paymentElement.mount('#payment-element')
 * ```
 */
export default function createDeonPay(
  publicKey: string,
  config?: DeonPayConfig
): DeonPay {
  return new DeonPay(publicKey, config)
}

// Named export for CommonJS compatibility
export { createDeonPay as DeonPay }

// Export types
export type {
  DeonPayConfig,
  ElementsOptions,
  PaymentElementOptions,
  Appearance,
  ConfirmPaymentParams,
  ConfirmPaymentResult,
}

// Export classes for advanced usage
export { DeonPay as DeonPayClass } from './DeonPay'
export { Elements } from './Elements.tsx'
export { PaymentCard } from './components/PaymentCard'
export { CardBrandIcon } from './components/CardBrandIcon'
