# DeonPay Elements - Testing Guide

Comprehensive testing guide for production deployment.

## Production Deployment

**URL**: https://deonpay-elements-c1gg2naxz-hector-temichs-projects.vercel.app
**Status**: ✅ Live and Ready
**Build Time**: ~45 seconds
**Framework**: Next.js 15.0.3

## Test Cards

### Success Scenarios

| Card Number | Brand | CVV | Expiry | Result |
|-------------|-------|-----|--------|--------|
| 4242 4242 4242 4242 | Visa | 123 | Any future | ✅ Success |
| 5555 5555 5555 4444 | Mastercard | 123 | Any future | ✅ Success |
| 3782 822463 10005 | Amex | 1234 | Any future | ✅ Success |
| 6011 1111 1111 1117 | Discover | 123 | Any future | ✅ Success |

### Failure Scenarios

| Card Number | Result |
|-------------|--------|
| 4000 0000 0000 0002 | ❌ Card Declined |
| 4000 0000 0000 0127 | ❌ Incorrect CVC |
| 4000 0000 0000 0069 | ❌ Expired Card |

### 3D Secure Testing

| Card Number | Result |
|-------------|--------|
| 4000 0025 0000 3155 | 🔐 Requires 3DS Authentication |
| 4000 0027 6000 3184 | 🔐 3DS with Challenge |

## Testing Checklist

### 1. UI/UX Testing

#### Theme Testing
- [ ] Load playground in **flat** theme
- [ ] Switch to **stripe** theme
- [ ] Switch to **dark** theme
- [ ] Verify CSS transitions work smoothly
- [ ] Check mobile responsiveness

#### Validation Testing
- [ ] Enter invalid card number → See error
- [ ] Enter expired date → See error
- [ ] Enter incomplete CVV → See error
- [ ] Clear cardholder name → See error
- [ ] Complete valid form → No errors, button enabled

#### Auto-formatting
- [ ] Type card number → Auto-spaces every 4 digits
- [ ] Type Amex card → Different spacing (4-6-5)
- [ ] Type expiry → Auto-adds slash (MM/YY)
- [ ] Type CVV → Limited to 3/4 digits based on card

#### Brand Detection
- [ ] Type 4xxx → Shows Visa icon
- [ ] Type 5xxx → Shows Mastercard icon
- [ ] Type 37xx → Shows Amex icon
- [ ] Type 6xxx → Shows Discover icon

### 2. Functional Testing

#### Payment Flow
- [ ] Click "Create Payment Intent" → Intent created
- [ ] Fill card form with 4242... → Form validates
- [ ] Click "Pay" → Shows processing state
- [ ] Verify success message displayed
- [ ] Check payment intent status = "succeeded"

#### Error Handling
- [ ] Use declined card (0002) → Error message shown
- [ ] Network error → Graceful error handling
- [ ] Invalid client secret → Error displayed

#### 3DS Flow
- [ ] Use 3DS card (3155) → Redirects to authentication
- [ ] Click "Authorize" → Returns to app
- [ ] Verify payment status = "succeeded"

### 3. API Integration Testing

#### Tokenization
- [ ] Submit payment → Token created (tok_xxx)
- [ ] Verify token contains: brand, last4, exp_month, exp_year
- [ ] Verify token does NOT contain: full card number, CVV

#### Payment Intent Confirmation
- [ ] Token sent to /api/v1/payment_intents/{id}/confirm
- [ ] Payment processed through multi-acquirer router
- [ ] Response includes updated payment intent

#### Webhook Handling (if configured)
- [ ] Successful payment → webhook fired
- [ ] Failed payment → webhook fired
- [ ] 3DS required → webhook fired

### 4. Performance Testing

#### Load Time
- [ ] Initial page load < 3 seconds
- [ ] First Load JS = 100-102 KB
- [ ] Images optimized and lazy-loaded
- [ ] CSS loaded and applied immediately

#### Build Metrics
- [ ] Static pages: 6 pages prerendered
- [ ] Serverless functions: 3 API routes
- [ ] Build cache: 183 MB enabled

### 5. Security Testing

#### PCI Compliance
- [ ] Card data never visible in Network tab
- [ ] Card data never stored in localStorage
- [ ] Card data never logged in console
- [ ] Only tokens transmitted to server

#### HTTPS
- [ ] All requests over HTTPS
- [ ] No mixed content warnings
- [ ] Valid SSL certificate

#### CSP Headers (if configured)
- [ ] Content-Security-Policy headers present
- [ ] No inline scripts without nonce
- [ ] External resources whitelisted

### 6. Browser Compatibility

Test in the following browsers:

#### Desktop
- [ ] Chrome 90+ (Windows)
- [ ] Chrome 90+ (macOS)
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

#### Mobile
- [ ] iOS Safari 14+
- [ ] Chrome Android 90+
- [ ] Samsung Internet

### 7. Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Tab order logical
- [ ] Labels associated with inputs
- [ ] Error messages announced by screen readers
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA

### 8. Edge Cases

#### Empty States
- [ ] No payment intent → Error message
- [ ] Invalid client secret → Error message

#### Network Issues
- [ ] Slow 3G simulation → Loading states work
- [ ] Offline → Graceful degradation
- [ ] Timeout → Error with retry option

#### Input Edge Cases
- [ ] Paste card number with spaces → Formatted correctly
- [ ] Copy/paste full card → Validated
- [ ] Tab through form → Focus order correct

## Automated Testing (Future)

### Unit Tests
```bash
cd packages/core && pnpm test
cd ../sdk && pnpm test
```

### E2E Tests (Playwright/Cypress)
```typescript
test('complete payment flow', async ({ page }) => {
  await page.goto('https://deonpay-elements-...')
  await page.fill('[name="cardNumber"]', '4242424242424242')
  await page.fill('[name="expiry"]', '12/25')
  await page.fill('[name="cvv"]', '123')
  await page.click('button[type="submit"]')
  await expect(page.locator('.success-message')).toBeVisible()
})
```

### Performance Tests
- Lighthouse CI score > 90
- Core Web Vitals passing
- Time to Interactive < 3s

## Reporting Issues

If you find any issues during testing:

1. **Document**: Screenshot + steps to reproduce
2. **Create Issue**: https://github.com/Deon-Pay-Owner/deonpay-elements/issues
3. **Label**: bug, production, high-priority
4. **Assign**: Development team

## Testing Metrics

### Success Criteria
- ✅ All test cards work as expected
- ✅ Theme switching works
- ✅ Validation displays correctly
- ✅ Auto-formatting works
- ✅ Brand detection accurate
- ✅ 3DS flow completes
- ✅ Tokenization secure
- ✅ Performance metrics met
- ✅ Cross-browser compatible

### Sign-off

Testing completed by: ________________
Date: ________________
Status: ☐ Passed ☐ Failed ☐ Needs Fixes

---

**Next Steps After Testing**:
1. Fix any critical bugs found
2. Update documentation with findings
3. Plan v0.2.0 improvements
4. Prepare for v1.0.0 release
