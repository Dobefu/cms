import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    authInterrupts: true,
  },
  compiler: {
    reactRemoveProperties: true,
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['warn', 'error'],
          }
        : false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  generateBuildId: () => {
    return process.env.GIT_HASH ?? null
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
}

export default nextConfig
