/**
 * Elements Tokens API Route (Playground)
 * Tokenizes card data securely
 */

import { NextResponse } from 'next/server'
import { createHash, randomBytes } from 'crypto'

// Simple in-memory token storage (in production, use Cloudflare KV or Redis)
// Using global to persist across requests in development
if (!global.tokenStore) {
  global.tokenStore = new Map()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { card, billing_details } = body

    // Validate card data
    if (!card || !card.number || !card.exp_month || !card.exp_year || !card.cvv) {
      return NextResponse.json(
        {
          error: {
            type: 'validation_error',
            message: 'Invalid card data',
          },
        },
        { status: 400 }
      )
    }

    // Detect card brand
    const cardNumber = card.number.replace(/\s/g, '')
    let brand = 'unknown'

    if (/^4/.test(cardNumber)) brand = 'visa'
    else if (/^5[1-5]/.test(cardNumber)) brand = 'mastercard'
    else if (/^3[47]/.test(cardNumber)) brand = 'amex'
    else if (/^6011|^65|^64[4-9]/.test(cardNumber)) brand = 'discover'

    // Generate secure token ID
    const tokenId = `tok_${randomBytes(16).toString('hex')}`

    // "Encrypt" card data (in production, use real AES encryption)
    // For playground, we'll just hash it to simulate security
    const encryptedCard = {
      number_hash: createHash('sha256').update(cardNumber).digest('hex'),
      last4: cardNumber.slice(-4),
      brand,
      exp_month: card.exp_month,
      exp_year: card.exp_year,
      // CVV is never stored
    }

    // Store token temporarily
    global.tokenStore.set(tokenId, {
      card: encryptedCard,
      billing_details,
      created_at: Date.now(),
      used: false,
    })

    // Return token response
    const token = {
      id: tokenId,
      card: {
        brand,
        last4: cardNumber.slice(-4),
        exp_month: card.exp_month,
        exp_year: card.exp_year,
      },
    }

    return NextResponse.json({ token }, { status: 201 })
  } catch (error: any) {
    console.error('[Tokens API] Error:', error)
    return NextResponse.json(
      {
        error: {
          type: 'api_error',
          message: error.message || 'Failed to create token',
        },
      },
      { status: 500 }
    )
  }
}
