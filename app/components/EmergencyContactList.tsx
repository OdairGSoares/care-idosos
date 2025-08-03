
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Star, PhoneCall, Loader2, AlertTriangle, User } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Interface para contato de emergência (compatível com Prisma)
interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isMainContact: boolean;
}

interface EmergencyContactListProps {
  contacts: EmergencyContact[];
  onEdit: (contact: EmergencyContact) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const EmergencyContactList = ({ contacts, onEdit, onDelete, isLoading }: EmergencyContactListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Function to handle calling a contact
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Function to handle delete with loading state
  const handleDelete = async (id: string) => {
    console.log('🗑️ [EmergencyContactList] Iniciando exclusão do contato:', id);
    
    setDeletingId(id);
    try {
      // Chamar função onDelete que gerenciará a API call
      onDelete(id);
    } catch (error) {
      console.error("❌ [EmergencyContactList] Erro ao excluir contato:", error);
      toast.error("Erro ao excluir contato");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg animate-pulse">
            <div className="flex items-center min-w-0 flex-1">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full mr-3 flex-shrink-0"></div>
              <div className="min-w-0 flex-1">
                <div className="h-4 sm:h-5 w-24 sm:w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-200 rounded ml-2 flex-shrink-0"></div>
          </div>
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="py-8 sm:py-10 px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="p-2 sm:p-3 bg-orange-100 rounded-full mb-3 sm:mb-4">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-care-purple mb-2">
              Nenhum contato cadastrado
            </h3>
            <p className="text-care-purple mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
              Adicione contatos de emergência para que possamos entrar em contato com alguém caso seja necessário.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-care-purple text-lg sm:text-xl">Seus Contatos de Emergência</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center min-w-0 flex-1">
                <div className="p-1.5 sm:p-2 bg-care-light-purple rounded-full mr-3 flex-shrink-0">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-medium text-care-purple truncate">
                    {contact.name}
                    {contact.isMainContact && (
                      <span className="ml-2 text-care-purple font-normal text-sm sm:text-base">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                        Principal
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center text-care-purple text-xs sm:text-sm gap-1 sm:gap-3">
                    <div className="flex items-center">
                      <PhoneCall className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span>{contact.phone}</span>
                    </div>
                    <span className="text-xs text-care-purple opacity-75">
                      {contact.relationship}
                    </span>
                    <span className="text-xs text-care-purple opacity-75">
                      ID: {contact.id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 sm:gap-2 ml-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCall(contact.phone)}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3"
                  title="Ligar para contato"
                >
                  <PhoneCall className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Ligar</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(contact)}
                  className="text-care-purple hover:bg-care-purple/20 hover:text-care-purple h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Editar</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white text-red-600 focus:ring-red-700 hover:bg-red-50 hover:text-red-600 h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3"
                      disabled={deletingId === contact.id}
                    >
                      {deletingId === contact.id ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[95vw] max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                        Confirmar Exclusão
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-sm sm:text-base">
                        Tem certeza que deseja remover <strong>{contact.name}</strong>?
                        <br /><br />
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel disabled={deletingId === contact.id} className="w-full sm:w-auto">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(contact.id)}
                        disabled={deletingId === contact.id}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600 w-full sm:w-auto"
                      >
                        {deletingId === contact.id ? (
                          <>
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                            <span className="hidden sm:inline">Removendo...</span>
                            <span className="sm:hidden">Removendo</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            <span className="hidden sm:inline">Sim, Excluir</span>
                            <span className="sm:hidden">Excluir</span>
                          </>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyContactList;
