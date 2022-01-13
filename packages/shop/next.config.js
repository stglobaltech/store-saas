const withPlugins = require('next-compose-plugins');
const withOptimizedImages = require('next-optimized-images');

// next.js configuration
const nextConfig = {
  async redirects() {
    return [];
  },
};

module.exports = withPlugins([withOptimizedImages], nextConfig);
