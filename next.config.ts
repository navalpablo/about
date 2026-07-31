import type { NextConfig } from "next";

const githubPagesBuild = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = githubPagesBuild
  ? {
      basePath: "/about",
      output: "export",
      trailingSlash: true,
      images: {
        unoptimized: true,
      },
    }
  : {};

export default nextConfig;
