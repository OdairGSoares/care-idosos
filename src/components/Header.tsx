
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { User, Bell, Menu, LogOut } from 'lucide-react';
import Logo from './Logo';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { toast } from "sonner";

interface CurrentUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
}

const Header = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const userFromStorage = localStorage.getItem('currentUser');
    if (userFromStorage) {
      try {
        setCurrentUser(JSON.parse(userFromStorage));
      } catch (error) {
        console.error('Erro ao processar dados do usuário:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    toast.success("Logout realizado com sucesso!");
    navigate('/');
  };
  
  return (
    <header className="border-b shadow-sm py-4 bg-white">
      <div className="care-container flex items-center justify-between">
        <Link to={currentUser?.isLoggedIn ? "/dashboard" : "/"} className="flex items-center">
          <Logo />
          <span className="ml-2 text-senior-xl font-bold text-care-purple">Care Idosos</span>
        </Link>
        
        {/* Mobile menu */}
        <div className="flex md:hidden items-center gap-4">
          {currentUser?.isLoggedIn ? (
            <>
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
                    <div className="py-2 px-4 rounded-md bg-gray-100 mb-4">
                      <p className="font-medium text-care-purple">Olá, {currentUser.firstName}</p>
                    </div>
                    <Link to="/dashboard" className="text-senior-lg py-2 px-4 rounded-md hover:bg-slate-100">Início</Link>
                    <Link to="/dashboard/medications" className="text-senior-lg py-2 px-4 rounded-md hover:bg-slate-100">Medicamentos</Link>
                    <Link to="/dashboard/appointments" className="text-senior-lg py-2 px-4 rounded-md hover:bg-slate-100">Consultas</Link>
                    <Link to="/dashboard/emergency-contacts" className="text-senior-lg py-2 px-4 rounded-md hover:bg-slate-100">Contatos</Link>
                    <Link to="/dashboard/profile" className="text-senior-lg py-2 px-4 rounded-md hover:bg-slate-100">Perfil</Link>
                    <button
                      onClick={handleLogout}
                      className="text-senior-lg py-2 px-4 rounded-md hover:bg-slate-100 text-care-teal flex items-center w-full text-left"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Sair
                    </button>
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-care-teal text-care-teal">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-care-teal">
                  Cadastro
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Desktop navigation */}
        {currentUser?.isLoggedIn ? (
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
              <Button variant="ghost" onClick={handleLogout} className="text-care-teal hover:text-white hover:bg-care-teal">
                <LogOut className="h-5 w-5 mr-2" />
                Sair
              </Button>
            </div>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" className="border-care-teal text-care-teal hover:bg-care-teal/10">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-care-teal hover:bg-care-dark-teal">
                Cadastro
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
