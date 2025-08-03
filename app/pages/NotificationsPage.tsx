import React, { useEffect, useState } from 'react';
import EmptyPage from '@/components/EmptyPage';
import { Bell } from 'lucide-react';
import axios from 'axios';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return;
  
      try {
        const [medRes, appRes] = await Promise.all([
          axios.get('/api/medications', {
            headers: { 
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get('/api/appointments', {
            headers: { 
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          })
        ]);
  
        const now = new Date();
        const soonMedications = medRes.data.filter(med => {
          const [h, m] = med.time.split(':');
          const medDate = new Date(now);
          medDate.setHours(+h, +m, 0, 0);
          const diff = (medDate.getTime() - now.getTime()) / (1000 * 60);
          return diff >= 0 && diff <= 60;
        });
        const medNotes = soonMedications.map(m => `Medicamento "${m.name}" agendado para daqui a 1 hora ou menos.`);
  
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
        const parseDateTime = (dateStr, timeStr) => {
          let day, month, year;
          if (dateStr.includes('/')) {
            [day, month, year] = dateStr.split('/');
          } else {
            [year, month, day] = dateStr.split('-');
          }
          return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timeStr.padStart(5, '0')}:00`);
        };
        const nearAppointments = appRes.data.filter(app => {
          try {
            const appointmentDate = parseDateTime(app.date, app.time);
            return appointmentDate.getTime() - now.getTime() <= threeDaysMs;
          } catch {
            return false;
          }
        });
        const appNotes = nearAppointments.map(app => `Consulta marcada para ${app.date} às ${app.time}.`);
  
        const allNotes = [...medNotes, ...appNotes];
        setNotifications([...new Set(allNotes)]);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      }
    }
  
    loadData();
  }, []);
  

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {notifications.length === 0 ? (
        <EmptyPage
          title="Notificações"
          description="Aqui você poderá ver suas notificações e alertas importantes."
          icon={<Bell className="w-10 h-10" />}
        />
      ) : (
        <div className='p-6 bg-white rounded-lg'>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-care-purple">
            <Bell className="w-6 h-6" /> Notificações
          </h2>
          <ul className="space-y-3">
            {notifications.map((note, index) => (
                          <li key={index} className="p-4 bg-purple-50 border border-purple-200 rounded-md shadow-sm text-care-purple">
              {note}
            </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;