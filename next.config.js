/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Habilitar recursos experimentais do Next.js 15
    ppr: false, // Partial Prerendering
  },
  
  // Configurações do TypeScript
  typescript: {
    // Ignorar erros de tipo durante o build (pode ser removido depois)
    ignoreBuildErrors: false,
  },
  
  // Configurações de imagens
  images: {
    domains: ['localhost'],
  },
  
  // Configuração do webpack para resolver aliases
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './app'),
      '@/components': require('path').resolve(__dirname, './app/components'),
      '@/lib': require('path').resolve(__dirname, './app/lib'),
      '@/types': require('path').resolve(__dirname, './app/types'),
      '@/hooks': require('path').resolve(__dirname, './app/hooks'),
      '@/services': require('path').resolve(__dirname, './app/services'),
      '@/utils': require('path').resolve(__dirname, './app/utils'),
      '@/pages': require('path').resolve(__dirname, './app/pages'),
    };
    return config;
  },
  
  // Configurações do servidor
  async rewrites() {
    return [
      // Redirecionar todas as rotas de API antigas para as novas
      {
        source: '/user/:path*',
        destination: '/api/users/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 