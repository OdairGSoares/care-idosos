
import React from 'react';
import Header from './Header';
import EmergencyButton from './EmergencyButton';
import { Outlet } from 'react-router-dom';

const Layout = () => {

  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    window.location.href = '/';
    return;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50">
        <Outlet />
      </main>
      <EmergencyButton />
    </div>
  );
};

export default Layout;
