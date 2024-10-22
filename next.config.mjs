/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        hostname: "memory.fly.storage.tigris.dev",
      },
    ],
  },
};

export default nextConfig;
