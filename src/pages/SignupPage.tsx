import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Mail, Lock, User, Phone, Axis3D } from 'lucide-react';
import Logo from '@/components/Logo';
import { toast } from "sonner";
import axios from "axios"

interface UserData {
  userFirstName: string;
  userLastName: string;
  email: string;
  phone: string;
  password: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserData>({
    userFirstName: '',
    userLastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.userFirstName || !formData.userLastName || !formData.email || !formData.phone || !formData.password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    if (formData.password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    if (!termsAccepted) {
      toast.error("Você precisa aceitar os termos de uso");
      return;
    }
    
    try{
/*
      const checkEmail = await axios.get('https://elderly-care.onrender.com/user');
      const emailExists = checkEmail.data.some((user: UserData) => user.email === formData.email);
      
      if (emailExists) {
        toast.error("E-mail já cadastrado.");
        return;
      }
*/
      axios.post('https://elderly-care.onrender.com/user/sign-up', formData).then(response=>{
        toast.success("Cadastro realizado com sucesso!")
        navigate('/login');
      })
          
    } catch (error) {
      toast.error("Erro ao processar o cadastro.");
      console.error(error);
    }

  };

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
      
      {/* Signup Form */}
      <div className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-lg">
          <Card className="shadow-lg border-care-teal/20">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold text-care-purple">Crie sua conta</CardTitle>
              <CardDescription className="text-senior">
                Preencha os dados abaixo para se cadastrar
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="userFirstName" className="block text-sm font-medium text-gray-700 text-senior">
                      Nome
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <User className="h-5 w-5" />
                      </span>
                      <Input 
                        id="userFirstName" 
                        placeholder="Seu nome" 
                        className="pl-10 text-senior h-12" 
                        value={formData.userFirstName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="userLastName" className="block text-sm font-medium text-gray-700 text-senior">
                      Sobrenome
                    </label>
                    <Input 
                      id="userLastName" 
                      placeholder="Seu sobrenome" 
                      className="text-senior h-12"
                      value={formData.userLastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
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
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 text-senior">
                    Telefone
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Phone className="h-5 w-5" />
                    </span>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="(00) 00000-0000" 
                      className="pl-10 text-senior h-12"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-senior">
                      Senha
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <Lock className="h-5 w-5" />
                      </span>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10 text-senior h-12"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-senior">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <Lock className="h-5 w-5" />
                      </span>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10 text-senior h-12"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      className="w-5 h-5 border border-gray-300 rounded"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-gray-600 text-senior">
                    <label htmlFor="terms" className="cursor-pointer">
                      Li e concordo com os <Link to="/terms" className="text-care-teal hover:underline">Termos de Uso</Link> e <Link to="/privacy" className="text-care-teal hover:underline">Política de Privacidade</Link>
                    </label>
                  </div>
                </div>
                
                <Button type="submit" className="w-full h-12 text-senior bg-care-teal hover:bg-care-dark-teal">
                  Cadastrar
                </Button>
              </form>
              
              <div className="text-center">
                <span className="text-gray-500 text-senior">ou</span>
              </div>
              
              <Button variant="outline" className="w-full h-12 text-senior border-care-purple text-care-purple hover:bg-care-purple/10">
                <User className="mr-2 h-5 w-5" />
                Cadastrar com Conta Gov.br
              </Button>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-gray-600 text-senior">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-care-teal font-medium hover:text-care-dark-teal">
                  Faça login
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

export default SignupPage;
