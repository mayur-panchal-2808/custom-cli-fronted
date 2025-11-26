// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;



import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Force Next.js to use *THIS* folder as the root
    root: __dirname,
  },
};

export default nextConfig;
