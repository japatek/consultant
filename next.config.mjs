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

/** @type {import('next').Next.js Config} */
const nextConfig = {
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
};

export default nextConfig;