
import React, { useState } from 'react';
import { Phone, AlertCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const EmergencyButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const handleEmergencyClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmEmergency = () => {
    setIsDialogOpen(false);
    setIsEmergencyActive(true);
    toast.success("Serviço de emergência acionado", {
      description: "Ajuda está a caminho. Mantenha a calma."
    });
    
    // In a real app, this would connect to an emergency service API
    console.log("Emergency service activated");
  };

  const handleCancelEmergency = () => {
    setIsDialogOpen(false);
  };

  React.useEffect(() => {
    let timer: number;
    if (isDialogOpen && countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleConfirmEmergency();
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isDialogOpen, countdown]);

  React.useEffect(() => {
    if (!isDialogOpen) {
      setCountdown(5);
    }
  }, [isDialogOpen]);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={handleEmergencyClick}
        className={`emergency-button w-20 h-20 md:w-24 md:h-24 flex flex-col items-center justify-center ${
          isEmergencyActive ? 'bg-green-500' : 'bg-care-emergency'
        }`}
        aria-label="Botão de emergência"
      >
        {isEmergencyActive ? (
          <AlertCircle className="h-10 w-10" />
        ) : (
          <>
            <Phone className="h-8 w-8 md:h-10 md:w-10" />
            <span className="text-sm md:text-base font-bold mt-1">SOS</span>
          </>
        )}
      </button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-care-emergency">
              Confirmar Emergência
            </DialogTitle>
            <DialogDescription className="text-senior">
              Você está prestes a acionar um serviço de emergência.
              <span className="block mt-2 font-bold">
                Confirmação automática em {countdown} segundos.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleCancelEmergency} variant="outline" className="text-senior">
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmEmergency} 
              className="bg-care-emergency hover:bg-red-600 text-senior"
            >
              Confirmar Emergência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyButton;
