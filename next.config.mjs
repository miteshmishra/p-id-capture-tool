/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Exclude canvas from client-side bundling
    config.resolve.alias = {
      ...config.resolve.alias,
      'canvas': false
    };
    
    return config;
  },
  // Disable server-side rendering for components that use canvas
  reactStrictMode: true,
};

export default nextConfig;