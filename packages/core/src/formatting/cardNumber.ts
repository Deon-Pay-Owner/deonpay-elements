/**
 * Card Number Formatting
 */

import { detectCardBrand } from '../constants/cardBrands'

/**
 * Formats card number with spaces according to brand
 * @param cardNumber - Raw card number
 * @returns Formatted card number
 *
 * @example
 * formatCardNumber('4242424242424242') // '4242 4242 4242 4242'
 * formatCardNumber('378282246310005') // '3782 822463 10005' (Amex)
 */
export function formatCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '')
  const brand = detectCardBrand(digits)

  // American Express uses 4-6-5 format
  if (brand === 'amex') {
    return digits
      .replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3')
      .trim()
      .slice(0, 17) // 15 digits + 2 spaces
  }

  // Diners Club uses 4-6-4 format
  if (brand === 'diners') {
    return digits
      .replace(/(\d{4})(\d{6})(\d{4})/, '$1 $2 $3')
      .trim()
      .slice(0, 16) // 14 digits + 2 spaces
  }

  // Most cards use 4-4-4-4 format
  return digits
    .replace(/(\d{4})/g, '$1 ')
    .trim()
    .slice(0, 23) // 19 digits + 4 spaces
}

/**
 * Removes formatting from card number
 * @param cardNumber - Formatted card number
 * @returns Digits only
 */
export function unformatCardNumber(cardNumber: string): string {
  return cardNumber.replace(/\D/g, '')
}

/**
 * Masks card number (shows only last 4 digits)
 * @param cardNumber - Card number
 * @param showFirst - Number of first digits to show (default: 0)
 * @returns Masked card number
 *
 * @example
 * maskCardNumber('4242424242424242') // '•••• •••• •••• 4242'
 * maskCardNumber('4242424242424242', 4) // '4242 •••• •••• 4242'
 */
export function maskCardNumber(cardNumber: string, showFirst = 0): string {
  const digits = cardNumber.replace(/\D/g, '')
  const last4 = digits.slice(-4)
  const first = showFirst > 0 ? digits.slice(0, showFirst) : ''

  const masked = '•'.repeat(Math.max(0, digits.length - showFirst - 4))

  return formatCardNumber(first + masked + last4)
}
