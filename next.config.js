/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/booker',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
