/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    agentFeedback: true,

    instantInsights: {
      validationLevel: "manual-warning",
    },
  },

  cacheComponents: true,
  partialPrefetching: true,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;