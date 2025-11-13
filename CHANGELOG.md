# Changelog

All notable changes to DeonPay Elements will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-12

### Added

#### Core Package (@deonpay/elements-core)
- **Card Validation**: Luhn algorithm implementation for card number validation
- **Brand Detection**: Automatic detection for 8 card brands (Visa, Mastercard, Amex, Discover, Diners, JCB, UnionPay, Maestro)
- **Expiry Validation**: MM/YY format validation with date validation
- **CVV Validation**: 3-4 digit validation based on card brand
- **Auto-formatting**: Real-time formatting for card numbers and expiry dates
- **TypeScript Support**: Full type definitions for all utilities

#### SDK Package (@deonpay/elements-sdk)
- **DeonPay Class**: Main SDK entry point with public key validation
- **Elements Manager**: Create and manage payment form instances
- **PaymentCard Component**: Full-featured React card input with validation
- **Tokenization API**: Secure token creation via `/api/v1/elements/tokens`
- **Payment Confirmation**: `confirmPayment()` method with 3DS support
- **Theme System**: Three built-in themes (flat, stripe, dark)
- **Custom Styling**: CSS variables for complete UI customization
- **Event System**: onChange, onReady, and error events
- **Localization**: Spanish and English support

#### Playground App
- **Interactive Demo**: Live SDK testing environment
- **Theme Switcher**: Real-time theme switching
- **Mock API Routes**: Local payment intent and token endpoints
- **Complete Example**: Full integration code examples
- **Test Cards**: Reference for testing different scenarios

#### Backend Integration
- **Tokenization Endpoint**: POST /api/v1/elements/tokens
- **AES-256-GCM Encryption**: Secure token data encryption
- **Token Consumption**: Single-use token enforcement
- **15-Minute Expiration**: Automatic token cleanup
- **Payment Intent Support**: Accept tokens in confirm endpoint
- **Backward Compatibility**: Support both tokens and raw card data

#### Documentation
- **Comprehensive README**: Full project documentation
- **Integration Guide**: Step-by-step integration instructions
- **API Reference**: Complete SDK API documentation
- **Environment Templates**: .env.example with all variables
- **Security Best Practices**: Guidelines for secure implementation

#### Development Tools
- **Monorepo Structure**: pnpm workspaces with Turborepo
- **TypeScript**: Full type safety across all packages
- **Build System**: Optimized builds with Vite and tsup
- **Git Integration**: Proper .gitignore and version control

### Technical Details

#### Package Sizes
- @deonpay/elements-core: 5.89 KB (CJS), 5.08 KB (ESM)
- @deonpay/elements-sdk: 18.76 KB (CJS), 27.78 KB (ESM), 3.08 KB (CSS)
- All packages include TypeScript declarations

#### Security Features
- PCI-DSS compliant tokenization
- No PAN storage in databases
- Single-use tokens with expiration
- AES-256-GCM encryption at rest
- Secure card brand detection without full PAN exposure

#### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Chrome Android 90+

### Known Issues
- None at this time

### Breaking Changes
- None (initial release)

---

## [Unreleased]

### Planned Features
- Express Checkout Element (Google Pay, Apple Pay)
- Bank Transfer Element
- OXXO Payment Element
- Address Element for billing/shipping
- Link Authentication
- Payment Method Save & Reuse
- Subscription Support
- Installment Plans
- Multi-currency Display
- Receipt Generation
- Fraud Detection Integration
- Analytics Dashboard
- NPM Package Publishing
- CDN Distribution

---

## Version Format

Version numbers follow [Semantic Versioning](https://semver.org/):
- MAJOR.MINOR.PATCH (e.g., 1.2.3)
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

## Release Process

1. Update version in package.json files
2. Update CHANGELOG.md with changes
3. Commit changes: `git commit -m "chore: release v1.0.0"`
4. Create git tag: `git tag v1.0.0`
5. Push changes: `git push origin main --tags`
6. Publish to npm: `pnpm publish`
7. Create GitHub release with changelog

---

For more information, visit [docs.deonpay.mx](https://docs.deonpay.mx/elements)
