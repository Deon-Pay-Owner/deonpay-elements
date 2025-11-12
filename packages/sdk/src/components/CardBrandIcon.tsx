/**
 * Card Brand Icon Component
 * Displays SVG icons for different card brands
 */

import React from 'react'
import type { CardBrand } from '@deonpay/elements-core'

interface CardBrandIconProps {
  brand: CardBrand
  className?: string
}

export const CardBrandIcon: React.FC<CardBrandIconProps> = ({ brand, className = '' }) => {
  const baseClass = `deonpay-card-brand ${className}`

  switch (brand) {
    case 'visa':
      return (
        <svg className={baseClass} width="32" height="20" viewBox="0 0 32 20" fill="none">
          <rect width="32" height="20" rx="2" fill="#1434CB"/>
          <path d="M13.8 14.5L15.2 6.5H17L15.6 14.5H13.8Z" fill="white"/>
          <path d="M21.5 6.7C21.1 6.5 20.5 6.3 19.7 6.3C17.9 6.3 16.7 7.2 16.7 8.5C16.7 9.5 17.7 10 18.4 10.3C19.2 10.6 19.5 10.8 19.5 11.1C19.5 11.6 18.9 11.8 18.3 11.8C17.5 11.8 17.1 11.7 16.4 11.4L16.1 11.3L15.8 13.1C16.3 13.3 17.2 13.5 18.1 13.5C20.1 13.5 21.2 12.6 21.2 11.2C21.2 10.4 20.7 9.8 19.6 9.3C18.9 9 18.5 8.8 18.5 8.4C18.5 8.1 18.8 7.8 19.6 7.8C20.3 7.8 20.8 7.9 21.2 8.1L21.4 8.2L21.5 6.7Z" fill="white"/>
          <path d="M24.5 6.5H23.1C22.7 6.5 22.4 6.6 22.2 7L19.5 14.5H21.5L21.9 13.3H24.3L24.5 14.5H26.3L24.5 6.5ZM22.5 11.7L23.4 9.1L23.9 11.7H22.5Z" fill="white"/>
          <path d="M11.5 6.5L9.6 12.2L9.4 11.2C9 9.9 7.8 8.5 6.5 7.8L8.1 14.5H10.2L13.6 6.5H11.5Z" fill="white"/>
          <path d="M7.5 6.5H4.5L4.5 6.7C6.9 7.3 8.5 8.8 9.1 10.7L8.4 7C8.3 6.6 8 6.5 7.5 6.5Z" fill="#FFA500"/>
        </svg>
      )

    case 'mastercard':
      return (
        <svg className={baseClass} width="32" height="20" viewBox="0 0 32 20" fill="none">
          <rect width="32" height="20" rx="2" fill="#EB001B"/>
          <circle cx="12" cy="10" r="6" fill="#FF5F00"/>
          <circle cx="20" cy="10" r="6" fill="#F79E1B"/>
          <path d="M16 5.5C17.1 6.4 17.8 7.8 17.8 9.4C17.8 11 17.1 12.4 16 13.3C14.9 12.4 14.2 11 14.2 9.4C14.2 7.8 14.9 6.4 16 5.5Z" fill="#FF5F00"/>
        </svg>
      )

    case 'amex':
      return (
        <svg className={baseClass} width="32" height="20" viewBox="0 0 32 20" fill="none">
          <rect width="32" height="20" rx="2" fill="#006FCF"/>
          <path d="M8.5 8.5H10.5L9.5 6L8.5 8.5ZM11 10H8L7.5 11H6L8.5 5H10.5L13 11H11.5L11 10Z" fill="white"/>
          <path d="M13.5 5H17V6.5H15V7.5H17V9H15V10.5H17V12H13.5V5Z" fill="white"/>
          <path d="M17.5 5H19L20.5 8L22 5H23.5L21 10V12H19.5V10L17.5 5Z" fill="white"/>
        </svg>
      )

    case 'discover':
      return (
        <svg className={baseClass} width="32" height="20" viewBox="0 0 32 20" fill="none">
          <rect width="32" height="20" rx="2" fill="#FF6000"/>
          <circle cx="24" cy="10" r="8" fill="#FFB000"/>
        </svg>
      )

    case 'diners':
      return (
        <svg className={baseClass} width="32" height="20" viewBox="0 0 32 20" fill="none">
          <rect width="32" height="20" rx="2" fill="#0079BE"/>
          <circle cx="12" cy="10" r="5" fill="white"/>
          <circle cx="20" cy="10" r="5" fill="white"/>
        </svg>
      )

    case 'jcb':
      return (
        <svg className={baseClass} width="32" height="20" viewBox="0 0 32 20" fill="none">
          <rect width="32" height="20" rx="2" fill="#0E4C96"/>
          <rect x="8" y="6" width="4" height="8" fill="#FF0000"/>
          <rect x="14" y="6" width="4" height="8" fill="#00A651"/>
          <rect x="20" y="6" width="4" height="8" fill="#0E4C96"/>
        </svg>
      )

    case 'unionpay':
      return (
        <svg className={baseClass} width="32" height="20" viewBox="0 0 32 20" fill="none">
          <rect width="32" height="20" rx="2" fill="#E21836"/>
          <circle cx="10" cy="10" r="4" fill="#00447C"/>
          <circle cx="22" cy="10" r="4" fill="#007B84"/>
        </svg>
      )

    case 'maestro':
      return (
        <svg className={baseClass} width="32" height="20" viewBox="0 0 32 20" fill="none">
          <rect width="32" height="20" rx="2" fill="#6C6C6C"/>
          <circle cx="12" cy="10" r="5" fill="#EB001B"/>
          <circle cx="20" cy="10" r="5" fill="#0099DF"/>
        </svg>
      )

    default:
      return (
        <svg className={baseClass} width="32" height="20" viewBox="0 0 32 20" fill="none">
          <rect width="32" height="20" rx="2" fill="#E5E7EB"/>
          <rect x="4" y="8" width="8" height="4" rx="1" fill="#9CA3AF"/>
          <rect x="14" y="8" width="14" height="1.5" rx="0.75" fill="#D1D5DB"/>
          <rect x="14" y="10.5" width="10" height="1.5" rx="0.75" fill="#D1D5DB"/>
        </svg>
      )
  }
}
