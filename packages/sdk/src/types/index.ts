/**
 * DeonPay Elements SDK Types
 */

export type Theme = 'flat' | 'classic' | 'dark' | 'none'

export interface AppearanceVariables {
  colorPrimary?: string
  colorBackground?: string
  colorText?: string
  colorDanger?: string
  colorTextSecondary?: string
  colorTextPlaceholder?: string
  fontFamily?: string
  fontSize?: string
  fontSizeLabel?: string
  fontWeightNormal?: string
  fontWeightMedium?: string
  borderRadius?: string
  borderWidth?: string
  borderColor?: string
  focusBorderColor?: string
  errorBorderColor?: string
  spacingUnit?: string
}

export interface Appearance {
  theme?: Theme
  variables?: AppearanceVariables
  rules?: Record<string, React.CSSProperties>
}

export interface DeonPayConfig {
  apiUrl?: string
  locale?: 'es' | 'en'
}

export interface ElementsOptions {
  clientSecret: string
  appearance?: Appearance
  locale?: 'es' | 'en'
}

export interface PaymentElementOptions {
  layout?: 'tabs' | 'accordion'
  defaultValues?: {
    billingDetails?: {
      name?: string
      email?: string
    }
  }
  fields?: {
    billingDetails?: 'auto' | 'never' | {
      name?: 'auto' | 'never'
      email?: 'auto' | 'never'
      address?: 'auto' | 'never'
    }
  }
}

export interface CardData {
  number: string
  exp_month: number
  exp_year: number
  cvv: string
}

export interface BillingDetails {
  name?: string
  email?: string
  address?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
}

export interface CardToken {
  id: string
  card: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
}

export interface PaymentIntent {
  id: string
  client_secret: string
  status: string
  amount: number
  currency: string
  [key: string]: any
}

export interface ConfirmPaymentParams {
  elements: any // Elements instance
  confirmParams?: {
    return_url?: string
  }
  redirect?: 'if_required' | 'always'
}

export interface ConfirmPaymentResult {
  error?: {
    type: string
    message: string
    code?: string
  }
  paymentIntent?: PaymentIntent
}

export interface ElementChangeEvent {
  complete: boolean
  empty: boolean
  error?: {
    type: string
    message: string
  }
}

export interface PaymentCardState {
  cardNumber: string
  expiry: string
  cvv: string
  cardholderName: string
  errors: {
    cardNumber?: string
    expiry?: string
    cvv?: string
    cardholderName?: string
  }
  touched: {
    cardNumber: boolean
    expiry: boolean
    cvv: boolean
    cardholderName: boolean
  }
  isComplete: boolean
}

export interface BillingDetailsState {
  name: string
  email: string
  phone: string
  address: {
    line1: string
    line2: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  errors: {
    [key: string]: string
  }
  touched: {
    name: boolean
    email: boolean
    phone: boolean
    address: {
      line1: boolean
      line2: boolean
      city: boolean
      state: boolean
      postal_code: boolean
      country: boolean
    }
  }
  isComplete: boolean
}
