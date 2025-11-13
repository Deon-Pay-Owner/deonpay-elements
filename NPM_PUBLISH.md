# NPM Publication Guide

Complete guide for publishing DeonPay Elements packages to NPM.

## Prerequisites

1. NPM account with `@deonpay` scope access
2. NPM CLI logged in: `npm login`
3. All packages built: `pnpm build` ✅ DONE

## Packages Ready to Publish

### @deonpay/elements-core v0.1.0
- **Size**: 12.8 KB (78.1 KB unpacked)
- **Files**: 8 files (dist + README.md)
- **Description**: Core utilities for card validation, formatting, and brand detection

### @deonpay/elements-sdk v0.1.0
- **Size**: ~35 KB
- **Files**: dist + README.md + styles.css
- **Description**: React SDK for embeddable payment UI components
- **Dependencies**: @deonpay/elements-core@^0.1.0

## Publication Steps

### Step 1: Login to NPM

```bash
npm login
# Enter your NPM credentials
```

### Step 2: Publish Core Package (MUST BE FIRST)

```bash
cd packages/core
npm publish --access public
```

Expected output:
```
+ @deonpay/elements-core@0.1.0
```

Verify: https://www.npmjs.com/package/@deonpay/elements-core

### Step 3: Publish SDK Package (AFTER CORE)

```bash
cd ../sdk
npm publish --access public
```

Expected output:
```
+ @deonpay/elements-sdk@0.1.0
```

Verify: https://www.npmjs.com/package/@deonpay/elements-sdk

### Step 4: Verify Installation

Test that packages can be installed:

```bash
# In a test directory
npm install @deonpay/elements-core
npm install @deonpay/elements-sdk
```

## Post-Publication Checklist

- [ ] Verify package page on NPM shows README
- [ ] Check that types are accessible (`node_modules/@deonpay/*/dist/*.d.ts`)
- [ ] Test import in a fresh project
- [ ] Update documentation with NPM install instructions
- [ ] Announce release on social media/blog
- [ ] Create GitHub release with changelog

## Troubleshooting

### Issue: "You must verify your email to publish packages"
**Solution**: Go to https://www.npmjs.com/settings/profile and verify your email

### Issue: "You do not have permission to publish @deonpay/..."
**Solution**: Request access to @deonpay scope from organization owner

### Issue: "Package name too similar to existing package"
**Solution**: Names are unique, should not conflict

### Issue: "Version 0.1.0 already published"
**Solution**: Increment version in package.json and rebuild

## Version Management

For future releases:

```bash
# Patch release (0.1.0 -> 0.1.1)
cd packages/core && npm version patch
cd ../sdk && npm version patch

# Minor release (0.1.0 -> 0.2.0)
npm version minor

# Major release (0.1.0 -> 1.0.0)
npm version major

# Then rebuild and publish
pnpm build
cd packages/core && npm publish
cd ../sdk && npm publish
```

## Automation (Future)

Consider setting up:
- GitHub Actions for automated publishing on tag push
- Semantic release for automated version bumping
- Changesets for versioning and changelogs

## NPM Links

- **Core Package**: https://www.npmjs.com/package/@deonpay/elements-core
- **SDK Package**: https://www.npmjs.com/package/@deonpay/elements-sdk
- **Organization**: https://www.npmjs.com/org/deonpay

---

**Note**: Packages are currently at v0.1.0 (MVP). Plan for v1.0.0 release after production testing and user feedback.
