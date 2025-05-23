
import React from 'react';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Check, Clock, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import axios from 'axios';
// Sample medication data

const MedicationReminder = () => {
  const [meds, setMeds] = React.useState([]);
  
  useEffect(()=>{
    async function loadMedication() {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token de autenticação não encontrado.');
        return;
      }
      const medications = await axios.get('https://elderly-care.onrender.com/medication', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      setMeds(medications.data)
    }

    loadMedication()
  })

  
  const markAsTaken = (id: number) => {
    const updatedMeds = meds.map(med => 
      med.id === id ? { ...med, taken: true } : med
    );
    
    setMeds(updatedMeds);
    localStorage.setItem('medications', JSON.stringify(updatedMeds));
    toast.success("Medicamento registrado!");
  };
  
  const setupReminder = (id: number) => {
    const medication = meds.find(med => med.id === id);
    if (medication) {
      toast.success(`Lembrete configurado para ${medication.name} às ${medication.time}`);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="bg-care-teal text-white rounded-t-lg">
        <CardTitle className="text-senior-lg flex items-center">
          <Pill className="mr-2 h-5 w-5" />
          Lembretes de Medicamentos
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="space-y-4">
          {meds.length > 0 ? (
            meds.map(medication => (
              <div 
                key={medication.id} 
                className={`p-4 rounded-lg border flex items-center justify-between ${
                  medication.taken ? 'bg-green-50 border-green-200' : 'bg-white'
                }`}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${
                    medication.taken ? 'bg-green-100 text-green-600' : 'bg-care-light-teal text-care-teal'
                  }`}>
                    <Pill className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-senior font-medium">{medication.name} {medication.dosage}</h3>
                    <p className="text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {medication.time}
                    </p>
                  </div>
                </div>
                
                
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">Nenhum medicamento cadastrado.</p>
            </div>
          )}
        </div>
        <div className="mt-6">
          <Button 
            className="w-full bg-care-teal hover:bg-care-dark-teal text-senior"
            asChild
          >
            <Link to="/dashboard/medications">
              <Pill className="h-5 w-5 mr-2" />
              Gerenciar Medicamentos
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationReminder;
