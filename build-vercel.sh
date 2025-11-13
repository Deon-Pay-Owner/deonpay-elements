#!/bin/bash
set -e

echo "Building DeonPay Elements for Vercel..."

# Build packages in order (dependencies already installed by Vercel)
echo "Building core package..."
pnpm --filter @deonpay/elements-core build

echo "Building SDK package..."
pnpm --filter @deonpay/elements-sdk build

echo "Building playground..."
pnpm --filter @deonpay/playground build

echo "Build complete!"
