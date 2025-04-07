
import React from 'react';
import EmptyPage from '@/components/EmptyPage';
import { Bell } from 'lucide-react';

const NotificationsPage = () => {
  return (
    <EmptyPage
      title="Notificações"
      description="Aqui você poderá ver suas notificações e alertas importantes."
      icon={<Bell className="w-10 h-10" />}
    />
  );
};

export default NotificationsPage;
