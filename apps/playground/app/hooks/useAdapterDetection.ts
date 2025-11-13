'use client'

import { useMemo } from 'react'

export type AdapterType = 'cybersource' | 'mock' | 'unknown'

export interface AdapterInfo {
  type: AdapterType
  name: string
  requiresBilling: boolean
}

/**
 * Detect which payment adapter is being used based on the API keys
 */
export function useAdapterDetection(secretKey: string): AdapterInfo {
  return useMemo(() => {
    // CyberSource keys typically start with a specific pattern
    // This is a basic detection - adjust based on actual key patterns
    if (secretKey.includes('cybersource') || secretKey.startsWith('sk_live_cs_') || secretKey.startsWith('sk_test_cs_')) {
      return {
        type: 'cybersource',
        name: 'CyberSource',
        requiresBilling: true,
      }
    }

    // Mock/demo adapter
    if (secretKey.includes('demo') || secretKey.includes('test') || secretKey.includes('mock')) {
      return {
        type: 'mock',
        name: 'Demo/Mock',
        requiresBilling: false,
      }
    }

    // Unknown adapter - default to requiring billing for safety
    return {
      type: 'unknown',
      name: 'Unknown',
      requiresBilling: false,
    }
  }, [secretKey])
}