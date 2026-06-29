/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Next 15 推荐使用 remotePatterns 替代已废弃的 domains
    remotePatterns: [
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
  // 让 three 相关大包在生产构建中被正确 tree-shake / 转译
  transpilePackages: ["three"],
};

module.exports = nextConfig;
