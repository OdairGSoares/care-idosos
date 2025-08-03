'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bell, User, LogOut, Menu, X, Home, Pill, Calendar, Phone } from 'lucide-react';
import Logo from './Logo';
import { toast } from 'sonner';
import axios from 'axios';

type Usuario = {
  token: string | null;
  info: {
    firstName: string;
  };
} | null;

const DashboardHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [usuario, setUsuario] = useState<Usuario>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      if (!authToken || !userId) {
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        const userInfo = await axios.get(`/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        setUsuario({
          token: authToken,
          info: {
            firstName: userInfo.data.userFirstName,
          }
        });
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        // Se o token é inválido ou usuário não existe, limpar dados e redirecionar
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        toast.error('Sessão expirada. Por favor, faça login novamente.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      // Limpar dados de autenticação
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      setUsuario(null);
      
      // Mostrar feedback de sucesso
      toast.success("Logout realizado com sucesso!");
      
      // Aguardar um momento para o toast aparecer e então redirecionar
      setTimeout(() => {
        router.push('/');
        // Força o reload da página para garantir limpeza completa do estado
        window.location.href = '/';
      });
      
    } catch (error) {
      console.error('Erro durante logout:', error);
      // Mesmo com erro, redirecionar para homepage
      router.push('/');
      window.location.href = '/';
    }
  };

  const navigationItems = [
    {
      href: '/dashboard',
      label: 'Início',
      icon: Home,
      isActive: pathname === '/dashboard'
    },
    {
      href: '/dashboard/medications',
      label: 'Medicamentos',
      icon: Pill,
      isActive: pathname === '/dashboard/medications'
    },
    {
      href: '/dashboard/appointments',
      label: 'Consultas',
      icon: Calendar,
      isActive: pathname === '/dashboard/appointments'
    },
    {
      href: '/dashboard/emergency-contacts',
      label: 'Contatos',
      icon: Phone,
      isActive: pathname === '/dashboard/emergency-contacts'
    }
  ];

  // Loading state
  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center">
                <Logo />
              </Link>
              <div className="hidden sm:block">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Se não tem usuário depois do loading, não renderiza nada (redirecionamento já foi feito)
  if (!usuario?.token) {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e saudação */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center">
              <Logo />
            </Link>
            <div className="hidden sm:block">
              <span className="text-sm text-care-purple">
                Olá, <span className="font-medium text-care-purple">{usuario.info.firstName}</span>
              </span>
            </div>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.isActive
                      ? 'bg-care-teal/10 text-care-teal'
                      : 'text-care-purple hover:text-care-teal hover:bg-care-teal/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Ações do usuário */}
          <div className="flex items-center gap-2">
            {/* Notificações */}
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="icon" aria-label="Notificações" className="rounded-full bg-care-purple hover:bg-care-light-purple">
                <Bell className="h-5 w-5 text-white" />
              </Button>
            </Link>

            {/* Perfil */}
            <Link href="/dashboard/profile">
              <Button variant="ghost" size="icon" className="rounded-full bg-care-purple hover:bg-care-light-purple" aria-label="Perfil">
                <User className="h-5 w-5 text-white" />
              </Button>
            </Link>

            {/* Logout - Desktop */}
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              className="hidden sm:flex text-care-purple hover:text-care-light-purple hover:bg-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>

            {/* Menu Mobile */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 pb-4">
            <div className="pt-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                      item.isActive
                        ? 'bg-care-teal/10 text-care-teal'
                        : 'text-care-purple hover:text-care-teal hover:bg-care-teal/5'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <hr className="my-2" />
              <Button 
                variant="ghost" 
                onClick={handleLogout} 
                className="w-full justify-start text-care-purple hover:text-care-teal hover:bg-care-teal/5"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sair
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader; 