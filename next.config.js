/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: true,
  trailingSlash: true,
  experimental: {
    esmExternals: false,
  },
  images: {
    loader: 'akamai',
    path: '/',
    domains: ['profile-dev.gloground.com', 'localhost', '*', 'i.ytimg.com'],
    minimumCacheTTL: 3600,
  }
}

module.exports = nextConfig
