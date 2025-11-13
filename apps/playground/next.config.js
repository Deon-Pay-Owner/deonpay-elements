/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@deonpay/elements-sdk', '@deonpay/elements-core'],
}

module.exports = nextConfig
