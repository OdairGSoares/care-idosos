
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Pill, 
  Clock, 
  Plus, 
  Trash2, 
  AlertTriangle 
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

const MedicationsPage = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id' | 'taken'>>({
    name: '',
    dosage: '',
    time: '',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    // Load medications from localStorage
    const savedMedications = localStorage.getItem('medications');
    if (savedMedications) {
      setMedications(JSON.parse(savedMedications));
    }
  }, []);

  useEffect(() => {
    // Validate form
    const isValid = 
      newMedication.name.trim() !== '' && 
      newMedication.dosage.trim() !== '' && 
      newMedication.time.trim() !== '';
    
    setFormValid(isValid);
  }, [newMedication]);

  const saveMedications = (updatedMedications: Medication[]) => {
    setMedications(updatedMedications);
    localStorage.setItem('medications', JSON.stringify(updatedMedications));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMedication = () => {
    if (!formValid) return;

    const newMed: Medication = {
      id: Date.now(),
      ...newMedication,
      taken: false
    };

    const updatedMedications = [...medications, newMed];
    saveMedications(updatedMedications);
    
    // Reset form
    setNewMedication({
      name: '',
      dosage: '',
      time: '',
    });
    
    setDialogOpen(false);
    toast.success('Medicamento adicionado com sucesso!');
  };

  const handleDeleteMedication = (id: number) => {
    const updatedMedications = medications.filter(med => med.id !== id);
    saveMedications(updatedMedications);
    toast.success('Medicamento removido com sucesso!');
  };

  const resetAllMedications = () => {
    const resetMedications = medications.map(med => ({ ...med, taken: false }));
    saveMedications(resetMedications);
    toast.success('Todos os medicamentos foram reiniciados!');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-senior-lg">Gerenciamento de Medicamentos</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-care-teal hover:bg-care-dark-teal text-white">
              <Plus className="h-5 w-5 mr-2" />
              Novo Medicamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Adicionar Medicamento</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-senior">Nome do Medicamento</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Losartana"
                  value={newMedication.name}
                  onChange={handleInputChange}
                  className="text-senior"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dosage" className="text-senior">Dosagem</Label>
                <Input
                  id="dosage"
                  name="dosage"
                  placeholder="Ex: 50mg"
                  value={newMedication.dosage}
                  onChange={handleInputChange}
                  className="text-senior"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time" className="text-senior">Horário</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={newMedication.time}
                  onChange={handleInputChange}
                  className="text-senior"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleAddMedication}
                disabled={!formValid}
                className="bg-care-teal hover:bg-care-dark-teal text-white w-full"
              >
                Adicionar Medicamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {medications.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-senior-lg">Seus Medicamentos</CardTitle>
                <CardDescription>
                  Gerencie seus lembretes de medicamentos
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={resetAllMedications}
                className="text-senior"
              >
                Reiniciar Todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medications.map((medication) => (
                <div 
                  key={medication.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-care-light-teal rounded-full mr-3">
                      <Pill className="h-5 w-5 text-care-teal" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-senior">{medication.name} {medication.dosage}</h3>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{medication.time}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMedication(medication.id)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardContent className="py-10">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-orange-100 rounded-full mb-4">
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-medium text-senior mb-2">
                Nenhum medicamento cadastrado
              </h3>
              <p className="text-gray-500 mb-6 max-w-md text-senior">
                Você ainda não tem medicamentos cadastrados. Adicione seu primeiro medicamento clicando no botão acima.
              </p>
              <Button 
                onClick={() => setDialogOpen(true)}
                className="bg-care-teal hover:bg-care-dark-teal text-white"
              >
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Medicamento
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicationsPage;
