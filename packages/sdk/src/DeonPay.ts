/**
 * DeonPay Main Class
 * Entry point for the SDK
 */

import { Elements } from './Elements'
import { TokenizationAPI } from './tokenization'
import type {
  DeonPayConfig,
  ElementsOptions,
  ConfirmPaymentParams,
  ConfirmPaymentResult,
  PaymentIntent,
} from './types'
import { parseExpiry } from '@deonpay/elements-core'

export class DeonPay {
  private publicKey: string
  private config: DeonPayConfig
  private tokenAPI: TokenizationAPI

  constructor(publicKey: string, config: DeonPayConfig = {}) {
    if (!publicKey) {
      throw new Error('DeonPay: publicKey is required')
    }

    if (!publicKey.startsWith('pk_')) {
      throw new Error('DeonPay: Invalid public key format. Must start with "pk_"')
    }

    this.publicKey = publicKey
    this.config = {
      apiUrl: config.apiUrl || 'https://api.deonpay.mx',
      locale: config.locale || 'es',
    }

    this.tokenAPI = new TokenizationAPI(this.publicKey, this.config.apiUrl)
  }

  /**
   * Creates an Elements instance
   * @param options - Elements configuration
   * @returns Elements instance
   */
  elements(options: ElementsOptions): Elements {
    if (!options.clientSecret) {
      throw new Error('DeonPay: clientSecret is required')
    }

    return new Elements({
      ...options,
      locale: options.locale || this.config.locale,
    })
  }

  /**
   * Confirms a payment intent
   * @param params - Confirmation parameters
   * @returns Confirmation result
   */
  async confirmPayment(params: ConfirmPaymentParams): Promise<ConfirmPaymentResult> {
    const { elements, confirmParams, redirect = 'if_required' } = params

    try {
      // Get payment element
      const paymentElements = elements.getElements()
      const paymentElement = paymentElements.find((el: any) => el.type === 'payment')

      if (!paymentElement) {
        throw new Error('No payment element found')
      }

      // Submit element to trigger validation
      await elements.submit()

      // Get card data
      const cardData = (paymentElement as any).getCardData()

      if (!cardData || !cardData.number || !cardData.exp_month || !cardData.exp_year || !cardData.cvv) {
        throw new Error('Información de la tarjeta incompleta')
      }

      // Create token
      const token = await this.tokenAPI.createToken({
        card: {
          number: cardData.number,
          exp_month: cardData.exp_month,
          exp_year: cardData.exp_year,
          cvv: cardData.cvv,
        },
        billing_details: cardData.cardholder_name
          ? { name: cardData.cardholder_name }
          : undefined,
      })

      // Get client secret from elements
      const clientSecret = elements.getClientSecret()
      const paymentIntentId = this.extractPaymentIntentId(clientSecret)

      // Confirm payment intent with token
      const paymentIntent = await this.confirmPaymentIntentWithToken(
        paymentIntentId,
        token.id,
        confirmParams?.return_url
      )

      // Handle requires_action (3DS)
      if (paymentIntent.status === 'requires_action' && paymentIntent.next_action) {
        if (redirect === 'always' || redirect === 'if_required') {
          const redirectUrl = paymentIntent.next_action.redirect_to_url?.url
          if (redirectUrl) {
            window.location.href = redirectUrl
          }
        }
      }

      return {
        paymentIntent,
      }
    } catch (error: any) {
      return {
        error: {
          type: 'api_error',
          message: error.message || 'Failed to confirm payment',
        },
      }
    }
  }

  /**
   * Confirms payment intent with token via API
   * @param paymentIntentId - Payment intent ID
   * @param tokenId - Card token ID
   * @param returnUrl - Optional return URL for 3DS
   * @returns Payment intent
   */
  private async confirmPaymentIntentWithToken(
    paymentIntentId: string,
    tokenId: string,
    returnUrl?: string
  ): Promise<PaymentIntent> {
    const url = `${this.config.apiUrl}/api/v1/payment_intents/${paymentIntentId}/confirm`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.publicKey}`,
      },
      body: JSON.stringify({
        payment_method: tokenId,
        return_url: returnUrl,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to confirm payment')
    }

    return data
  }

  /**
   * Extracts payment intent ID from client secret
   * @param clientSecret - Client secret (format: pi_xxx_secret_yyy)
   * @returns Payment intent ID
   */
  private extractPaymentIntentId(clientSecret: string): string {
    const parts = clientSecret.split('_secret_')
    if (parts.length !== 2) {
      throw new Error('Invalid client secret format')
    }
    return parts[0]
  }

  /**
   * Gets the public key
   * @returns Public key
   */
  getPublicKey(): string {
    return this.publicKey
  }

  /**
   * Gets the configuration
   * @returns Configuration
   */
  getConfig(): DeonPayConfig {
    return this.config
  }
}
