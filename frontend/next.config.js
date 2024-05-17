/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: "",
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback, // This spreads existing fallbacks
      'tfhe_bg.wasm': require.resolve('tfhe/tfhe_bg.wasm'),
    };
    return config;
  },
};

module.exports = nextConfig;
