
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Phone, AlertCircle } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import EmergencyContactForm from '@/components/EmergencyContactForm';
import EmergencyContactList from '@/components/EmergencyContactList';
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
} from "@/components/ui/alert-dialog";

import axios from 'axios';

// Interface para contato de emergência (compatível com Prisma)
interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isMainContact: boolean;
}

const EmergencyContactsPage = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar contatos ao inicializar
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    console.log('🔄 [EmergencyContactsPage] Carregando contatos...');

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('❌ [EmergencyContactsPage] Token de autenticação não encontrado.');
      toast.error('Sessão expirada. Faça login novamente.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.get('/api/emergency-contacts', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ [EmergencyContactsPage] Contatos carregados:', response.data.length);
      setContacts(response.data);

    } catch (error) {
      console.error('❌ [EmergencyContactsPage] Erro ao carregar contatos:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          toast.error('Sessão expirada. Faça login novamente.');
        } else {
          toast.error('Erro ao carregar contatos de emergência.');
        }
      } else {
        toast.error('Erro de conexão ao carregar contatos.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async (data: Omit<EmergencyContact, 'id'>) => {
    console.log('➕ [EmergencyContactsPage] Adicionando contato:', data);

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('❌ [EmergencyContactsPage] Token de autenticação não encontrado.');
      toast.error('Sessão expirada. Faça login novamente.');
      return;
    }

    try {
      const response = await axios.post(
        '/api/emergency-contacts',
        data,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        console.log('✅ [EmergencyContactsPage] Contato adicionado com sucesso');
        toast.success('Contato adicionado com sucesso!');
        setIsAddingContact(false);

        // Recarregar a lista de contatos
        await loadContacts();
      }
    } catch (error) {
      console.error('❌ [EmergencyContactsPage] Erro ao adicionar contato:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          toast.error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 400) {
          toast.error('Dados inválidos. Verifique os campos obrigatórios.');
        } else {
          toast.error('Erro ao adicionar contato.');
        }
      } else {
        toast.error('Erro de conexão ao adicionar contato.');
      }
    }
  };

  const handleEditContact = async (data: Omit<EmergencyContact, 'id'>) => {
    if (!editingContact) {
      console.error('❌ [EmergencyContactsPage] Nenhum contato selecionado para edição');
      return;
    }

    console.log('✏️ [EmergencyContactsPage] Editando contato:', editingContact.id, data);

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('❌ [EmergencyContactsPage] Token de autenticação não encontrado.');
      toast.error('Sessão expirada. Faça login novamente.');
      return;
    }

    try {
      const response = await axios.put(
        `/api/emergency-contacts/${editingContact.id}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        console.log('✅ [EmergencyContactsPage] Contato atualizado com sucesso');
        toast.success('Contato atualizado com sucesso!');
        setEditingContact(null);

        // Recarregar a lista de contatos
        await loadContacts();
      }
    } catch (error) {
      console.error('❌ [EmergencyContactsPage] Erro ao atualizar contato:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          toast.error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 404) {
          toast.error('Contato não encontrado.');
        } else if (error.response?.status === 400) {
          toast.error('Dados inválidos. Verifique os campos obrigatórios.');
        } else {
          toast.error('Erro ao atualizar contato.');
        }
      } else {
        toast.error('Erro de conexão ao atualizar contato.');
      }
    }
  };

  const handleDeleteContact = async () => {
    if (!deletingContactId) {
      console.error('❌ [EmergencyContactsPage] Nenhum contato selecionado para exclusão');
      return;
    }

    console.log('🗑️ [EmergencyContactsPage] Removendo contato:', deletingContactId);

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('❌ [EmergencyContactsPage] Token de autenticação não encontrado.');
      toast.error('Sessão expirada. Faça login novamente.');
      setDeletingContactId(null);
      return;
    }

    try {
      const response = await axios.delete(
        `/api/emergency-contacts/${deletingContactId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        console.log('✅ [EmergencyContactsPage] Contato removido com sucesso');
        toast.success('Contato removido com sucesso!');
        setDeletingContactId(null);

        // Recarregar a lista de contatos
        await loadContacts();
      }
    } catch (error) {
      console.error('❌ [EmergencyContactsPage] Erro ao remover contato:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          toast.error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 404) {
          toast.error('Contato não encontrado.');
        } else {
          toast.error('Erro ao remover contato.');
        }
      } else {
        toast.error('Erro de conexão ao remover contato.');
      }

      setDeletingContactId(null);
    }
  };

  const openEditSheet = (contact: EmergencyContact) => {
    console.log('📝 [EmergencyContactsPage] Abrindo edição para contato:', contact.id);
    setEditingContact(contact);
  };

  const openDeleteDialog = (id: string) => {
    console.log('❓ [EmergencyContactsPage] Abrindo confirmação de exclusão para contato:', id);
    setDeletingContactId(id);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold mb-1 text-care-purple">Contatos de Emergência</h1>
          <p className="text-sm sm:text-base text-care-purple">Gerencie seus contatos para situações de emergência</p>
        </div>

        <Sheet open={isAddingContact} onOpenChange={setIsAddingContact}>
          <SheetTrigger asChild>
            <Button className="w-full sm:w-auto bg-care-purple hover:bg-care-light-purple text-white text-sm sm:text-base">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Adicionar Contato</span>
              <span className="sm:hidden">Adicionar</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[95vw] sm:w-[400px] lg:w-[540px] max-h-[90vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-lg sm:text-xl text-care-purple">Adicionar Novo Contato</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <EmergencyContactForm
                onSubmit={handleAddContact}
                onCancel={() => setIsAddingContact(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mb-4">
        <div className="flex items-start space-x-2 p-3 sm:p-4 rounded-lg bg-amber-50 text-amber-800 mb-4 sm:mb-6">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0" />
          <p className="text-care-purple text-sm sm:text-base">
            Em caso de emergência, entraremos em contato com as pessoas cadastradas aqui.
            Certifique-se de manter esses contatos sempre atualizados.
          </p>
        </div>
      </div>

      <div>
        <EmergencyContactList
          contacts={contacts}
          onEdit={openEditSheet}
          onDelete={openDeleteDialog}
          isLoading={isLoading}
        />
      </div>

      {/* Sheet para edição de contato */}
      <Sheet open={!!editingContact} onOpenChange={(open) => !open && setEditingContact(null)}>
        <SheetContent className="w-[95vw] sm:w-[400px] lg:w-[540px] max-h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-lg sm:text-xl text-care-purple">Editar Contato</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {editingContact && (
              <EmergencyContactForm
                contact={editingContact}
                onSubmit={handleEditContact}
                onCancel={() => setEditingContact(null)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialog de confirmação para exclusão */}
      <AlertDialog open={deletingContactId !== null} onOpenChange={(open) => !open && setDeletingContactId(null)}>
        <AlertDialogContent className="w-[95vw] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-care-purple text-base sm:text-lg">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteContact}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 w-full sm:w-auto"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmergencyContactsPage;
