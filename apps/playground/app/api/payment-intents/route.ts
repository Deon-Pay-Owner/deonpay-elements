/**
 * Payment Intents API Route (Playground)
 * Creates a mock payment intent for testing
 */

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, currency, description } = body

    // Generate mock payment intent
    const paymentIntentId = `pi_${Math.random().toString(36).substr(2, 24)}`
    const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substr(2, 24)}`

    const paymentIntent = {
      id: paymentIntentId,
      client_secret: clientSecret,
      amount,
      currency: currency || 'MXN',
      status: 'requires_payment_method',
      description: description || '',
      created: Math.floor(Date.now() / 1000),
    }

    // Store in memory for later confirmation (in production, use database)
    if (typeof global !== 'undefined') {
      if (!(global as any).paymentIntents) {
        (global as any).paymentIntents = new Map()
      }
      (global as any).paymentIntents.set(paymentIntentId, paymentIntent)
    }

    return NextResponse.json(paymentIntent, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          type: 'api_error',
          message: error.message || 'Failed to create payment intent',
        },
      },
      { status: 500 }
    )
  }
}
