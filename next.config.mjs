/** @type {import('next').NextConfig} */

import path from 'path'

const __dirname = path.resolve()

const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_BUILD_MODE: process.env.NEXT_PUBLIC_BUILD_MODE || '',
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'sass')],
  },
}

export default nextConfig
