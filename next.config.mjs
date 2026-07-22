// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: "export",
//   distDir: "out",
//   reactCompiler: true,
//   compiler: {
//     removeConsole: process.env.NODE_ENV === "production",
//   },
//   async redirects() {
//     return [
//       {
//         source: "/dashboard",
//         destination: "/dashboard/default",
//         permanent: false,
//       },
//     ];
//   },
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-bucket-name.s3.amazonaws.com', // Or your CloudFront domain
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;