/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações de imagens
  images: {
    domains: ['localhost'],
  },
  
  // Configuração do webpack para resolver aliases
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './app'),
    };
    return config;
  },
};

module.exports = nextConfig; 