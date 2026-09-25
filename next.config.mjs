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
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/cap/:path*',
        destination: "http://127.0.0.1:8080/:path*", // Next.js will fetch this inside Kubernetes!
      },
    ];
  },
};

export default nextConfig;





