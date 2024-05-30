/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  // swcMinify: true,
  productionBrowserSourceMaps: true,
  trailingSlash: true,
  experimental: {
    esmExternals: false,
  },

  images: {
    unoptimized: true,
    loader: 'akamai',
    path: '/',
    domains: ['profile-dev.gloground.com', 'localhost', '*', 'i.ytimg.com'],
    minimumCacheTTL: 3600,
  },
}

module.exports = nextConfig
