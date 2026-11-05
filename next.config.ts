import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ['mysql2', 'bcryptjs', 'sharp'],
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  webpack: (config, { dev }) => {
    config.resolve.alias['@'] = path.join(process.cwd(), 'src');
    if (dev) {
      config.cache = Object.freeze({
        type: 'memory',
      });
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.transparenttextures.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'www.instagram.com',
      }
    ],
  },
  allowedDevOrigins: ['192.168.1.11'],
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.babulalpremkumar.com',
          },
        ],
        destination: 'https://babulalpremkumar.com/:path*',
        statusCode: 301,
      },
      {
        source: '/textiles',
        destination: '/',
        permanent: true,
      },
      {
        source: '/textiles/category/:slug*',
        destination: '/:slug*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
