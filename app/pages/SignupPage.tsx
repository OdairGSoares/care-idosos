'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { useSignUp } from '@/hooks/useApi';
import type { IUserDataWithoutUserId } from '@/types/api';

const SignupPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<IUserDataWithoutUserId>({
    userFirstName: '',
    userLastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const signUpMutation = useSignUp();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.userFirstName.trim()) {
      toast.error("Nome é obrigatório");
      return false;
    }
    
    if (!formData.userLastName.trim()) {
      toast.error("Sobrenome é obrigatório");
      return false;
    }
    
    if (!formData.email.trim()) {
      toast.error("E-mail é obrigatório");
      return false;
    }
    
    if (!formData.phone.trim()) {
      toast.error("Telefone é obrigatório");
      return false;
    }
    
    if (!formData.password) {
      toast.error("Senha é obrigatória");
      return false;
    }
    
    if (formData.password.length < 6) {
      toast.error("Senha deve ter pelo menos 6 caracteres");
      return false;
    }
    
    if (formData.password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return false;
    }
    
    if (!termsAccepted) {
      toast.error("Você precisa aceitar os termos de uso");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    if (!validateForm()) {
      return;
    }

    try {
      const result = await signUpMutation.mutateAsync(formData);
      if (result) {
        // Toast já é chamado no UserService, não precisa chamar aqui
        router.push('/login');
      }
    } catch (error) {
      // O erro já é tratado no hook/service
      console.error("Erro no cadastro:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md text-care-purple">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
          <CardDescription className="text-center text-care-purple">
            Crie sua conta para começar a usar o Care Idosos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userFirstName">Nome</Label>
                <Input
                  id="userFirstName"
                  type="text"
                  placeholder="João"
                  value={formData.userFirstName}
                  onChange={handleInputChange}
                  required
                  disabled={signUpMutation.isPending}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userLastName">Sobrenome</Label>
                <Input
                  id="userLastName"
                  type="text"
                  placeholder="Silva"
                  value={formData.userLastName}
                  onChange={handleInputChange}
                  required
                  disabled={signUpMutation.isPending}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="joao@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={signUpMutation.isPending}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={handleInputChange}
                required
                disabled={signUpMutation.isPending}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={signUpMutation.isPending}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={signUpMutation.isPending}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={signUpMutation.isPending}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={signUpMutation.isPending}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                disabled={signUpMutation.isPending}
              />
              <Label htmlFor="terms" className="text-sm">
                Aceito os{" "}
                <a href="#" className="text-primary hover:underline">
                  termos de uso
                </a>{" "}
                e{" "}
                <a href="#" className="text-primary hover:underline">
                  política de privacidade
                </a>
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>
          </form>
          
          <Separator className="my-4" />
          
          <div className="text-center text-sm">
            <span className="text-muted-foreground text-care-purple">Já tem uma conta? </span>
            <Link href="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
