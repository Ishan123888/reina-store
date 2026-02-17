import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 100 quality එක පාවිච්චි කරන නිසා ඇතිවන warning එක නැති කිරීමට මෙය එක් කළා
    qualities: [25, 50, 75, 100], 
    
    // විවිධ screen sizes වලට ගැලපෙන ලෙස image optimization සකස් කිරීම
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
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
        hostname: 'dfvhrzizwyqighocaaew.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
  },
};

export default nextConfig;