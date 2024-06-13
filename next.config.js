/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: 'export',
  // swcMinify: true,
  productionBrowserSourceMaps: true,
  trailingSlash: true,
  experimental: {
    esmExternals: false,
  },

  // exclude: ['api', 'middleware'],

  images: {
    unoptimized: true,
    loader: 'akamai',
    path: '/',
    domains: ['profile-dev.gloground.com', 'localhost', '*', 'i.ytimg.com'],
    minimumCacheTTL: 3600,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // 모든 도메인을 허용할 때, 특정 도메인을 지정할 수도 있습니다.
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'X-Nextjs-Redirect',
            value: '*',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
