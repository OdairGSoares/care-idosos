
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { User, Bell, Menu, LogOut } from 'lucide-react';
import Logo from './Logo';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const Header = () => {
  return (
    <header className="border-b shadow-sm py-4 bg-white">
      <div className="care-container flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center">
          <Logo />
          <span className="ml-2 text-senior-xl font-bold text-care-purple">Care Idosos</span>
        </Link>
        
        {/* Mobile menu */}
        <div className="flex md:hidden items-center gap-4">
          <Link to="/dashboard/notifications">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-6 w-6 text-care-purple" />
            </Button>
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-6 w-6 text-care-purple" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[250px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/dashboard" className="text-senior-lg py-2 px-4 rounded-md hover:bg-slate-100">Início</Link>
                <Link to="/dashboard/medications" className="text-senior-lg py-2 px-4 rounded-md hover:bg-slate-100">Medicamentos</Link>
                <Link to="/dashboard/appointments" className="text-senior-lg py-2 px-4 rounded-md hover:bg-slate-100">Consultas</Link>
                <Link to="/dashboard/emergency-contacts" className="text-senior-lg py-2 px-4 rounded-md hover:bg-slate-100">Contatos</Link>
                <Link to="/dashboard/profile" className="text-senior-lg py-2 px-4 rounded-md hover:bg-slate-100">Perfil</Link>
                <Link to="/" className="text-senior-lg py-2 px-4 rounded-md hover:bg-slate-100 text-care-teal flex items-center">
                  <LogOut className="h-5 w-5 mr-2" />
                  Sair
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className="text-senior hover:text-care-teal">Início</Link>
          <Link to="/dashboard/medications" className="text-senior hover:text-care-teal">Medicamentos</Link>
          <Link to="/dashboard/appointments" className="text-senior hover:text-care-teal">Consultas</Link>
          <Link to="/dashboard/emergency-contacts" className="text-senior hover:text-care-teal">Contatos</Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard/notifications">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-6 w-6 text-care-purple" />
              </Button>
            </Link>
            <Link to="/dashboard/profile">
              <Button variant="outline" size="icon" className="rounded-full border-care-teal" aria-label="Profile">
                <User className="h-5 w-5 text-care-purple" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="text-care-teal hover:text-white hover:bg-care-teal">
                <LogOut className="h-5 w-5 mr-2" />
                Sair
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
