/**
 * Confirm Payment Intent API Route (Playground)
 * Confirms a payment intent with a card token
 */

import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paymentIntentId } = await params
    const body = await request.json()
    const { payment_method, return_url } = body

    // Get payment intent from memory
    const paymentIntents = (global as any).paymentIntents
    if (!paymentIntents || !paymentIntents.has(paymentIntentId)) {
      return NextResponse.json(
        {
          error: {
            type: 'invalid_request_error',
            message: 'Payment intent not found',
          },
        },
        { status: 404 }
      )
    }

    const paymentIntent = paymentIntents.get(paymentIntentId)

    // Validate payment method (token)
    if (!payment_method || !payment_method.startsWith('tok_')) {
      return NextResponse.json(
        {
          error: {
            type: 'validation_error',
            message: 'Invalid payment method token',
          },
        },
        { status: 400 }
      )
    }

    // Simulate payment processing
    // In production, this would call the router to process with multi-acquirer

    // Mock success/failure based on token pattern (for testing)
    const isSuccess = !payment_method.includes('fail')
    const requires3DS = payment_method.includes('3ds')

    if (requires3DS) {
      // Simulate 3DS challenge
      paymentIntent.status = 'requires_action'
      paymentIntent.next_action = {
        type: 'redirect_to_url',
        redirect_to_url: {
          url: `https://3ds.example.com/challenge?pi=${paymentIntentId}`,
          return_url: return_url || window.location.origin,
        },
      }
    } else if (isSuccess) {
      // Simulate successful payment
      paymentIntent.status = 'succeeded'
      paymentIntent.payment_method = payment_method
      paymentIntent.charges = [
        {
          id: `ch_${Math.random().toString(36).substr(2, 24)}`,
          amount: paymentIntent.amount,
          status: 'succeeded',
          created: Math.floor(Date.now() / 1000),
        },
      ]
    } else {
      // Simulate failed payment
      paymentIntent.status = 'failed'
      paymentIntent.last_payment_error = {
        type: 'card_error',
        code: 'card_declined',
        message: 'Your card was declined',
      }
    }

    // Update in memory
    paymentIntents.set(paymentIntentId, paymentIntent)

    // Return error if failed
    if (!isSuccess && !requires3DS) {
      return NextResponse.json(
        {
          error: {
            type: 'card_error',
            message: 'Your card was declined',
            code: 'card_declined',
          },
        },
        { status: 402 }
      )
    }

    return NextResponse.json(paymentIntent)
  } catch (error: any) {
    console.error('[Confirm Payment] Error:', error)
    return NextResponse.json(
      {
        error: {
          type: 'api_error',
          message: error.message || 'Failed to confirm payment',
        },
      },
      { status: 500 }
    )
  }
}
