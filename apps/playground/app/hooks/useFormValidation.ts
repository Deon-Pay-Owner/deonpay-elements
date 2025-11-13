'use client'

import { useMemo } from 'react'
import { useAdapterDetection, AdapterInfo } from './useAdapterDetection'
import { ElementType } from '../components/builder/ElementCard'

export interface ValidationResult {
  isValid: boolean
  warnings: string[]
  errors: string[]
  requiresBillingElement: boolean
  hasBillingElement: boolean
  hasPaymentElement: boolean
}

/**
 * Validate the form configuration based on selected elements and adapter requirements
 */
export function useFormValidation(
  elements: ElementType[],
  secretKey: string
): ValidationResult {
  const adapterInfo = useAdapterDetection(secretKey)

  return useMemo(() => {
    const hasPaymentElement = elements.some(el => el.type === 'payment')
    const hasBillingElement = elements.some(el => el.type === 'billing')
    const warnings: string[] = []
    const errors: string[] = []

    // Check if payment element exists
    if (!hasPaymentElement) {
      errors.push('Se requiere al menos el elemento de pago')
    }

    // Check CyberSource billing requirement
    if (adapterInfo.type === 'cybersource' && hasPaymentElement && !hasBillingElement) {
      warnings.push('CyberSource requiere información de facturación. Agrega el elemento "Detalles de Facturación" para procesar pagos.')
    }

    const isValid = errors.length === 0 && !(adapterInfo.requiresBilling && hasPaymentElement && !hasBillingElement)

    return {
      isValid,
      warnings,
      errors,
      requiresBillingElement: adapterInfo.requiresBilling,
      hasBillingElement,
      hasPaymentElement,
    }
  }, [elements, adapterInfo])
}