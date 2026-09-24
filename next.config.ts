import type { NextConfig } from "next";
import path from "path";

const stylesDir = path.join(process.cwd(), "styles");

const pagesBasePath = process.env.PAGES_BASE_PATH;

const nextConfig: NextConfig = {
  trailingSlash: true,
  allowedDevOrigins: ["192.168.0.248", "192.168.*.*", "10.*.*.*", "172.*.*.*"],
  ...(pagesBasePath ? { basePath: pagesBasePath } : {}),
  sassOptions: {
    includePaths: [stylesDir],
    loadPaths: [stylesDir],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
