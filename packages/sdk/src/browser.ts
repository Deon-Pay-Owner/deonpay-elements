/**
 * Browser-specific entry point for IIFE bundle
 * This file ensures proper export format for window.DeonPay
 */

import { DeonPay as DeonPayClass } from './DeonPay'
import type { DeonPayConfig } from './types'

// Import styles
import './styles/base.css'

/**
 * Creates a new DeonPay instance
 * @param publicKey - Your DeonPay public key (starts with pk_)
 * @param config - Optional configuration
 * @returns DeonPay instance
 */
function DeonPay(publicKey: string, config?: DeonPayConfig) {
  return new DeonPayClass(publicKey, config)
}

// Export as default for IIFE
export default DeonPay
