/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Admin panelinden herhangi bir URL girilebilsin diye wildcard eklendi
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
};

module.exports = nextConfig;
