/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ['cdn.jsdelivr.net', 'raw.githubusercontent.com'],
  },
}

module.exports = nextConfig

