/** @type {import('next').NextConfig} */

const nextConfig = {
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
  },
  assetPrefix: `${process.env.NEXT_PUBLIC_HOST}/`,
}

module.exports = nextConfig
