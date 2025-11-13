#!/bin/bash
set -e

echo "Building DeonPay Elements for Vercel..."

# Install all dependencies
echo "Installing dependencies..."
pnpm install

# Build packages in order
echo "Building core package..."
pnpm --filter @deonpay/elements-core build

echo "Building SDK package..."
pnpm --filter @deonpay/elements-sdk build

echo "Building playground..."
pnpm --filter @deonpay/playground build

echo "Build complete!"
