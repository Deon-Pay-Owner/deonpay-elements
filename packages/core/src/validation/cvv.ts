/**
 * CVV/CVC Validation
 */

import { detectCardBrand, getCardBrandPattern } from '../constants/cardBrands'

export interface CvvValidationResult {
  isValid: boolean
  isPotentiallyValid: boolean
  errors: string[]
}

/**
 * Validates CVV/CVC code
 * @param cvv - CVV code
 * @param cardNumber - Card number (optional, for brand-specific validation)
 * @param complete - If true, validates as complete CVV
 * @returns Validation result
 */
export function validateCvv(
  cvv: string,
  cardNumber?: string,
  complete = true
): CvvValidationResult {
  const errors: string[] = []
  const digits = cvv.replace(/\D/g, '')

  // Empty check
  if (digits.length === 0) {
    return {
      isValid: false,
      isPotentiallyValid: true,
      errors: complete ? ['El código de seguridad es requerido'] : [],
    }
  }

  // Determine expected length based on card brand
  let expectedLength = 3 // Default for most cards

  if (cardNumber) {
    const brand = detectCardBrand(cardNumber)
    const pattern = getCardBrandPattern(brand)
    if (pattern) {
      expectedLength = pattern.cvvLength
    }
  }

  // Only digits allowed
  if (/\D/.test(cvv)) {
    errors.push('El código de seguridad solo debe contener números')
  }

  // Length validation
  if (complete) {
    if (digits.length !== expectedLength) {
      const lengthText = expectedLength === 4 ? '4 dígitos' : '3 dígitos'
      errors.push(`El código de seguridad debe tener ${lengthText}`)
    }
  } else {
    // For incomplete validation, check if it's potentially valid
    if (digits.length > expectedLength) {
      errors.push('El código de seguridad es demasiado largo')
    }
  }

  const isValid = complete && errors.length === 0
  const isPotentiallyValid =
    !complete || (digits.length <= expectedLength && errors.length === 0)

  return {
    isValid,
    isPotentiallyValid,
    errors,
  }
}

/**
 * Gets expected CVV length for a card number
 * @param cardNumber - Card number
 * @returns Expected CVV length (3 or 4)
 */
export function getExpectedCvvLength(cardNumber: string): number {
  const brand = detectCardBrand(cardNumber)
  const pattern = getCardBrandPattern(brand)
  return pattern ? pattern.cvvLength : 3
}

/**
 * Checks if CVV is complete
 * @param cvv - CVV code
 * @param cardNumber - Card number (optional)
 * @returns true if CVV is complete
 */
export function isCvvComplete(cvv: string, cardNumber?: string): boolean {
  const digits = cvv.replace(/\D/g, '')
  const expectedLength = cardNumber ? getExpectedCvvLength(cardNumber) : 3

  return digits.length === expectedLength
}
