/**
 * DeonPay Main Class
 * Entry point for the SDK
 */

import { Elements } from './Elements.tsx'
import { TokenizationAPI } from './tokenization'
import type {
  DeonPayConfig,
  ElementsOptions,
  ConfirmPaymentParams,
  ConfirmPaymentResult,
  PaymentIntent,
} from './types'

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
      // Get payment and billing elements
      const allElements = elements.getElements()
      const paymentElement = allElements.find((el: any) => el.type === 'payment')
      const billingElement = allElements.find((el: any) => el.type === 'billing')

      if (!paymentElement) {
        throw new Error('No payment element found')
      }

      // Submit all elements to trigger validation
      await elements.submit()

      // Get card data
      const cardData = (paymentElement as any).getCardData()

      if (!cardData || !cardData.number || !cardData.exp_month || !cardData.exp_year || !cardData.cvv) {
        throw new Error('Información de la tarjeta incompleta')
      }

      // Get billing details from billing element (if present)
      let billing_details: any = undefined
      if (billingElement) {
        const billingData = (billingElement as any).getBillingData()
        if (billingData) {
          billing_details = {
            name: billingData.name || cardData.cardholder_name || undefined,
            email: billingData.email || undefined,
            phone: billingData.phone || undefined,
            address: billingData.address || undefined,
          }
        }
      } else if (cardData.cardholder_name) {
        // Fallback to cardholder name if no billing element
        billing_details = { name: cardData.cardholder_name }
      }

      // Create token with billing details
      const token = await this.tokenAPI.createToken({
        card: {
          number: cardData.number,
          exp_month: cardData.exp_month,
          exp_year: cardData.exp_year,
          cvv: cardData.cvv,
        },
        billing_details,
      })

      // Get client secret from elements
      const clientSecret = elements.getClientSecret()
      const paymentIntentId = this.extractPaymentIntentId(clientSecret)

      // Confirm payment intent with token and billing details
      const paymentIntent = await this.confirmPaymentIntentWithToken(
        paymentIntentId,
        token.id,
        billing_details,
        confirmParams?.return_url
      )

      // Handle requires_action (3DS)
      if (paymentIntent.status === 'requires_action' && paymentIntent.next_action) {
        if (redirect === 'if_required') {
          // Use iframe for 3DS challenge
          const redirectUrl = paymentIntent.next_action.redirect_to_url?.url
          if (redirectUrl) {
            try {
              const authResult = await this.handle3DSChallenge(redirectUrl)

              // Complete authentication with the backend
              const completedPaymentIntent = await this.completeAuthentication(
                paymentIntentId,
                authResult.PaRes,
                authResult.MD
              )

              return {
                paymentIntent: completedPaymentIntent,
              }
            } catch (error: any) {
              return {
                error: {
                  type: 'authentication_error',
                  message: error.message || '3DS authentication failed',
                },
              }
            }
          }
        } else if (redirect === 'always') {
          // Full page redirect for 3DS
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
   * @param billingDetails - Billing details
   * @param returnUrl - Optional return URL for 3DS
   * @returns Payment intent
   */
  private async confirmPaymentIntentWithToken(
    paymentIntentId: string,
    tokenId: string,
    billingDetails?: any,
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
        billing_details: billingDetails,
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
   * Handle 3DS challenge in an iframe/popup
   * @param redirectUrl - 3DS challenge URL
   * @returns Authentication result with PaRes and MD
   */
  private async handle3DSChallenge(
    redirectUrl: string
  ): Promise<{ PaRes: string; MD?: string }> {
    return new Promise((resolve, reject) => {
      // Create modal overlay
      const overlay = document.createElement('div')
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
      `

      // Create iframe container
      const container = document.createElement('div')
      container.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 20px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow: hidden;
        position: relative;
      `

      // Create close button
      const closeBtn = document.createElement('button')
      closeBtn.textContent = '×'
      closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        z-index: 1;
      `
      closeBtn.onclick = () => {
        document.body.removeChild(overlay)
        reject(new Error('3DS authentication cancelled by user'))
      }

      // Create iframe for 3DS
      const iframe = document.createElement('iframe')
      iframe.src = redirectUrl
      iframe.style.cssText = `
        width: 100%;
        height: 500px;
        border: none;
        border-radius: 4px;
      `

      // Listen for postMessage from 3DS iframe
      const messageHandler = (event: MessageEvent) => {
        // Validate origin if possible
        if (event.data && event.data.type === '3ds_complete') {
          window.removeEventListener('message', messageHandler)
          document.body.removeChild(overlay)

          resolve({
            PaRes: event.data.PaRes,
            MD: event.data.MD,
          })
        }
      }

      window.addEventListener('message', messageHandler)

      // Also listen for iframe navigation (for non-postMessage flows)
      // This is a fallback - ideally the 3DS page should postMessage
      iframe.addEventListener('load', () => {
        try {
          // Try to read the iframe content (won't work for cross-origin)
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
          if (iframeDoc) {
            // Look for form with PaRes
            const paResInput = iframeDoc.querySelector('input[name="PaRes"]') as HTMLInputElement
            const mdInput = iframeDoc.querySelector('input[name="MD"]') as HTMLInputElement

            if (paResInput && paResInput.value) {
              window.removeEventListener('message', messageHandler)
              document.body.removeChild(overlay)

              resolve({
                PaRes: paResInput.value,
                MD: mdInput?.value,
              })
            }
          }
        } catch (e) {
          // Cross-origin iframe, can't read content
          // Rely on postMessage instead
        }
      })

      // Assemble and add to DOM
      container.appendChild(closeBtn)
      container.appendChild(iframe)
      overlay.appendChild(container)
      document.body.appendChild(overlay)

      // Timeout after 5 minutes
      setTimeout(() => {
        if (document.body.contains(overlay)) {
          window.removeEventListener('message', messageHandler)
          document.body.removeChild(overlay)
          reject(new Error('3DS authentication timed out'))
        }
      }, 5 * 60 * 1000)
    })
  }

  /**
   * Complete authentication with the backend
   * @param paymentIntentId - Payment intent ID
   * @param paRes - PaRes from 3DS
   * @param md - MD from 3DS
   * @returns Updated payment intent
   */
  private async completeAuthentication(
    paymentIntentId: string,
    paRes: string,
    md?: string
  ): Promise<PaymentIntent> {
    const url = `${this.config.apiUrl}/api/v1/payment_intents/${paymentIntentId}/complete_authentication`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.publicKey}`,
      },
      body: JSON.stringify({
        authentication_result: paRes,
        MD: md,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to complete authentication')
    }

    return data
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
