/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  
  // ---> ADD THIS EXPERIMENTAL BLOCK TO FIX CSRF <---
  experimental: {
    serverActions: {
      allowedOrigins: [
        "japatek.space",
        "47.129.183.178:30080", // AWS deployment master worker and port
        "localhost:3000"        // internal cap connection
      ],
    },
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'japa-media-062995001999-ap-southeast-1-an.s3.ap-southeast-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/cap/:path*',
        destination: 'http://cap-service:8080/:path*', // Next.js will fetch this inside Kubernetes!
      },
    ];
  },
};

export default nextConfig;





