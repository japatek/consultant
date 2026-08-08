/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  
  // ---> ADD THIS EXPERIMENTAL BLOCK TO FIX CSRF <---
  experimental: {
    serverActions: {
      allowedOrigins: [
        "japatek.space",
        "47.129.183.178:30080", // Your AWS deployment
        "localhost:3000"        // Your local PC
      ],
    },
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Note: I left your hostname exactly as you had it, but see the tip below!
        hostname: 'japa-media-062995001999-ap-southeast-1-an.s3.ap-southeast-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;





