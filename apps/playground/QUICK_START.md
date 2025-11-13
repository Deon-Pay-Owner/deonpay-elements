# Quick Start Guide - DeonPay Elements Playground

## Getting Started

This guide will help you quickly get up and running with the new DeonPay Elements Playground.

## Step-by-Step Tutorial

### 1. Configure API Keys

First, set up your DeonPay API keys:

1. Click on the "Configuración de API Keys" section
2. Enter your **Public Key** (starts with `pk_`)
3. Enter your **Secret Key** (starts with `sk_`)
4. Click "Guardar Keys"

**Note:** Demo keys (`pk_test_demo_key` and `sk_test_demo_key`) will show an error. Use real API keys.

### 2. Build Your Payment Form

Use the drag & drop builder to create your form:

1. **Locate Available Elements** (left panel):
   - Payment Card Element (required)
   - Billing Details Element (required for CyberSource)

2. **Drag Elements:**
   - Click and hold on an element card
   - Drag it to the drop zone on the right
   - Release to drop

3. **Manage Elements:**
   - Hover over a dropped element to see the remove button (X)
   - Click X to remove an element
   - Each element type can only be added once

### 3. Customize the Theme

#### Select a Pre-built Theme

Choose from three themes:
- **Flat:** Modern and minimalist
- **Classic:** Professional with gradients
- **Dark:** Elegant dark mode

#### Customize Colors

1. **Primary Color:**
   - Click the color picker
   - Select your brand color
   - See instant updates in the form

2. **Button Text Color:**
   - Use the button customization panel
   - Pick a contrasting color for readability

#### Adjust Typography

1. **Font Family:**
   - Choose from common system fonts
   - Or enter a custom font family

2. **Font Size:**
   - Use the slider (12px - 18px for form)
   - Separate control for button (12px - 24px)

#### Configure Borders

- **Border Radius:** Use the slider (0px - 20px)
- Affects all form elements and buttons

### 4. Customize the Payment Button

Make the button match your brand:

1. **Button Text:**
   - Default: "Pagar $100.00 MXN"
   - Enter custom text (e.g., "Complete Payment", "Pay Now")

2. **Text Color:**
   - Choose a color that contrasts with the background
   - White works well with most background colors

3. **Font Size:**
   - Adjust slider (12px - 24px)
   - Larger sizes for emphasis

4. **Preview:**
   - See live preview in the customization panel
   - Preview updates in real-time

### 5. Understand Validation

The playground automatically validates your form:

#### Warning (Yellow Banner)
```
CyberSource requiere información de facturación.
Agrega el elemento "Detalles de Facturación" para procesar pagos.
```
**Action:** Add the Billing Details element to resolve

#### Error (Red Banner)
```
Se requiere al menos el elemento de pago
```
**Action:** Add the Payment Card element

#### Pay Button States

- **Enabled:** Green checkmark, form is valid
- **Disabled:** Gray with reduced opacity, form is invalid
- **Loading:** Spinner animation, payment processing

### 6. Test Payment

Once your form is valid:

1. **Use Test Cards:**
   - **Successful:** 4242 4242 4242 4242
   - **Declined:** 4000 0000 0000 0002
   - **3DS Required:** 4000 0027 6000 3184

2. **Fill Form:**
   - Use any future expiry date
   - Any 3-digit CVV
   - Enter billing details if element is present

3. **Submit:**
   - Click the pay button
   - Watch for success or error messages
   - View response JSON in the right panel

### 7. View Generated Code

See the code to implement your configuration:

1. Click "Ver Código Generado" button
2. Review the generated code
3. Copy and paste into your application
4. Adjust client secret and API key as needed

## Common Scenarios

### Scenario 1: Minimal Setup (Mock Adapter)

Perfect for testing:

1. Add Payment Card element only
2. Use demo/test API keys
3. No billing details required
4. Quick testing with test cards

### Scenario 2: CyberSource Production

For CyberSource integration:

1. Add Payment Card element
2. Add Billing Details element (required)
3. Use CyberSource API keys
4. Form validates and enables pay button

### Scenario 3: Custom Branding

Match your brand perfectly:

1. Build form with required elements
2. Set primary color to brand color
3. Customize button text
4. Adjust font sizes for hierarchy
5. Set border radius for style consistency

## Tips & Tricks

### Tip 1: Configuration Persistence
Your form configuration is automatically saved to browser localStorage. Refresh the page and your settings remain!

### Tip 2: Mobile Testing
The playground is fully responsive. Test on mobile by resizing your browser or using device emulation.

### Tip 3: Dark Mode
The playground supports dark mode. Check your system settings to see it in action.

### Tip 4: Validation Feedback
Watch for real-time validation:
- Yellow = Warning (optional but recommended)
- Red = Error (must fix)
- Form updates as you add/remove elements

### Tip 5: Button Preview
Use the button preview in the customization panel to perfect your button before testing payment.

## Keyboard Shortcuts

- **Tab:** Navigate between controls
- **Enter:** Submit payment form
- **Esc:** Dismiss validation banners (if dismissible)

## Troubleshooting

### Problem: API Keys Error
**Solution:** Make sure you're using real API keys, not the demo keys

### Problem: Pay Button Disabled
**Solution:** Check for validation warnings/errors. Add required elements.

### Problem: CyberSource Warning
**Solution:** Add the Billing Details element to your form

### Problem: Elements Not Mounting
**Solution:** Refresh the page, clear localStorage, try again

### Problem: Drag Not Working
**Solution:** Make sure you click and hold, then drag. Check browser compatibility.

## Next Steps

After mastering the playground:

1. **Integrate into Your App:**
   - Copy the generated code
   - Replace demo values with production keys
   - Implement in your checkout flow

2. **Customize Further:**
   - Add custom styling to your app
   - Implement error handling
   - Add analytics tracking

3. **Go Live:**
   - Test thoroughly with test cards
   - Switch to production keys
   - Monitor transactions in dashboard

## Support Resources

- **Documentation:** Check PLAYGROUND_REDESIGN.md for technical details
- **API Reference:** Review DeonPay API documentation
- **Component Docs:** Explore component source code for customization

## Feedback

Found a bug or have a suggestion?
- Review the validation logic in hooks
- Check browser console for errors
- Test with different configurations

Enjoy building amazing payment experiences with DeonPay Elements!
