'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserService } from '@/services';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para proteger rotas que requerem autenticação
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const isLoggedIn = UserService.isLoggedIn();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Você precisa fazer login para acessar esta área');
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  // Se não estiver logado, não renderiza nada (vai redirecionar)
  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 