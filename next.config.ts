import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'dfvhrzizwyqighocaaew.supabase.co', // ඔබේ Supabase Hostname එක
        port: '',
        pathname: '/storage/v1/object/public/**', // Storage එකට අදාළ path එක
      },
    ],
  },
};

export default nextConfig;