# @deonpay/elements-sdk

Embeddable payment UI components with multi-acquirer routing support.

## Installation

```bash
npm install @deonpay/elements-sdk
```

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
  <title>Checkout</title>
</head>
<body>
  <form id="payment-form">
    <div id="payment-element"></div>
    <button type="submit">Pay</button>
    <div id="error-message"></div>
  </form>

  <script type="module">
    import DeonPay from '@deonpay/elements-sdk'

    // 1. Initialize DeonPay
    const deonpay = DeonPay('pk_test_your_public_key')

    // 2. Create Elements instance
    const elements = deonpay.elements({
      clientSecret: 'pi_xxx_secret_yyy',
      appearance: {
        theme: 'flat',
        variables: {
          colorPrimary: '#0070f3'
        }
      }
    })

    // 3. Create and mount payment element
    const paymentElement = elements.create('payment')
    paymentElement.mount('#payment-element')

    // 4. Handle form submission
    document.getElementById('payment-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault()

        const {error} = await deonpay.confirmPayment({
          elements,
          confirmParams: {
            return_url: 'https://your-site.com/success'
          }
        })

        if (error) {
          document.getElementById('error-message').textContent = error.message
        }
      })
  </script>
</body>
</html>
```

## Features

- **Multi-Acquirer Support**: Automatic routing to Adyen, Stripe, CyberSource, and more
- **Secure Tokenization**: PCI-DSS compliant - card data never touches your server
- **Customizable UI**: Match your brand with themes and custom styling
- **Real-time Validation**: Instant feedback with Luhn algorithm and expiry checks
- **3D Secure Ready**: Built-in support for 3DS authentication
- **TypeScript**: Full type safety and IntelliSense

## API Reference

See [full documentation](https://docs.deonpay.mx/elements) for detailed API reference.

## License

MIT
