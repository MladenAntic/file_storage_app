/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "adjoining-llama-937.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
