'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster as Sonner } from '@/components/ui/sonner'

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: (failureCount, error: any) => {
        // Não fazer retry em erros 401 (não autorizado)
        if (error?.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
      // Evitar múltiplas chamadas simultâneas
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Não fazer retry em erros 401 ou 400 (bad request)
        if (error?.status === 401 || error?.status === 400) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner 
          position="top-right" 
          richColors 
          theme="light"
          closeButton
          preventDuplicates
          toastOptions={{
            // Evitar duplicação de toasts
            id: (toast) => toast.id,
          }}
        />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  )
} 