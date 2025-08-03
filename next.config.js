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
      '@': './app',
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