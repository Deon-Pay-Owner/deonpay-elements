/**
 * Card Number Validation
 */

import { validateLuhn } from './luhn'
import { detectCardBrand, isValidCardLength } from '../constants/cardBrands'

export interface CardNumberValidationResult {
  isValid: boolean
  isPotentiallyValid: boolean
  brand: string
  errors: string[]
}

/**
 * Validates a card number
 * @param cardNumber - Card number to validate
 * @param complete - If true, validates as complete number. If false, allows partial.
 * @returns Validation result
 */
export function validateCardNumber(
  cardNumber: string,
  complete = true
): CardNumberValidationResult {
  const errors: string[] = []
  const digits = cardNumber.replace(/\D/g, '')

  // Empty check
  if (digits.length === 0) {
    return {
      isValid: false,
      isPotentiallyValid: true,
      brand: 'unknown',
      errors: complete ? ['El número de tarjeta es requerido'] : [],
    }
  }

  // Detect brand
  const brand = detectCardBrand(digits)

  // Length validation
  if (complete) {
    if (!isValidCardLength(digits)) {
      errors.push('El número de tarjeta tiene una longitud inválida')
    }
  }

  // Luhn validation (only for complete numbers)
  if (complete && digits.length >= 13) {
    if (!validateLuhn(digits)) {
      errors.push('El número de tarjeta es inválido')
    }
  }

  const isValid = complete && errors.length === 0
  const isPotentiallyValid =
    !complete || (digits.length < 19 && brand !== 'unknown')

  return {
    isValid,
    isPotentiallyValid,
    brand,
    errors,
  }
}

/**
 * Checks if card number is complete (ready for validation)
 * @param cardNumber - Card number
 * @returns true if number appears complete
 */
export function isCardNumberComplete(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '')
  return digits.length >= 13 && isValidCardLength(digits)
}
