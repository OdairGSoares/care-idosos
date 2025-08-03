'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Navegação pública */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'text-care-teal' 
                  : 'text-care-purple hover:text-care-teal'
              }`}
            >
              Início
            </Link>
            <Link 
              href="/#sobre" 
              className="text-sm font-medium text-care-purple hover:text-care-teal transition-colors"
            >
              Sobre
            </Link>
            <Link 
              href="/#servicos" 
              className="text-sm font-medium text-care-purple hover:text-care-teal transition-colors"
            >
              Serviços
            </Link>
            <Link 
              href="/#contato" 
              className="text-sm font-medium text-care-purple hover:text-care-teal transition-colors"
            >
              Contato
            </Link>
          </nav>

          {/* Botões de autenticação */}
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button 
                variant="outline" 
                className={`border-care-teal text-care-teal hover:bg-care-teal/10 ${
                  pathname === '/login' ? 'bg-care-teal/10' : ''
                }`}
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button 
                className={`bg-care-teal hover:bg-care-dark-teal ${
                  pathname === '/signup' ? 'bg-care-dark-teal' : ''
                }`}
              >
                Cadastro
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
