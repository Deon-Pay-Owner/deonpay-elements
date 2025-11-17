/**
 * Elements Class
 * Manages payment element instances
 */

import { createRoot, type Root } from 'react-dom/client'
import { PaymentCard } from './components/PaymentCard'
import { BillingDetails } from './components/BillingDetails'
import type {
  ElementsOptions,
  PaymentElementOptions,
  Appearance,
  ElementChangeEvent,
} from './types'

export class Elements {
  private clientSecret: string
  private appearance: Appearance
  private locale: 'es' | 'en'
  private elements: Map<string, ElementInstance> = new Map()

  constructor(options: ElementsOptions) {
    this.clientSecret = options.clientSecret
    this.appearance = options.appearance || {}
    this.locale = options.locale || 'es'
  }

  /**
   * Creates an element
   * @param type - Element type ('payment' or 'billing')
   * @param options - Element options
   * @returns Element instance
   */
  create(type: 'payment' | 'billing', options?: any): any {
    if (type === 'payment') {
      const element = new PaymentElement(this, options)
      this.elements.set(element.id, element)
      return element
    } else if (type === 'billing') {
      const element = new BillingElement(this, options)
      this.elements.set(element.id, element)
      return element
    } else {
      throw new Error(`Unsupported element type: ${type}`)
    }
  }

  /**
   * Gets the client secret
   * @returns Client secret
   */
  getClientSecret(): string {
    return this.clientSecret
  }

  /**
   * Gets appearance configuration
   * @returns Appearance config
   */
  getAppearance(): Appearance {
    return this.appearance
  }

  /**
   * Gets locale
   * @returns Locale
   */
  getLocale(): 'es' | 'en' {
    return this.locale
  }

  /**
   * Gets all mounted elements
   * @returns Array of element instances
   */
  getElements(): ElementInstance[] {
    return Array.from(this.elements.values())
  }

  /**
   * Submits all elements
   * @returns Promise that resolves when submission is complete
   */
  async submit(): Promise<void> {
    const elements = this.getElements()
    await Promise.all(elements.map((el) => el.submit?.()))
  }
}

interface ElementInstance {
  id: string
  type: string
  mount: (selector: string | HTMLElement) => void
  unmount: () => void
  submit?: () => Promise<void>
  on?: (event: string, handler: (e: any) => void) => void
  off?: (event: string, handler: (e: any) => void) => void
}

export class PaymentElement implements ElementInstance {
  public readonly id: string
  public readonly type = 'payment'

  private elements: Elements
  private options: PaymentElementOptions
  private container: HTMLElement | null = null
  private root: Root | null = null
  private eventHandlers: Map<string, Set<(e: any) => void>> = new Map()

  constructor(elements: Elements, options: PaymentElementOptions = {}) {
    this.id = `payment-element-${Math.random().toString(36).substr(2, 9)}`
    this.elements = elements
    this.options = options
  }

  /**
   * Mounts the element to the DOM
   * @param selector - CSS selector or HTMLElement
   */
  mount(selector: string | HTMLElement): void {
    if (this.container) {
      throw new Error('Element already mounted')
    }

    const container =
      typeof selector === 'string'
        ? document.querySelector<HTMLElement>(selector)
        : selector

    if (!container) {
      throw new Error(`Element not found: ${selector}`)
    }

    this.container = container
    this.render()
  }

  /**
   * Unmounts the element from the DOM
   */
  unmount(): void {
    if (this.root) {
      try {
        this.root.unmount()
      } catch (e) {
        // Ignore unmount errors if already unmounted
      }
      this.root = null
    }

    if (this.container) {
      this.container = null
    }
  }

  /**
   * Registers an event handler
   * @param event - Event name
   * @param handler - Event handler
   */
  on(event: string, handler: (e: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }
    this.eventHandlers.get(event)!.add(handler)
  }

  /**
   * Unregisters an event handler
   * @param event - Event name
   * @param handler - Event handler
   */
  off(event: string, handler: (e: any) => void): void {
    this.eventHandlers.get(event)?.delete(handler)
  }

  /**
   * Emits an event to registered handlers
   * @param event - Event name
   * @param data - Event data
   */
  private emit(event: string, data: any): void {
    this.eventHandlers.get(event)?.forEach((handler) => handler(data))
  }

  /**
   * Renders the component
   */
  private render(): void {
    if (!this.container) {
      return
    }

    // Apply theme to container
    this.container.classList.add('deonpay-elements')
    const theme = this.elements.getAppearance().theme
    if (theme && theme !== 'none') {
      this.container.setAttribute('data-theme', theme)
    }

    // Apply custom CSS variables
    const variables = this.elements.getAppearance().variables
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        const cssVar = `--dp-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
        this.container!.style.setProperty(cssVar, value)
      })
    }

    // Create React root and render
    this.root = createRoot(this.container)
    this.root.render(
      <PaymentCard
        onChange={(e: ElementChangeEvent) => this.emit('change', e)}
        onReady={() => this.emit('ready', {})}
        options={{
          showCardholderName: this.options.fields?.billingDetails !== 'never',
        }}
        appearance={this.elements.getAppearance()}
      />
    )
  }

  /**
   * Gets the current card data from the element
   * @returns Card data or null if invalid
   */
  getCardData(): any {
    // This will be populated when we integrate with the component state
    if (!this.container) {
      return null
    }

    // Extract data from inputs
    const cardNumberInput = this.container.querySelector<HTMLInputElement>('#deonpay-card-number')
    const expiryInput = this.container.querySelector<HTMLInputElement>('#deonpay-expiry')
    const cvvInput = this.container.querySelector<HTMLInputElement>('#deonpay-cvv')
    const nameInput = this.container.querySelector<HTMLInputElement>('#deonpay-cardholder-name')

    if (!cardNumberInput || !expiryInput || !cvvInput) {
      return null
    }

    const cardNumber = cardNumberInput.value.replace(/\s/g, '')
    const expiry = expiryInput.value.split('/')
    const cvv = cvvInput.value
    const name = nameInput?.value

    return {
      number: cardNumber,
      exp_month: parseInt(expiry[0], 10),
      exp_year: parseInt(expiry[1], 10) + 2000,
      cvv,
      cardholder_name: name,
    }
  }

  /**
   * Validates and submits the element
   */
  async submit(): Promise<void> {
    // Trigger validation by focusing and blurring all fields
    if (!this.container) {
      throw new Error('Element not mounted')
    }

    const inputs = this.container.querySelectorAll<HTMLInputElement>('input')
    inputs.forEach((input) => {
      input.dispatchEvent(new Event('blur', { bubbles: true }))
    })
  }
}

export class BillingElement implements ElementInstance {
  public readonly id: string
  public readonly type = 'billing'

  private elements: Elements
  private options: any
  private container: HTMLElement | null = null
  private root: Root | null = null
  private eventHandlers: Map<string, Set<(e: any) => void>> = new Map()

  constructor(elements: Elements, options: any = {}) {
    this.id = `billing-element-${Math.random().toString(36).substr(2, 9)}`
    this.elements = elements
    this.options = options
  }

  /**
   * Mounts the element to the DOM
   * @param selector - CSS selector or HTMLElement
   */
  mount(selector: string | HTMLElement): void {
    if (this.container) {
      throw new Error('Element already mounted')
    }

    const container =
      typeof selector === 'string'
        ? document.querySelector<HTMLElement>(selector)
        : selector

    if (!container) {
      throw new Error(`Element not found: ${selector}`)
    }

    this.container = container
    this.render()
  }

  /**
   * Unmounts the element from the DOM
   */
  unmount(): void {
    if (this.root) {
      try {
        this.root.unmount()
      } catch (e) {
        // Ignore unmount errors if already unmounted
      }
      this.root = null
    }

    if (this.container) {
      this.container = null
    }
  }

  /**
   * Registers an event handler
   * @param event - Event name
   * @param handler - Event handler
   */
  on(event: string, handler: (e: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }
    this.eventHandlers.get(event)!.add(handler)
  }

  /**
   * Unregisters an event handler
   * @param event - Event name
   * @param handler - Event handler
   */
  off(event: string, handler: (e: any) => void): void {
    this.eventHandlers.get(event)?.delete(handler)
  }

  /**
   * Emits an event to registered handlers
   * @param event - Event name
   * @param data - Event data
   */
  private emit(event: string, data: any): void {
    this.eventHandlers.get(event)?.forEach((handler) => handler(data))
  }

  /**
   * Renders the component
   */
  private render(): void {
    if (!this.container) {
      return
    }

    // Apply theme to container
    this.container.classList.add('deonpay-elements')
    const theme = this.elements.getAppearance().theme
    if (theme && theme !== 'none') {
      this.container.setAttribute('data-theme', theme)
    }

    // Apply custom CSS variables
    const variables = this.elements.getAppearance().variables
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        const cssVar = `--dp-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
        this.container!.style.setProperty(cssVar, value)
      })
    }

    // Create React root and render
    this.root = createRoot(this.container)
    this.root.render(
      <BillingDetails
        onChange={(e: ElementChangeEvent) => this.emit('change', e)}
        onReady={() => this.emit('ready', {})}
        options={this.options}
        appearance={this.elements.getAppearance()}
      />
    )
  }

  /**
   * Gets the current billing data from the element
   * @returns Billing data or null if invalid
   */
  getBillingData(): any {
    if (!this.container) {
      return null
    }

    // Extract data from inputs
    const nameInput = this.container.querySelector<HTMLInputElement>('#deonpay-billing-name')
    const emailInput = this.container.querySelector<HTMLInputElement>('#deonpay-billing-email')
    const phoneInput = this.container.querySelector<HTMLInputElement>('#deonpay-billing-phone')
    const line1Input = this.container.querySelector<HTMLInputElement>('#deonpay-billing-address-line1')
    const line2Input = this.container.querySelector<HTMLInputElement>('#deonpay-billing-address-line2')
    const cityInput = this.container.querySelector<HTMLInputElement>('#deonpay-billing-city')
    const stateInput = this.container.querySelector<HTMLInputElement>('#deonpay-billing-state')
    const postalCodeInput = this.container.querySelector<HTMLInputElement>('#deonpay-billing-postal-code')
    const countrySelect = this.container.querySelector<HTMLSelectElement>('#deonpay-billing-country')

    return {
      name: nameInput?.value || undefined,
      email: emailInput?.value || undefined,
      phone: phoneInput?.value || undefined,
      address: {
        line1: line1Input?.value || undefined,
        line2: line2Input?.value || undefined,
        city: cityInput?.value || undefined,
        state: stateInput?.value || undefined,
        postal_code: postalCodeInput?.value || undefined,
        country: countrySelect?.value || undefined,
      },
    }
  }

  /**
   * Validates and submits the element
   */
  async submit(): Promise<void> {
    if (!this.container) {
      throw new Error('Element not mounted')
    }

    const inputs = this.container.querySelectorAll<HTMLInputElement>('input, select')
    inputs.forEach((input) => {
      input.dispatchEvent(new Event('blur', { bubbles: true }))
    })
  }
}
