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
  env: 'development',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // 난독화 설정
          mangle: true,
          // 이름 난독화 비활성화
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
