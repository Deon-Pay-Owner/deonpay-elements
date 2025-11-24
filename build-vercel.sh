#!/bin/bash
set -e

echo "Building DeonPay Elements for Vercel..."

# Build packages in order (dependencies already installed by Vercel)
echo "Building core package..."
pnpm --filter @deonpay/elements-core build

echo "Building SDK package (normal format)..."
pnpm --filter @deonpay/elements-sdk build

echo "Building SDK package (browser IIFE format)..."
pnpm --filter @deonpay/elements-sdk build:browser

echo "Creating SDK directory in playground..."
mkdir -p apps/playground/public/sdk

echo "Copying SDK files to playground..."
if [ -d "apps/elements/public/sdk" ]; then
  cp -r apps/elements/public/sdk/* apps/playground/public/sdk/
  echo "SDK files copied successfully!"
  ls -la apps/playground/public/sdk/
else
  echo "ERROR: SDK directory not found at apps/elements/public/sdk"
  exit 1
fi

echo "Building playground..."
pnpm --filter @deonpay/playground build

echo "Build complete!"
