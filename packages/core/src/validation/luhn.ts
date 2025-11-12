/**
 * Luhn Algorithm Implementation
 * Validates credit card numbers using the Luhn checksum
 * https://en.wikipedia.org/wiki/Luhn_algorithm
 */

/**
 * Validates a credit card number using the Luhn algorithm
 * @param cardNumber - Card number as string (digits only)
 * @returns true if valid, false otherwise
 */
export function validateLuhn(cardNumber: string): boolean {
  // Remove all non-digit characters
  const digits = cardNumber.replace(/\D/g, '')

  // Must be at least 13 digits and at most 19
  if (digits.length < 13 || digits.length > 19) {
    return false
  }

  let sum = 0
  let isEven = false

  // Loop through digits from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

/**
 * Generates a valid Luhn check digit for a card number
 * @param partialCardNumber - Card number without check digit
 * @returns check digit (0-9)
 */
export function generateLuhnCheckDigit(partialCardNumber: string): number {
  const digits = partialCardNumber.replace(/\D/g, '')
  let sum = 0
  let isEven = true

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return (10 - (sum % 10)) % 10
}
