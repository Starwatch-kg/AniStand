/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['s4.anilist.co', 'cdn.myanimelist.net', 'animepahe.com'],
    unoptimized: true
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*'
      }
    ]
  }
}

module.exports = nextConfig
