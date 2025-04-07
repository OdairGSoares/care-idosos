
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Mail, Lock, User, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white py-4 px-6 md:px-16 border-b">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Logo />
            <span className="ml-3 text-xl font-bold">Care Idosos</span>
          </Link>
          
          <Link to="/">
            <Button variant="ghost" className="flex items-center text-senior">
              <Home className="mr-2 h-5 w-5" />
              Voltar para Home
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Login Form */}
      <div className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-care-teal/20">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold text-care-purple">Bem-vindo de volta!</CardTitle>
              <CardDescription className="text-senior">
                Faça login para acessar sua conta
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-senior">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Mail className="h-5 w-5" />
                  </span>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    className="pl-10 text-senior h-12"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-senior">
                    Senha
                  </label>
                  <Link to="/forgot-password" className="text-sm text-care-teal hover:text-care-dark-teal text-senior">
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 text-senior h-12" 
                  />
                </div>
              </div>
              
              <Button className="w-full h-12 text-senior bg-care-teal hover:bg-care-dark-teal">
                Entrar
              </Button>
              
              <div className="text-center">
                <span className="text-gray-500 text-senior">ou</span>
              </div>
              
              <Button variant="outline" className="w-full h-12 text-senior border-care-purple text-care-purple hover:bg-care-purple/10">
                <User className="mr-2 h-5 w-5" />
                Entrar com Conta Gov.br
              </Button>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-gray-600 text-senior">
                Ainda não tem uma conta?{' '}
                <Link to="/signup" className="text-care-teal font-medium hover:text-care-dark-teal">
                  Cadastre-se
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white py-6 px-6 md:px-16 border-t">
        <div className="max-w-screen-xl mx-auto text-center text-sm text-gray-500">
          <p className="text-senior">
            &copy; {new Date().getFullYear()} Care Idosos. Todos os direitos reservados.
          </p>
          <div className="mt-2 flex justify-center space-x-4 text-senior">
            <Link to="/privacy" className="hover:text-care-teal">Política de Privacidade</Link>
            <Link to="/terms" className="hover:text-care-teal">Termos de Uso</Link>
            <Link to="/help" className="hover:text-care-teal">Ajuda</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
