# DeonPay Playground - Testing Checklist

Use this checklist to verify all fixes are working correctly.

---

## 1. Label Contrast Testing

### Test Steps:
1. Open playground
2. Add payment element to form
3. Switch to **Flat theme**
   - [ ] Labels are dark and readable on white background
   - [ ] "Número de tarjeta" label is clearly visible
4. Switch to **Classic theme**
   - [ ] Labels are uppercase (NÚMERO DE TARJETA)
   - [ ] Labels are bold and dark on gray background
5. Switch to **Dark theme**
   - [ ] Labels are light/white on dark background
   - [ ] Labels have subtle text shadow for depth
6. Change background color to black (#000000)
   - [ ] Dark theme labels still readable
7. Change background color to white (#ffffff)
   - [ ] Flat/Classic theme labels still readable

**Expected Result**: Labels should ALWAYS be readable regardless of background color choice.

---

## 2. Font Picker Testing

### Test Steps:
1. Open playground customization panel
2. Go to **Tema** (Theme) tab
3. Scroll down to find "Tipo de Letra" dropdown
   - [ ] Font picker is visible
   - [ ] Shows current font selection
4. Click dropdown and select "**Inter**"
   - [ ] Form inputs update to Inter font
   - [ ] Change is visible immediately
5. Select "**Georgia**"
   - [ ] Form inputs change to serif font
   - [ ] Noticeable difference from Inter
6. Select "**Poppins**"
   - [ ] Form inputs change to Poppins
7. Test each font option:
   - [ ] System (Default)
   - [ ] Inter
   - [ ] Roboto
   - [ ] Poppins
   - [ ] Georgia
   - [ ] Courier New

**Expected Result**: Font changes should apply immediately to all form inputs and be visually distinct.

---

## 3. Theme Visual Distinction Testing

### Test Steps:

#### Flat Theme
1. Select **Flat** theme
   - [ ] Background is clean white
   - [ ] Inputs have subtle shadows
   - [ ] Border radius is noticeably rounded (~12px)
   - [ ] Font appears modern (Inter)
   - [ ] Primary color is indigo/blue
   - [ ] Overall feel: Modern, clean, minimal

#### Classic Theme
2. Select **Classic** theme
   - [ ] Background changes to soft gray
   - [ ] Labels become UPPERCASE
   - [ ] Borders become thicker (2px visible)
   - [ ] Border radius less rounded (~6px)
   - [ ] Font changes to serif (Georgia)
   - [ ] Primary color is purple
   - [ ] Overall feel: Professional, formal, corporate

#### Dark Theme
3. Select **Dark** theme
   - [ ] Background becomes very dark (slate)
   - [ ] Input backgrounds are dark gray
   - [ ] Border radius very rounded (~16px)
   - [ ] Font changes (Poppins)
   - [ ] Cyan/teal accents visible
   - [ ] Subtle glow effects
   - [ ] Overall feel: Premium, tech-forward, gaming

### Visual Comparison:
4. Switch rapidly between themes
   - [ ] Each switch produces DRAMATIC visual change
   - [ ] Themes are immediately distinguishable
   - [ ] Not just color changes - complete visual transformation
   - [ ] Background, typography, borders all change

**Expected Result**: Someone should be able to identify which theme is active at a glance without reading labels.

---

## 4. Border Radius Application Testing

### Test Steps:
1. Add both payment and billing elements to form
2. Adjust border radius slider to **0px**
   - [ ] All inputs become sharp corners (rectangular)
   - [ ] Payment card container has sharp corners
   - [ ] Billing inputs have sharp corners
   - [ ] Select dropdown has sharp corners
3. Adjust to **10px**
   - [ ] All elements update to medium rounding
   - [ ] Change is uniform across all elements
4. Adjust to **20px** (maximum)
   - [ ] All elements become very rounded
   - [ ] Pills/capsule appearance
   - [ ] Consistent across payment and billing
5. Test with each theme:
   - [ ] Flat theme: border radius applies
   - [ ] Classic theme: border radius applies
   - [ ] Dark theme: border radius applies

**Expected Result**: Border radius should apply uniformly to ALL inputs, containers, and select dropdowns regardless of theme.

---

## 5. Code Snippet Testing

### Test Steps:
1. Scroll to bottom of customization sidebar
2. Find "Ver Código de Integración" section
   - [ ] Collapsible button is visible
   - [ ] Icon shows code symbol
3. Click to expand
   - [ ] Code snippet appears
   - [ ] Shows TypeScript/JavaScript syntax
   - [ ] Code reflects current configuration:
     - [ ] Current public key
     - [ ] Current theme name
     - [ ] Current primary color
     - [ ] Current border radius
     - [ ] Current font size
     - [ ] Current font family
4. Change a setting (e.g., color to #ff0000)
   - [ ] Code snippet updates to show new color
5. Click "Copiar" button
   - [ ] Button text changes to "Copiado"
   - [ ] Checkmark icon appears
   - [ ] Returns to "Copiar" after 2 seconds
6. Paste code somewhere
   - [ ] Code is valid JavaScript/TypeScript
   - [ ] Code is properly formatted
   - [ ] Indentation is correct
7. Click to collapse
   - [ ] Code snippet hides
   - [ ] Button remains visible

**Expected Result**: Code snippet should be accurate, copyable, and reflect real-time configuration changes.

---

## 6. Billing Fields Overlap Testing

### Test Steps:

#### Desktop Testing (> 400px width)
1. Add billing element to form
2. Resize browser to 1920px width
   - [ ] No field overlap
   - [ ] Proper spacing between fields
3. Resize to 1024px (tablet)
   - [ ] No overlap
   - [ ] Fields still side-by-side
4. Resize to 768px
   - [ ] No overlap
   - [ ] May wrap to next row, but no overlap
5. Resize to 480px
   - [ ] No overlap
   - [ ] City and State may stack

#### Mobile Testing (< 400px width)
6. Resize to 375px (mobile)
   - [ ] Fields stack vertically
   - [ ] No horizontal overlap
   - [ ] All fields full-width
7. Resize to 320px (small mobile)
   - [ ] Still stacked
   - [ ] No overlap
   - [ ] Inputs not cut off

#### Field Layout Order
8. Check field order is logical:
   - [ ] 1. Postal Code (with auto-fill icon)
   - [ ] 2. City and State (in one row)
   - [ ] 3. Country (full-width)
   - [ ] 4. Street Address Line 1
   - [ ] 5. Street Address Line 2 (optional)

#### Flex Behavior
9. Enter long text in City field
   - [ ] Doesn't push State field off screen
   - [ ] Text wraps or scrolls within input
10. Have only City showing (State hidden)
    - [ ] City takes full width
    - [ ] No empty space gaps

**Expected Result**: Zero overlap at any viewport size. Fields should wrap or stack gracefully.

---

## 7. Postal Code Geocoding Testing

### Test Steps:

#### Valid Postal Codes
1. Enter postal code: **64000**
   - [ ] Loading spinner appears briefly
   - [ ] Green checkmark appears after ~300ms
   - [ ] City auto-fills to "Monterrey"
   - [ ] State auto-fills to "Nuevo León"
   - [ ] Country auto-fills to "MX"
   - [ ] Success message: "Dirección encontrada automáticamente"
   - [ ] City and State fields become readonly (grayed out)
   - [ ] Country dropdown becomes disabled

2. Clear postal code and enter: **44100**
   - [ ] Spinner → Checkmark sequence
   - [ ] City becomes "Guadalajara"
   - [ ] State becomes "Jalisco"

3. Test all provided postal codes:
   - [ ] 01000 → Ciudad de México, CDMX
   - [ ] 03100 → Ciudad de México, CDMX
   - [ ] 06600 → Ciudad de México, CDMX
   - [ ] 20000 → Aguascalientes, Aguascalientes
   - [ ] 76000 → Querétaro, Querétaro
   - [ ] 78000 → San Luis Potosí, San Luis Potosí
   - [ ] 80000 → Culiacán, Sinaloa
   - [ ] 97000 → Mérida, Yucatán

#### Invalid Postal Codes
4. Enter postal code: **99999** (not in database)
   - [ ] Spinner appears
   - [ ] No checkmark appears
   - [ ] Fields remain empty and editable
   - [ ] No error message (graceful degradation)

5. Enter: **123** (too short)
   - [ ] No spinner
   - [ ] No lookup triggered
   - [ ] Fields remain editable

6. Enter: **abcde** (non-numeric)
   - [ ] No spinner
   - [ ] No lookup
   - [ ] Validation may prevent letters

#### Readonly Behavior
7. After successful auto-fill:
   - [ ] Try to type in City field → Cannot edit
   - [ ] Try to type in State field → Cannot edit
   - [ ] Try to change Country dropdown → Cannot select
   - [ ] Readonly fields have different styling (lighter background)

8. Change postal code to something else
   - [ ] Checkmark disappears
   - [ ] If new postal code is valid, fields update
   - [ ] If invalid, fields become editable again

#### Visual Feedback
9. Check icon positioning:
   - [ ] Loading spinner appears inside postal code input (right side)
   - [ ] Checkmark replaces spinner in same position
   - [ ] Icons don't cause input to jump or resize

**Expected Result**:
- Valid postal codes auto-fill city/state/country instantly
- Visual feedback (spinner → checkmark)
- Auto-filled fields are protected from accidental edits
- Invalid codes degrade gracefully without errors

---

## 8. Responsive Design Testing

### Test Steps:
1. Test at breakpoint: **400px**
   - [ ] Fields stack vertically below this width
   - [ ] Flex direction changes to column

2. Test smooth transitions when resizing:
   - [ ] Drag browser from 1200px to 300px
   - [ ] Fields transition smoothly
   - [ ] No janky layout shifts

3. Test on actual devices (if possible):
   - [ ] iPhone SE (375px)
   - [ ] iPhone 12 (390px)
   - [ ] iPad (768px)
   - [ ] Desktop (1920px)

**Expected Result**: Form should be fully functional and visually correct at any screen size.

---

## 9. Integration Testing

### Test Steps:
1. Add both Payment and Billing elements
2. Customize all settings:
   - Theme: Dark
   - Color: #ff6b6b
   - Border Radius: 18px
   - Font: Poppins
   - Font Size: 16px
   - Background: #1a1a1a
3. Verify all changes apply to BOTH elements:
   - [ ] Payment card respects settings
   - [ ] Billing form respects settings
   - [ ] Code snippet reflects all settings
4. Enter Mexican postal code
   - [ ] Auto-fill works in billing element
5. Switch themes
   - [ ] Both elements update together
   - [ ] Postal code auto-fill still works

**Expected Result**: All features should work together harmoniously without conflicts.

---

## 10. Browser Compatibility Testing

Test in multiple browsers:

### Chrome
- [ ] All features work
- [ ] Code snippet copy works
- [ ] Flex layout correct
- [ ] Themes render properly

### Firefox
- [ ] All features work
- [ ] Select dropdowns styled correctly
- [ ] Border radius applies

### Safari (if Mac available)
- [ ] All features work
- [ ] Font families load
- [ ] CSS variables work

### Edge
- [ ] All features work
- [ ] Same behavior as Chrome

**Expected Result**: Consistent behavior across all modern browsers.

---

## Quick Smoke Test (5 minutes)

If short on time, run this abbreviated test:

1. [ ] Switch between all 3 themes - visually distinct?
2. [ ] Change border radius slider - all elements update?
3. [ ] Open code snippet - reflects current config?
4. [ ] Enter postal code 64000 - auto-fills city/state?
5. [ ] Resize browser to 350px - no overlap?
6. [ ] Change font - inputs update?
7. [ ] Labels readable on all themes?

If all 7 checks pass, core functionality is working.

---

## Regression Testing

Ensure existing features still work:

1. [ ] Payment intent creation still works
2. [ ] Card validation works
3. [ ] CVV field works
4. [ ] Expiry date validation
5. [ ] Email validation in billing
6. [ ] Form submission works
7. [ ] Error messages display
8. [ ] Payment success flow
9. [ ] Drag and drop elements
10. [ ] Remove elements

**Expected Result**: No existing features should be broken by the new changes.

---

## Performance Testing

1. [ ] Theme switching is instant (< 100ms)
2. [ ] Postal code lookup is fast (< 500ms)
3. [ ] Code snippet render is instant
4. [ ] No janky animations
5. [ ] Font loading doesn't cause FOUT (flash of unstyled text)
6. [ ] Page load time acceptable

---

## Accessibility Testing

1. [ ] All labels have proper contrast (use browser DevTools)
2. [ ] Tab navigation works through all fields
3. [ ] Focus indicators visible on all themes
4. [ ] Screen reader can read all labels
5. [ ] Keyboard navigation works
6. [ ] Error messages announced

---

## Sign-Off

Once all tests pass:

- [ ] Desktop testing complete
- [ ] Mobile testing complete
- [ ] Browser testing complete
- [ ] Visual regression complete
- [ ] Accessibility verified
- [ ] Performance acceptable

**Tester Name**: ________________
**Date**: ________________
**Build Version**: ________________

---

## Known Issues / Notes

Document any issues found:

1.
2.
3.

---

## Conclusion

If all checklist items are marked complete with no critical issues, the playground is ready for production use.
