/**
 * Billing Details Component
 * Collects billing information for payment processing
 */

import React, { useState, useCallback, useEffect } from 'react'
import type { BillingDetailsState, ElementChangeEvent } from '../types'

interface BillingDetailsProps {
  onChange?: (event: ElementChangeEvent) => void
  onReady?: () => void
  options?: {
    fields?: {
      name?: 'auto' | 'never'
      email?: 'auto' | 'never'
      phone?: 'auto' | 'never'
      address?: {
        line1?: 'auto' | 'never'
        line2?: 'auto' | 'never'
        city?: 'auto' | 'never'
        state?: 'auto' | 'never'
        postal_code?: 'auto' | 'never'
        country?: 'auto' | 'never'
      }
    }
    defaultValues?: {
      name?: string
      email?: string
      phone?: string
      address?: {
        line1?: string
        line2?: string
        city?: string
        state?: string
        postal_code?: string
        country?: string
      }
    }
  }
}

export const BillingDetails: React.FC<BillingDetailsProps> = ({
  onChange,
  onReady,
  options = {},
}) => {
  const { fields = {}, defaultValues = {} } = options

  const [state, setState] = useState<BillingDetailsState>({
    name: defaultValues.name || '',
    email: defaultValues.email || '',
    phone: defaultValues.phone || '',
    address: {
      line1: defaultValues.address?.line1 || '',
      line2: defaultValues.address?.line2 || '',
      city: defaultValues.address?.city || '',
      state: defaultValues.address?.state || '',
      postal_code: defaultValues.address?.postal_code || '',
      country: defaultValues.address?.country || 'MX',
    },
    errors: {},
    touched: {
      name: false,
      email: false,
      phone: false,
      address: {
        line1: false,
        line2: false,
        city: false,
        state: false,
        postal_code: false,
        country: false,
      },
    },
    isComplete: false,
  })

  // Field visibility
  const showName = fields.name !== 'never'
  const showEmail = fields.email !== 'never'
  const showPhone = fields.phone !== 'never'
  const showAddress = fields.address && Object.values(fields.address).some(v => v !== 'never')
  const showAddressLine1 = fields.address?.line1 !== 'never'
  const showAddressLine2 = fields.address?.line2 !== 'never'
  const showCity = fields.address?.city !== 'never'
  const showState = fields.address?.state !== 'never'
  const showPostalCode = fields.address?.postal_code !== 'never'
  const showCountry = fields.address?.country !== 'never'

  // Notify parent of changes
  useEffect(() => {
    const hasErrors = Object.keys(state.errors).length > 0
    const isComplete =
      (!showName || state.name.length > 0) &&
      (!showEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) &&
      (!showAddressLine1 || state.address.line1.length > 0) &&
      (!showCity || state.address.city.length > 0) &&
      (!showState || state.address.state.length > 0) &&
      (!showPostalCode || state.address.postal_code.length > 0) &&
      (!showCountry || state.address.country.length > 0)

    onChange?.(({
      complete: isComplete && !hasErrors,
      empty: !state.name && !state.email && !state.phone,
      error: hasErrors ? { type: 'validation_error', message: Object.values(state.errors)[0] || '' } : undefined,
    }))
  }, [state, onChange, showName, showEmail, showAddressLine1, showCity, showState, showPostalCode, showCountry])

  // Notify ready
  useEffect(() => {
    onReady?.()
  }, [onReady])

  const handleChange = useCallback((field: string, value: string) => {
    setState((prev) => {
      const newState = { ...prev }

      if (field.startsWith('address.')) {
        const addressField = field.split('.')[1]
        newState.address = { ...prev.address, [addressField]: value }
      } else {
        ;(newState as any)[field] = value
      }

      // Validate if touched
      const touchedField = field.startsWith('address.')
        ? prev.touched.address?.[field.split('.')[1] as keyof typeof prev.touched.address]
        : (prev.touched as any)[field]

      if (touchedField) {
        // Email validation
        if (field === 'email' && value.length > 0) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            newState.errors = { ...prev.errors, email: 'Email inválido' }
          } else {
            const { email, ...rest } = prev.errors
            newState.errors = rest
          }
        }

        // Required field validation
        if ((field === 'name' || field === 'address.line1' || field === 'address.city') && value.length === 0) {
          newState.errors = { ...prev.errors, [field]: 'Este campo es requerido' }
        } else if (value.length > 0) {
          const { [field]: _, ...rest } = prev.errors
          newState.errors = rest
        }
      }

      return newState
    })
  }, [])

  const handleBlur = useCallback((field: string) => {
    setState((prev) => {
      const newState = { ...prev }

      if (field.startsWith('address.')) {
        const addressField = field.split('.')[1] as keyof typeof prev.touched.address
        newState.touched = {
          ...prev.touched,
          address: { ...prev.touched.address, [addressField]: true },
        }
      } else {
        newState.touched = { ...prev.touched, [field]: true }
      }

      // Validate on blur
      const value = field.startsWith('address.')
        ? prev.address[field.split('.')[1] as keyof typeof prev.address]
        : (prev as any)[field]

      if (field === 'email' && value && value.length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          newState.errors = { ...prev.errors, email: 'Email inválido' }
        }
      }

      if ((field === 'name' || field === 'address.line1' || field === 'address.city') && (!value || value.length === 0)) {
        newState.errors = { ...prev.errors, [field]: 'Este campo es requerido' }
      }

      return newState
    })
  }, [])

  return (
    <div className="deonpay-billing-details">
      {/* Name */}
      {showName && (
        <div className="deonpay-form-group">
          <label htmlFor="deonpay-billing-name" className="deonpay-label">
            Nombre completo
          </label>
          <input
            id="deonpay-billing-name"
            type="text"
            className={`deonpay-input ${state.errors.name && state.touched.name ? 'error' : ''}`}
            placeholder="Juan Pérez"
            value={state.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            autoComplete="name"
          />
          {state.errors.name && state.touched.name && (
            <span className="deonpay-error-message">{state.errors.name}</span>
          )}
        </div>
      )}

      {/* Email */}
      {showEmail && (
        <div className="deonpay-form-group">
          <label htmlFor="deonpay-billing-email" className="deonpay-label">
            Email
          </label>
          <input
            id="deonpay-billing-email"
            type="email"
            className={`deonpay-input ${state.errors.email && state.touched.email ? 'error' : ''}`}
            placeholder="juan@ejemplo.com"
            value={state.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            autoComplete="email"
          />
          {state.errors.email && state.touched.email && (
            <span className="deonpay-error-message">{state.errors.email}</span>
          )}
        </div>
      )}

      {/* Phone */}
      {showPhone && (
        <div className="deonpay-form-group">
          <label htmlFor="deonpay-billing-phone" className="deonpay-label">
            Teléfono
          </label>
          <input
            id="deonpay-billing-phone"
            type="tel"
            className={`deonpay-input ${state.errors.phone && state.touched.phone ? 'error' : ''}`}
            placeholder="+52 55 1234 5678"
            value={state.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            autoComplete="tel"
          />
          {state.errors.phone && state.touched.phone && (
            <span className="deonpay-error-message">{state.errors.phone}</span>
          )}
        </div>
      )}

      {/* Address */}
      {showAddress && (
        <div className="deonpay-form-group">
          <label className="deonpay-label">Dirección</label>

          {showAddressLine1 && (
            <div className="deonpay-form-group">
              <input
                id="deonpay-billing-address-line1"
                type="text"
                className={`deonpay-input ${state.errors['address.line1'] && state.touched.address?.line1 ? 'error' : ''}`}
                placeholder="Calle y número"
                value={state.address.line1}
                onChange={(e) => handleChange('address.line1', e.target.value)}
                onBlur={() => handleBlur('address.line1')}
                autoComplete="address-line1"
              />
              {state.errors['address.line1'] && state.touched.address?.line1 && (
                <span className="deonpay-error-message">{state.errors['address.line1']}</span>
              )}
            </div>
          )}

          {showAddressLine2 && (
            <div className="deonpay-form-group">
              <input
                id="deonpay-billing-address-line2"
                type="text"
                className="deonpay-input"
                placeholder="Apartamento, suite, etc. (opcional)"
                value={state.address.line2}
                onChange={(e) => handleChange('address.line2', e.target.value)}
                onBlur={() => handleBlur('address.line2')}
                autoComplete="address-line2"
              />
            </div>
          )}

          <div className="deonpay-row">
            {showCity && (
              <div className="deonpay-col">
                <input
                  id="deonpay-billing-city"
                  type="text"
                  className={`deonpay-input ${state.errors['address.city'] && state.touched.address?.city ? 'error' : ''}`}
                  placeholder="Ciudad"
                  value={state.address.city}
                  onChange={(e) => handleChange('address.city', e.target.value)}
                  onBlur={() => handleBlur('address.city')}
                  autoComplete="address-level2"
                />
                {state.errors['address.city'] && state.touched.address?.city && (
                  <span className="deonpay-error-message">{state.errors['address.city']}</span>
                )}
              </div>
            )}

            {showState && (
              <div className="deonpay-col">
                <input
                  id="deonpay-billing-state"
                  type="text"
                  className="deonpay-input"
                  placeholder="Estado"
                  value={state.address.state}
                  onChange={(e) => handleChange('address.state', e.target.value)}
                  onBlur={() => handleBlur('address.state')}
                  autoComplete="address-level1"
                />
              </div>
            )}
          </div>

          <div className="deonpay-row">
            {showPostalCode && (
              <div className="deonpay-col">
                <input
                  id="deonpay-billing-postal-code"
                  type="text"
                  className="deonpay-input"
                  placeholder="Código postal"
                  value={state.address.postal_code}
                  onChange={(e) => handleChange('address.postal_code', e.target.value)}
                  onBlur={() => handleBlur('address.postal_code')}
                  autoComplete="postal-code"
                />
              </div>
            )}

            {showCountry && (
              <div className="deonpay-col">
                <select
                  id="deonpay-billing-country"
                  className="deonpay-input"
                  value={state.address.country}
                  onChange={(e) => handleChange('address.country', e.target.value)}
                  onBlur={() => handleBlur('address.country')}
                  autoComplete="country"
                >
                  <option value="MX">México</option>
                  <option value="US">Estados Unidos</option>
                  <option value="CA">Canadá</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
