# DeonPay Elements - Deployment Guide

## ✅ Successfully Deployed

**Production URL**: https://deonpay-elements-c1gg2naxz-hector-temichs-projects.vercel.app

**Status**: ● Ready

## Deployment Configuration

### Vercel Setup

The project is configured for Vercel deployment with the following settings:

- **Framework**: Next.js 15.0.3
- **Build Command**: `bash build-vercel.sh`
- **Output Directory**: `apps/playground/.next`
- **Region**: Washington D.C. (iad1)
- **Package Manager**: pnpm 8.x

### Build Process

The deployment uses a custom build script (`build-vercel.sh`) that:

1. Builds `@deonpay/elements-core` package (5.89 KB)
2. Builds `@deonpay/elements-sdk` package (18.76 KB)
3. Builds `@deonpay/playground` Next.js app

Total build time: ~45 seconds

### Build Output

```
Route (app)                              Size     First Load JS
┌ ○ /                                    2.31 kB         102 kB
├ ○ /_not-found                          898 B           101 kB
├ ƒ /api/elements/tokens                 141 B           100 kB
├ ƒ /api/payment-intents                 141 B           100 kB
└ ƒ /api/payment-intents/[id]/confirm    141 B           100 kB
```

## Environment Variables

The following environment variables are configured in Vercel:

- `NEXT_PUBLIC_DEONPAY_API_URL`: https://api.deonpay.mx

## Monitoring

### Inspect Deployment

```bash
vercel inspect deonpay-elements-c1gg2naxz-hector-temichs-projects.vercel.app --logs
```

### View Logs

```bash
vercel logs deonpay-elements-c1gg2naxz-hector-temichs-projects.vercel.app
```

## Redeployment

To redeploy the latest changes:

```bash
# Commit your changes
git add .
git commit -m "Your commit message"
git push

# Deploy to Vercel
vercel --prod
```

## Custom Domain (Future)

To configure a custom domain:

1. Go to Vercel Dashboard
2. Navigate to project settings
3. Add domain: `elements.deonpay.mx` or `playground.deonpay.mx`
4. Configure DNS records as instructed

## Troubleshooting

### Common Issues

**Issue**: Build fails with "tsup: command not found"
**Solution**: Ensure `pnpm install` runs before build script

**Issue**: "No Next.js version detected"
**Solution**: Ensure Next.js is in root package.json dependencies

**Issue**: Workspace dependencies not resolving
**Solution**: Verify pnpm-lock.yaml is up to date and committed

## Build Cache

Build cache is enabled and stored in Vercel:
- Cache size: 183.20 MB
- Upload time: ~2.2 seconds

This significantly speeds up subsequent deployments.

## Performance

- **Build Machine**: 4 cores, 8 GB RAM
- **Build Time**: ~45 seconds
- **First Load JS**: 100-102 KB
- **Static Pages**: 6 pages prerendered

## Next Steps

1. ✅ Configure custom domain
2. ✅ Set up production environment variables
3. ✅ Enable preview deployments for PRs
4. ✅ Configure branch protection rules
5. ✅ Set up monitoring and alerts

---

**Deployed**: 2025-01-13T03:25:14Z
**Version**: v0.1.0
