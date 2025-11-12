/**
 * Card Brand Detection Constants
 * Based on IIN (Issuer Identification Number) ranges
 */

export type CardBrand =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'diners'
  | 'jcb'
  | 'unionpay'
  | 'maestro'
  | 'unknown'

export interface CardBrandPattern {
  brand: CardBrand
  pattern: RegExp
  lengths: number[]
  cvvLength: number
  displayName: string
}

export const CARD_BRAND_PATTERNS: CardBrandPattern[] = [
  {
    brand: 'visa',
    pattern: /^4/,
    lengths: [13, 16, 19],
    cvvLength: 3,
    displayName: 'Visa',
  },
  {
    brand: 'mastercard',
    pattern: /^(5[1-5]|2[2-7])/,
    lengths: [16],
    cvvLength: 3,
    displayName: 'Mastercard',
  },
  {
    brand: 'amex',
    pattern: /^3[47]/,
    lengths: [15],
    cvvLength: 4,
    displayName: 'American Express',
  },
  {
    brand: 'discover',
    pattern: /^(6011|65|64[4-9]|622)/,
    lengths: [16, 19],
    cvvLength: 3,
    displayName: 'Discover',
  },
  {
    brand: 'diners',
    pattern: /^(36|38|30[0-5])/,
    lengths: [14, 16, 19],
    cvvLength: 3,
    displayName: 'Diners Club',
  },
  {
    brand: 'jcb',
    pattern: /^35/,
    lengths: [16, 19],
    cvvLength: 3,
    displayName: 'JCB',
  },
  {
    brand: 'unionpay',
    pattern: /^62/,
    lengths: [16, 17, 18, 19],
    cvvLength: 3,
    displayName: 'UnionPay',
  },
  {
    brand: 'maestro',
    pattern: /^(5018|5020|5038|5893|6304|6759|6761|6762|6763)/,
    lengths: [12, 13, 14, 15, 16, 17, 18, 19],
    cvvLength: 3,
    displayName: 'Maestro',
  },
]

/**
 * Detects card brand from card number
 * @param cardNumber - Card number (can include spaces/dashes)
 * @returns Card brand or 'unknown'
 */
export function detectCardBrand(cardNumber: string): CardBrand {
  const digits = cardNumber.replace(/\D/g, '')

  for (const { brand, pattern } of CARD_BRAND_PATTERNS) {
    if (pattern.test(digits)) {
      return brand
    }
  }

  return 'unknown'
}

/**
 * Gets card brand pattern info
 * @param brand - Card brand
 * @returns Card brand pattern or undefined
 */
export function getCardBrandPattern(brand: CardBrand): CardBrandPattern | undefined {
  return CARD_BRAND_PATTERNS.find((p) => p.brand === brand)
}

/**
 * Validates card number length for detected brand
 * @param cardNumber - Card number
 * @returns true if length is valid for brand
 */
export function isValidCardLength(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '')
  const brand = detectCardBrand(digits)

  if (brand === 'unknown') {
    // Accept generic lengths if brand unknown
    return digits.length >= 13 && digits.length <= 19
  }

  const pattern = getCardBrandPattern(brand)
  return pattern ? pattern.lengths.includes(digits.length) : false
}
