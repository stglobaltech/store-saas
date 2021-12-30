const withPlugins = require('next-compose-plugins');
const withOptimizedImages = require('next-optimized-images');

// next.js configuration
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/store/home',
        permanent: false,
      },
    ];
  },
};

module.exports = withPlugins([withOptimizedImages], nextConfig);
