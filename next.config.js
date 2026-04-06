/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'ae01.alicdn.com' },
      { protocol: 'https', hostname: 'ae-pic-a1.aliexpress-media.com' },
      { protocol: 'https', hostname: 'img.aliexpress.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  env: {
    DOMAIN: process.env.DOMAIN,
    STORE_NAME: process.env.STORE_NAME,
  },
};

module.exports = nextConfig;
