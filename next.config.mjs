/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "minio-img.nezuko.me",
      },
      {
        protocol: "https",
        hostname: "gravatar.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["playwright", "crawlee"],
  },
  staticPageGenerationTimeout: 1000,
};

export default nextConfig;
