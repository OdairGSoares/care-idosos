'use client'

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import DashboardHeader from './DashboardHeader';
import EmergencyButton from './EmergencyButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  
  // Aguardar a hidratação completa para evitar mismatch servidor/cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Durante a hidratação, renderizar sempre o Header público para consistência
  if (!isMounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-slate-50">
          {children}
        </main>
      </div>
    );
  }

  // Após hidratação, determinar o header baseado na rota
  const isDashboardPage = pathname?.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      {isDashboardPage ? <DashboardHeader /> : <Header />}
      <main className="flex-1 bg-slate-50">
        {children}
      </main>
      {isDashboardPage && <EmergencyButton />}
    </div>
  );
};

export default Layout;
