/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ remove output: 'export'
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
