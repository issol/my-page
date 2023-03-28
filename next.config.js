/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid',
])

module.exports = withTM({
  trailingSlash: true,
  reactStrictMode: false,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
  experimental: {
    esmExternals: false,
    styledComponents: true,
    images: {
      unoptimized: true,
    },
  },
  images: {
    loader: 'akamai',
    path: ['profile-dev.gloground.com', 'localhost', '*', 'i.ytimg.com'],

    domains: ['profile-dev.gloground.com', 'localhost', '*', 'i.ytimg.com'],
    images: {
      minimumCacheTTL: 3600,
    },
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(
        __dirname,
        './node_modules/apexcharts-clevision',
      ),
    }

    return config
  },
})
