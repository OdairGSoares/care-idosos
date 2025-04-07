
import React from 'react';
import EmptyPage from '@/components/EmptyPage';
import { User } from 'lucide-react';

const ProfilePage = () => {
  return (
    <EmptyPage
      title="Perfil"
      description="Aqui você poderá gerenciar suas informações pessoais e configurações."
      icon={<User className="w-10 h-10" />}
    />
  );
};

export default ProfilePage;
