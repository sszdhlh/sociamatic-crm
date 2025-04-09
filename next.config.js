/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['static.sociamatic.com', 'sociamatic-api.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    SOCIAMATIC_CLIENT_ID: process.env.SOCIAMATIC_CLIENT_ID,
    SOCIAMATIC_CLIENT_SECRET: process.env.SOCIAMATIC_CLIENT_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  webpack: (config, { isServer }) => {
    // Resolve fs module issue in pg-connection-string
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false
      };
    }
    return config;
  },
}

module.exports = nextConfig