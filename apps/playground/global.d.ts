/**
 * Global type declarations for DeonPay Elements Playground
 */

declare global {
  var tokenStore: Map<string, {
    card: {
      number_hash: string
      last4: string
      brand: string
      exp_month: number
      exp_year: number
    }
    billing_details?: any
    created_at: number
    used: boolean
  }>

  var paymentIntents: Map<string, {
    id: string
    client_secret: string
    amount: number
    currency: string
    status: string
    description: string
    created: number
    payment_method?: string
    charges?: any[]
    next_action?: any
    last_payment_error?: any
  }>
}

export {}
