/**
 * Payment Card Component
 * Main card input component with validation
 */

import React, { useState, useCallback, useEffect } from 'react'
import {
  validateCardNumber,
  validateExpiry,
  validateCvv,
  formatCardNumber,
  formatExpiryInput,
  detectCardBrand,
  isCardNumberComplete,
  isExpiryComplete,
  isCvvComplete,
  parseExpiry,
} from '@deonpay/elements-core'
import { CardBrandIcon } from './CardBrandIcon'
import type { PaymentCardState, ElementChangeEvent } from '../types'

interface PaymentCardProps {
  onChange?: (event: ElementChangeEvent) => void
  onReady?: () => void
  options?: {
    showCardholderName?: boolean
    hidePostalCode?: boolean
  }
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  onChange,
  onReady,
  options = {},
}) => {
  const { showCardholderName = true } = options

  const [state, setState] = useState<PaymentCardState>({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholderName: '',
    errors: {},
    touched: {
      cardNumber: false,
      expiry: false,
      cvv: false,
      cardholderName: false,
    },
    isComplete: false,
  })

  const cardBrand = detectCardBrand(state.cardNumber)

  // Notify parent of changes
  useEffect(() => {
    const hasErrors = Object.keys(state.errors).length > 0
    const isComplete =
      isCardNumberComplete(state.cardNumber) &&
      isExpiryComplete(state.expiry, '') &&
      isCvvComplete(state.cvv, state.cardNumber) &&
      (!showCardholderName || state.cardholderName.length > 0)

    onChange?.({
      complete: isComplete && !hasErrors,
      empty: !state.cardNumber && !state.expiry && !state.cvv,
      error: hasErrors ? { type: 'validation_error', message: Object.values(state.errors)[0] || '' } : undefined,
    })
  }, [state, onChange, showCardholderName])

  // Notify ready
  useEffect(() => {
    onReady?.()
  }, [onReady])

  const handleCardNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s/g, '')
    const formatted = formatCardNumber(rawValue)

    setState((prev) => {
      const newState = { ...prev, cardNumber: formatted }

      // Validate if touched
      if (prev.touched.cardNumber) {
        const validation = validateCardNumber(rawValue, isCardNumberComplete(rawValue))
        newState.errors = {
          ...prev.errors,
          cardNumber: validation.errors[0],
        }
        if (!validation.errors[0]) {
          delete newState.errors.cardNumber
        }
      }

      return newState
    })
  }, [])

  const handleExpiryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryInput(e.target.value)

    setState((prev) => {
      const newState = { ...prev, expiry: formatted }

      // Validate if touched
      if (prev.touched.expiry) {
        const parsed = parseExpiry(formatted)
        if (parsed && isExpiryComplete(parsed.month, parsed.year)) {
          const validation = validateExpiry(parsed.month, parsed.year, true)
          newState.errors = {
            ...prev.errors,
            expiry: validation.errors[0],
          }
          if (!validation.errors[0]) {
            delete newState.errors.expiry
          }
        }
      }

      return newState
    })
  }, [])

  const handleCvvChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)

    setState((prev) => {
      const newState = { ...prev, cvv: value }

      // Validate if touched
      if (prev.touched.cvv) {
        const validation = validateCvv(value, prev.cardNumber, isCvvComplete(value, prev.cardNumber))
        newState.errors = {
          ...prev.errors,
          cvv: validation.errors[0],
        }
        if (!validation.errors[0]) {
          delete newState.errors.cvv
        }
      }

      return newState
    })
  }, [])

  const handleCardholderNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setState((prev) => {
      const newState = { ...prev, cardholderName: value }

      // Validate if touched
      if (prev.touched.cardholderName && showCardholderName) {
        newState.errors = {
          ...prev.errors,
          cardholderName: value.length === 0 ? 'El nombre del titular es requerido' : undefined,
        }
        if (!newState.errors.cardholderName) {
          delete newState.errors.cardholderName
        }
      }

      return newState
    })
  }, [showCardholderName])

  const handleBlur = useCallback((field: keyof PaymentCardState) => {
    setState((prev) => {
      const newState = {
        ...prev,
        touched: { ...prev.touched, [field]: true },
      }

      // Validate on blur
      switch (field) {
        case 'cardNumber': {
          const rawValue = String(prev.cardNumber || '').replace(/\s/g, '')
          const validation = validateCardNumber(rawValue, true)
          newState.errors = {
            ...prev.errors,
            cardNumber: validation.errors[0],
          }
          if (!validation.errors[0]) {
            delete newState.errors.cardNumber
          }
          break
        }
        case 'expiry': {
          const parsed = parseExpiry(prev.expiry)
          if (parsed) {
            const validation = validateExpiry(parsed.month, parsed.year, true)
            newState.errors = {
              ...prev.errors,
              expiry: validation.errors[0],
            }
            if (!validation.errors[0]) {
              delete newState.errors.expiry
            }
          } else {
            newState.errors = {
              ...prev.errors,
              expiry: 'La fecha de expiración es inválida',
            }
          }
          break
        }
        case 'cvv': {
          const validation = validateCvv(prev.cvv, prev.cardNumber, true)
          newState.errors = {
            ...prev.errors,
            cvv: validation.errors[0],
          }
          if (!validation.errors[0]) {
            delete newState.errors.cvv
          }
          break
        }
        case 'cardholderName': {
          if (showCardholderName && prev.cardholderName.length === 0) {
            newState.errors = {
              ...prev.errors,
              cardholderName: 'El nombre del titular es requerido',
            }
          }
          break
        }
      }

      return newState
    })
  }, [showCardholderName])

  return (
    <div className="deonpay-payment-card">
      {/* Card Number */}
      <div className="deonpay-form-group">
        <label htmlFor="deonpay-card-number" className="deonpay-label">
          Número de tarjeta
        </label>
        <div className="deonpay-input-wrapper">
          <input
            id="deonpay-card-number"
            type="text"
            className={`deonpay-input has-icon ${state.errors.cardNumber && state.touched.cardNumber ? 'error' : ''}`}
            placeholder="1234 5678 9012 3456"
            value={state.cardNumber}
            onChange={handleCardNumberChange}
            onBlur={() => handleBlur('cardNumber')}
            autoComplete="cc-number"
            inputMode="numeric"
          />
          <div className="deonpay-input-icon">
            <CardBrandIcon brand={cardBrand} />
          </div>
        </div>
        {state.errors.cardNumber && state.touched.cardNumber && (
          <span className="deonpay-error-message">{state.errors.cardNumber}</span>
        )}
      </div>

      {/* Expiry and CVV Row */}
      <div className="deonpay-row">
        <div className="deonpay-col">
          <div className="deonpay-form-group">
            <label htmlFor="deonpay-expiry" className="deonpay-label">
              Fecha de expiración
            </label>
            <input
              id="deonpay-expiry"
              type="text"
              className={`deonpay-input ${state.errors.expiry && state.touched.expiry ? 'error' : ''}`}
              placeholder="MM/AA"
              value={state.expiry}
              onChange={handleExpiryChange}
              onBlur={() => handleBlur('expiry')}
              autoComplete="cc-exp"
              inputMode="numeric"
              maxLength={5}
            />
            {state.errors.expiry && state.touched.expiry && (
              <span className="deonpay-error-message">{state.errors.expiry}</span>
            )}
          </div>
        </div>

        <div className="deonpay-col">
          <div className="deonpay-form-group">
            <label htmlFor="deonpay-cvv" className="deonpay-label">
              CVV
            </label>
            <input
              id="deonpay-cvv"
              type="text"
              className={`deonpay-input ${state.errors.cvv && state.touched.cvv ? 'error' : ''}`}
              placeholder="123"
              value={state.cvv}
              onChange={handleCvvChange}
              onBlur={() => handleBlur('cvv')}
              autoComplete="cc-csc"
              inputMode="numeric"
              maxLength={4}
            />
            {state.errors.cvv && state.touched.cvv && (
              <span className="deonpay-error-message">{state.errors.cvv}</span>
            )}
          </div>
        </div>
      </div>

      {/* Cardholder Name */}
      {showCardholderName && (
        <div className="deonpay-form-group">
          <label htmlFor="deonpay-cardholder-name" className="deonpay-label">
            Nombre del titular
          </label>
          <input
            id="deonpay-cardholder-name"
            type="text"
            className={`deonpay-input ${state.errors.cardholderName && state.touched.cardholderName ? 'error' : ''}`}
            placeholder="Nombre como aparece en la tarjeta"
            value={state.cardholderName}
            onChange={handleCardholderNameChange}
            onBlur={() => handleBlur('cardholderName')}
            autoComplete="cc-name"
          />
          {state.errors.cardholderName && state.touched.cardholderName && (
            <span className="deonpay-error-message">{state.errors.cardholderName}</span>
          )}
        </div>
      )}
    </div>
  )
}

// Export internal state getter for Elements class (for future use)
// export const getPaymentCardData = (container: HTMLElement) => {
//   return null
// }
