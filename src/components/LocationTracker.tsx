
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Share2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const LocationTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  
  const handleToggleTracking = () => {
    setIsTracking(!isTracking);
    
    if (!isTracking) {
      toast.success("Localização ativada", {
        description: "Seus cuidadores podem ver sua localização agora."
      });
    } else {
      toast.info("Localização desativada");
    }
  };
  
  const handleShareLocation = () => {
    toast.success("Localização compartilhada", {
      description: "Enviada para seus contatos de emergência."
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="bg-care-dark-teal text-white rounded-t-lg">
        <CardTitle className="text-senior-lg flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Localização
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="font-medium text-senior">
              {isTracking ? 'Localização ativa' : 'Localização desativada'}
            </span>
          </div>
          <Switch 
            checked={isTracking} 
            onCheckedChange={handleToggleTracking}
            className="data-[state=checked]:bg-care-teal" 
          />
        </div>
        
        <p className="text-gray-600 mb-4 text-senior">
          {isTracking 
            ? 'Seus cuidadores podem ver sua localização em tempo real.' 
            : 'Ative para permitir que seus cuidadores vejam sua localização.'}
        </p>
        
        <Button 
          className="w-full bg-care-dark-teal hover:bg-care-teal text-senior flex items-center justify-center"
          onClick={handleShareLocation}
        >
          <Share2 className="mr-2 h-5 w-5" />
          Compartilhar Localização Atual
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationTracker;
