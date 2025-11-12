/**
 * Card Expiry Date Validation
 */

export interface ExpiryValidationResult {
  isValid: boolean
  isPotentiallyValid: boolean
  month: number | null
  year: number | null
  errors: string[]
}

/**
 * Validates card expiry date
 * @param month - Expiry month (1-12)
 * @param year - Expiry year (2-4 digits)
 * @param complete - If true, validates as complete date
 * @returns Validation result
 */
export function validateExpiry(
  month: number | string,
  year: number | string,
  complete = true
): ExpiryValidationResult {
  const errors: string[] = []

  // Parse month
  const monthNum = typeof month === 'string' ? parseInt(month, 10) : month
  const yearNum = typeof year === 'string' ? parseInt(year, 10) : year

  // Validate month
  if (isNaN(monthNum)) {
    if (complete) {
      errors.push('El mes de expiración es inválido')
    }
    return {
      isValid: false,
      isPotentiallyValid: !complete,
      month: null,
      year: null,
      errors,
    }
  }

  if (monthNum < 1 || monthNum > 12) {
    errors.push('El mes debe estar entre 01 y 12')
  }

  // Validate year
  if (isNaN(yearNum)) {
    if (complete) {
      errors.push('El año de expiración es inválido')
    }
    return {
      isValid: false,
      isPotentiallyValid: !complete,
      month: monthNum,
      year: null,
      errors,
    }
  }

  // Convert 2-digit year to 4-digit
  const currentYear = new Date().getFullYear()
  const currentCentury = Math.floor(currentYear / 100) * 100
  let fullYear = yearNum

  if (yearNum < 100) {
    fullYear = currentCentury + yearNum
    // If year is in the past, assume next century
    if (fullYear < currentYear) {
      fullYear += 100
    }
  }

  // Check if card is expired
  if (complete) {
    const currentMonth = new Date().getMonth() + 1 // 1-indexed
    const expiryDate = new Date(fullYear, monthNum - 1, 1) // Last day of month
    const today = new Date(currentYear, currentMonth - 1, 1)

    if (expiryDate < today) {
      errors.push('La tarjeta está expirada')
    }

    // Check if year is too far in future (more than 20 years)
    if (fullYear > currentYear + 20) {
      errors.push('El año de expiración es inválido')
    }
  }

  const isValid = complete && errors.length === 0
  const isPotentiallyValid = !complete || errors.length === 0

  return {
    isValid,
    isPotentiallyValid,
    month: monthNum,
    year: fullYear,
    errors,
  }
}

/**
 * Validates expiry in MM/YY or MM/YYYY format
 * @param expiryString - Expiry string (e.g., "12/25" or "12/2025")
 * @param complete - If true, validates as complete date
 * @returns Validation result
 */
export function validateExpiryString(
  expiryString: string,
  complete = true
): ExpiryValidationResult {
  const cleaned = expiryString.replace(/\s/g, '')

  // Parse MM/YY or MM/YYYY format
  const parts = cleaned.split('/')

  if (parts.length !== 2) {
    return {
      isValid: false,
      isPotentiallyValid: !complete && cleaned.length < 7,
      month: null,
      year: null,
      errors: complete ? ['Formato inválido. Use MM/AA'] : [],
    }
  }

  const [monthStr, yearStr] = parts
  return validateExpiry(monthStr, yearStr, complete)
}

/**
 * Checks if expiry date is complete
 * @param month - Month value
 * @param year - Year value
 * @returns true if both month and year are valid numbers
 */
export function isExpiryComplete(month: number | string, year: number | string): boolean {
  const monthNum = typeof month === 'string' ? parseInt(month, 10) : month
  const yearNum = typeof year === 'string' ? parseInt(year, 10) : year

  return !isNaN(monthNum) && !isNaN(yearNum) && monthNum > 0 && yearNum > 0
}
