/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

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
  mode: 'development',
  optimization: {
    minimize: true,
    minimizer: [
      // ... 다른 minimizer 설정
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true, // 클래스 이름 유지
          keep_fnames: true, // 함수 이름 유지
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
