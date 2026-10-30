// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactCompiler: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//         pathname: "/**",
//       },
//     ],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  async rewrites() {
    const backend = process.env.BACKEND_API_URL;
    if (!backend) return [];
    return [{ source: "/backend/:path*", destination: `${backend}/:path*` }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
