'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Calendar, Clock, Ambulance } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '@/components/Logo';

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg'];
  
  // Estados do formulário de contato
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Muda a imagem a cada 4 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  // Função para validar email simples
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para validar telefone simples (apenas números e alguns caracteres especiais)
  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[\d\s\(\)\-\+]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Função para lidar com mudanças nos campos
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função para validar e processar o formulário
  const handleContactSubmit = () => {
    const { firstName, lastName, email, phone } = formData;

    // Verificar se todos os campos estão preenchidos
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      toast.error('Todos os campos precisam ser preenchidos corretamente!', {
        description: 'Por favor, preencha seu nome, sobrenome, email e telefone.',
        duration: 4000,
      });
      return;
    }

    // Validar email
    if (!isValidEmail(email)) {
      toast.error('Email inválido!', {
        description: 'Por favor, insira um email válido.',
        duration: 4000,
      });
      return;
    }

    // Validar telefone
    if (!isValidPhone(phone)) {
      toast.error('Telefone inválido!', {
        description: 'Por favor, insira um telefone válido com pelo menos 10 dígitos.',
        duration: 4000,
      });
      return;
    }

    // Se chegou até aqui, tudo está válido
    toast.success('Formulário enviado com sucesso!', {
      description: 'Entraremos em contato em breve. Obrigado!',
      duration: 5000,
    });

    // Limpar o formulário após envio
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    });
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="py-4 px-6 md:px-16 flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
          <div className="flex flex-col justify-center items-start ml-3">
            <span className="text-xl font-bold text-care-purple">Care Idosos</span>
                            <span className="text-xs text-care-purple hidden md:block">Cuidando de quem cuidou</span>
          </div>

        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" className="border-care-teal text-care-teal hover:bg-care-teal/10">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-care-teal hover:bg-care-dark-teal">
              Cadastro
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gray-100 py-12 px-6 md:px-16">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="w-20 h-2 bg-care-teal"></div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-care-purple">
              Viva bem com <span className="text-care-teal">saúde</span> e <span className="text-care-teal">segurança</span>.
            </h1>
            <p className="text-senior-lg text-care-purple max-w-lg">
              Cuidamos da sua saúde e bem-estar com soluções tecnológicas que garantem sua segurança e independência no conforto do seu lar.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button size="lg" className="bg-care-teal hover:bg-care-dark-teal text-white">
                  Agendar Consulta <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-full bg-care-teal/20 w-64 h-64 absolute -top-10 -right-10 z-0"></div>
            <div className="relative z-10 rounded-lg shadow-xl overflow-hidden max-w-full h-96">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Care Idosos - Imagem ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                />
              ))}
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-full bg-care-teal w-20 h-20 z-0"></div>
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${index === currentImageIndex ? 'bg-care-purple' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Appointment Section */}
      <section className="bg-care-purple text-white py-8 px-6 md:px-16">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <Clock className="h-5 w-5 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Horário de Atendimento</p>
                <p className="text-sm opacity-80">Segunda - Sexta: 8:00 - 17:00</p>
                <p className="text-sm opacity-80">Sábado - Domingo: 8:00 - 15:00</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start gap-4">
              <Clock className="h-5 w-5 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Informações de Contato</p>
                <p className="text-sm opacity-80">
                  São Paulo: (11) 99999-9999
                  <br />
                  Demais regiões: (11) 99999-9999
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center">
              <Ambulance className="h-8 w-8 mr-3" />
              <span className="font-semibold text-xl">Emergências</span>
            </div>
            <a href="tel:+00000000">


              <Button className="bg-white text-care-purple hover:bg-white/80">
                Chamar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-care-teal text-white py-12 px-6 md:px-16">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
                          <div className="space-y-4 text-care-purple">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-senior text-white">Nome:</label>
                    <Input 
                      id="firstName" 
                      placeholder="Seu nome" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="bg-white/90 text-care-purple h-12 text-senior" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-senior text-white">Sobrenome:</label>
                    <Input 
                      id="lastName" 
                      placeholder="Seu sobrenome" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="bg-white/90 text-care-purple h-12 text-senior" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-senior text-white">Email:</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Seu email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white/90 text-care-purple h-12 text-senior" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-senior text-white">Telefone:</label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="Seu telefone" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-white/90 text-care-purple h-12 text-senior" 
                  />
                </div>
              </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold flex items-center">
                <Calendar className="mr-2 h-6 w-6" />
                Horário de Funcionamento
              </h3>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                  <span>Segunda - Sexta</span>
                  <span className="font-bold">8:00 - 17:00</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                  <span>Sábado - Domingo</span>
                  <span className="font-bold">8:00 - 15:00</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleContactSubmit}
              className="w-full bg-white text-green-600 hover:text-care-purple text-care-teal hover:bg-white/80 rounded-lg mt-4 flex items-center justify-center"
            >
              Clique aqui e entraremos em contato
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 px-6 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Logo />
              <span className="ml-3 text-xl font-bold text-care-purple">Care Idosos</span>
            </div>

            <div className="flex gap-4">
                          <Link href="/login" className="text-care-purple hover:text-care-dark-teal">
              Login
            </Link>
            <Link href="/signup" className="text-care-purple hover:text-care-dark-teal">
              Cadastro
            </Link>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6 text-center text-sm text-care-purple">
            &copy; {new Date().getFullYear()} Care Idosos. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
