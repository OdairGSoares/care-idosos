
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Share2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const LocationTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Obter userId do localStorage
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
    
    if (storedUserId) {
      loadLocationPermission(storedUserId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadLocationPermission = async (userId: string) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.log('❌ Token não encontrado');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/users/${userId}/location-permission`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsTracking(data.locationPermission);
      } else {
        console.error('❌ Erro ao carregar permissão de localização');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar permissão de localização:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleTracking = async () => {
    if (!userId) {
      toast.error('Usuário não identificado');
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        toast.error('Token de autenticação não encontrado');
        return;
      }

      const newPermission = !isTracking;
      
      const response = await fetch(`/api/users/${userId}/location-permission`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ locationPermission: newPermission })
      });

      if (response.ok) {
        const data = await response.json();
        setIsTracking(newPermission);
        
        if (newPermission) {
          toast.success("Localização ativada", {
            description: "Seus cuidadores podem ver sua localização agora."
          });
        } else {
          toast.info("Localização desativada", {
            description: "Sua localização não será mais compartilhada."
          });
        }
      } else {
        const errorData = await response.json();
        toast.error('Erro ao atualizar permissão', {
          description: errorData.message || 'Tente novamente.'
        });
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar permissão de localização:', error);
      toast.error('Erro ao atualizar permissão', {
        description: 'Tente novamente.'
      });
    }
  };
  
  const handleShareLocation = async () => {
    if (!isTracking) {
      toast.error("Permissão de localização desativada", {
        description: "Ative a permissão de localização antes de compartilhar."
      });
      return;
    }

    try {
      // Verificar se o navegador suporta geolocalização
      if (!navigator.geolocation) {
        toast.error("Geolocalização não suportada", {
          description: "Seu navegador não suporta geolocalização."
        });
        return;
      }

      // Solicitar permissão de localização do navegador
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Simular envio para contatos de emergência
          console.log('📍 Localização obtida:', { latitude, longitude });
          
          toast.success("Localização compartilhada", {
            description: `Enviada para seus contatos de emergência. (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
          });
        },
        (error) => {
          console.error('❌ Erro ao obter localização:', error);
          
          let errorMessage = 'Erro ao obter localização.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão de localização negada pelo usuário.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Informação de localização indisponível.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tempo limite excedido para obter localização.';
              break;
          }
          
          toast.error("Erro ao obter localização", {
            description: errorMessage
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } catch (error) {
      console.error('❌ Erro ao compartilhar localização:', error);
      toast.error("Erro ao compartilhar localização", {
        description: "Tente novamente."
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-care-purple text-white rounded-t-lg">
          <CardTitle className="text-care-purple-lg flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Localização
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-care-light-purple"></div>
            <span className="ml-2 text-care-purple">Carregando...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="bg-care-purple text-white rounded-t-lg">
        <CardTitle className="text-care-purple-lg flex items-center">
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
            <span className="font-medium text-care-purple">
              {isTracking ? 'Localização ativa' : 'Localização desativada'}
            </span>
          </div>
          <Switch 
            checked={isTracking} 
            onCheckedChange={handleToggleTracking}
            className="data-[state=checked]:bg-care-light-purple" 
          />
        </div>
        
        <p className="text-care-purple mb-4 text-care-purple">
          {isTracking 
            ? 'Seus cuidadores podem ver sua localização em tempo real.' 
            : 'Ative para permitir que seus cuidadores vejam sua localização.'}
        </p>
        
        <Button 
          className="w-full bg-care-purple hover:bg-care-light-purple text-white flex items-center justify-center"
          onClick={handleShareLocation}
          disabled={!isTracking}
        >
          <Share2 className="mr-2 h-5 w-5" />
          Compartilhar Localização Atual
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationTracker;
