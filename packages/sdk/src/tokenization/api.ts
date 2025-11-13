/**
 * Tokenization API Client
 * Handles communication with DeonPay API for token creation
 */

import type { CardData, CardToken, BillingDetails } from '../types'

export interface CreateTokenRequest {
  card: CardData
  billing_details?: BillingDetails
}

export interface CreateTokenResponse {
  token: CardToken
}

export interface ApiError {
  type: string
  message: string
  code?: string
  param?: string
}

export class TokenizationAPI {
  private apiUrl: string
  private publicKey: string

  constructor(publicKey: string, apiUrl = 'https://api.deonpay.mx') {
    this.publicKey = publicKey
    this.apiUrl = apiUrl
  }

  /**
   * Creates a card token
   * @param request - Token creation request
   * @returns Card token
   * @throws Error if request fails
   */
  async createToken(request: CreateTokenRequest): Promise<CardToken> {
    const url = `${this.apiUrl}/api/elements/tokens`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.publicKey}`,
      },
      body: JSON.stringify(request),
    })

    const data = await response.json()

    if (!response.ok) {
      const error: ApiError = data.error || {
        type: 'api_error',
        message: 'Failed to create token',
      }
      throw new Error(error.message)
    }

    return data.token
  }
}
