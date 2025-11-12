/**
 * Expiry Date Formatting
 */

/**
 * Formats expiry date as MM/YY
 * @param month - Month (1-12)
 * @param year - Year (2 or 4 digits)
 * @returns Formatted expiry string
 *
 * @example
 * formatExpiry(12, 25) // '12/25'
 * formatExpiry(1, 2025) // '01/25'
 */
export function formatExpiry(month: number | string, year: number | string): string {
  const monthStr = String(month).padStart(2, '0')
  const yearStr = String(year)
  const shortYear = yearStr.length === 4 ? yearStr.slice(-2) : yearStr.padStart(2, '0')

  return `${monthStr}/${shortYear}`
}

/**
 * Formats expiry input string as MM/YY while typing
 * @param input - Raw input string
 * @returns Formatted string
 *
 * @example
 * formatExpiryInput('1') // '1'
 * formatExpiryInput('12') // '12/'
 * formatExpiryInput('122') // '12/2'
 * formatExpiryInput('1225') // '12/25'
 */
export function formatExpiryInput(input: string): string {
  // Remove all non-digit characters
  const digits = input.replace(/\D/g, '')

  // Add slash after month (2 digits)
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`
  }

  return digits
}

/**
 * Parses expiry string into month and year
 * @param expiryString - Expiry string (e.g., "12/25" or "12/2025")
 * @returns Object with month and year, or null if invalid
 */
export function parseExpiry(expiryString: string): { month: number; year: number } | null {
  const parts = expiryString.split('/')

  if (parts.length !== 2) {
    return null
  }

  const month = parseInt(parts[0], 10)
  const year = parseInt(parts[1], 10)

  if (isNaN(month) || isNaN(year)) {
    return null
  }

  // Convert 2-digit year to 4-digit
  const currentYear = new Date().getFullYear()
  const currentCentury = Math.floor(currentYear / 100) * 100
  const fullYear = year < 100 ? currentCentury + year : year

  return { month, year: fullYear }
}
