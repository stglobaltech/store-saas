const withPlugins = require('next-compose-plugins');
const withOptimizedImages = require('next-optimized-images');

// next.js configuration
const nextConfig = {};

module.exports = withPlugins([withOptimizedImages], nextConfig);
