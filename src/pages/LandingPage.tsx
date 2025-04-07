
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Calendar, Clock, Ambulance, ChevronLeft, ChevronRight } from 'lucide-react';
import Logo from '@/components/Logo';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="py-4 px-6 md:px-16 flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
          <span className="ml-3 text-xl font-bold">Care Idosos</span>
          <span className="text-xs text-gray-500 ml-2 hidden md:block">Cuidando de quem cuidou</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8 text-senior">
          <Link to="/" className="text-care-purple font-medium">Home</Link>
          <Link to="/services" className="text-gray-700 hover:text-care-teal">Serviços</Link>
          <Link to="/about" className="text-gray-700 hover:text-care-teal">Sobre Nós</Link>
          <Link to="/doctors" className="text-gray-700 hover:text-care-teal">Profissionais</Link>
          <Link to="/appointments" className="text-gray-700 hover:text-care-teal">Consultas</Link>
          <Link to="/contact" className="text-gray-700 hover:text-care-teal">Contato</Link>
        </nav>
        
        <Link to="/appointment">
          <Button className="hidden md:flex bg-care-teal hover:bg-care-dark-teal">
            Agendar Consulta <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        
        <Button variant="ghost" size="icon" className="md:hidden">
          <Calendar className="h-6 w-6" />
        </Button>
      </header>
      
      {/* Hero Section */}
      <section className="relative bg-gray-100 py-12 px-6 md:px-16">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="w-20 h-2 bg-care-teal"></div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Viva bem com <span className="text-care-teal">saúde</span> e <span className="text-care-teal">segurança</span>.
            </h1>
            <p className="text-senior-lg text-gray-600 max-w-lg">
              Cuidamos da sua saúde e bem-estar com soluções tecnológicas que garantem sua segurança e independência no conforto do seu lar.
            </p>
            <div className="pt-4">
              <Link to="/appointment">
                <Button size="lg" className="bg-care-teal hover:bg-care-dark-teal text-senior">
                  Agendar Consulta <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-full bg-care-teal/20 w-64 h-64 absolute -top-10 -right-10 z-0"></div>
            <img 
              src="/lovable-uploads/253ff09f-7389-40a7-bee2-f3a525984802.png" 
              alt="Idosa sendo atendida por médico" 
              className="relative z-10 rounded-lg shadow-xl max-w-full"
            />
            <div className="absolute -bottom-5 -left-5 rounded-full bg-care-teal w-20 h-20 z-0"></div>
          </div>
        </div>
        
        {/* Carousel indicators */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-3 h-3 rounded-full bg-care-purple"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        </div>
      </section>
      
      {/* Appointment Section */}
      <section className="bg-care-purple text-white py-8 px-6 md:px-16">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-4">Agende sua Consulta</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Horário de Atendimento</p>
                  <p className="text-sm opacity-80">Segunda - Sexta: 8:00 - 17:00</p>
                  <p className="text-sm opacity-80">Segunda - Sexta: 8:00 - 17:00</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="flex items-start gap-4 mb-4">
              <Clock className="h-5 w-5 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Informações de Contato</p>
                <p className="text-sm opacity-80">
                  Entre em contato para mais informações sobre nossos serviços e atendimentos.
                </p>
              </div>
            </div>
            <Button variant="outline" className="text-white border-white hover:bg-white/20">
              Ver Horários <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="md:col-span-1 flex items-center justify-between">
            <div className="flex items-center">
              <Ambulance className="h-8 w-8 mr-3" />
              <span className="font-semibold text-xl">Emergências</span>
            </div>
            <Button className="bg-white text-care-purple hover:bg-white/80">
              Chamar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="bg-care-teal text-white py-12 px-6 md:px-16">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-senior">Nome:</label>
                  <Input id="firstName" placeholder="Seu nome" className="bg-white/90 text-gray-800 h-12 text-senior" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-senior">Sobrenome:</label>
                  <Input id="lastName" placeholder="Seu sobrenome" className="bg-white/90 text-gray-800 h-12 text-senior" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-senior">Email:</label>
                <Input id="email" type="email" placeholder="Seu email" className="bg-white/90 text-gray-800 h-12 text-senior" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-senior">Telefone:</label>
                <Input id="phone" type="tel" placeholder="Seu telefone" className="bg-white/90 text-gray-800 h-12 text-senior" />
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
            
            <Button size="lg" className="w-full bg-white text-care-teal hover:bg-white/80 text-senior">
              Agendar Consulta
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
              <span className="ml-3 text-xl font-bold">Care Idosos</span>
            </div>
            
            <div className="flex gap-4">
              <Link to="/login" className="text-care-teal hover:text-care-dark-teal">
                Login
              </Link>
              <Link to="/signup" className="text-care-teal hover:text-care-dark-teal">
                Cadastro
              </Link>
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Care Idosos. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
