
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Phone, AlertCircle } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { 
  EmergencyContact, 
  getEmergencyContacts, 
  addEmergencyContact, 
  updateEmergencyContact, 
  deleteEmergencyContact
} from '@/utils/emergencyContactsUtils';
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

const EmergencyContactsPage = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar contatos ao inicializar
  useEffect(() => {
    loadContacts();
  }, [isAddingContact, editingContact, deletingContactId]);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      async function loadContacts() {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token de autenticação não encontrado.');
          return;
        }
        const contacts = await axios.get('https://elderly-care.onrender.com/contacts', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        setContacts(contacts.data);
      }
  
      loadContacts()
    } catch (error) {
      console.error("Error loading contacts:", error);
      toast.error("Erro ao carregar contatos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async (data: Omit<EmergencyContact, 'id'>) => {

    async function addContact() {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token de autenticação não encontrado.');
        return;
      }
    

      try {
        await axios.post(
          'https://elderly-care.onrender.com/contacts',
          data,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }
        );
        setIsAddingContact(false);
        toast.success('Contato adicionado com sucesso!');
      } catch (error) {
        console.error("Error adding contact:", error);
        toast.error("Erro ao adicionar contato");
      }
    }

    addContact()
  };

  const handleEditContact = async (data: Omit<EmergencyContact, 'id'>) => {
    if (editingContact) {

      async function editContact() {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token de autenticação não encontrado.');
          return;
        }
      
        try {
          await axios.put(
            `https://elderly-care.onrender.com/contacts/${editingContact.id}`,
            data,
            {
              headers: {
                'Authorization': `Bearer ${authToken}`
              }
            }
          );
          setEditingContact(null);
          toast.success('Contato atualizado com sucesso!');
        } catch (error) {
          console.error("Error updating contact:", error);
          toast.error("Erro ao atualizar contato");
        }
      }
  
      editContact()

    }
  };

  const handleDeleteContact = async () => {
    if (deletingContactId !== null) {
      deleteEmergencyContact(deletingContactId)
      setDeletingContactId(null);
      toast.success('Contato removido com sucesso!');
      /*
      async function deleteContact() {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token de autenticação não encontrado.');
          return;
        }
      
        try {
          await axios.put(
            `https://elderly-care.onrender.com/contacts/${deletingContactId}`,
            {
              headers: {
                'Authorization': `Bearer ${authToken}`
              }
            }
          );
          setDeletingContactId(null);
          toast.success('Contato removido com sucesso!');
        } catch (error) {
          console.error("Error deleting contact:", error);
          toast.error("Erro ao remover contato");
        }
      }
  
      deleteContact()
      */
    }
  };

  const openEditSheet = (contact: EmergencyContact) => {
    setEditingContact(contact);
  };

  const openDeleteDialog = (id: number) => {
    setDeletingContactId(id);
  };

  return (
    <div className="care-container py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-care-light-purple text-white flex items-center justify-center">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Contatos de Emergência</h1>
            <p className="text-gray-500 text-senior">Gerencie seus contatos para situações de emergência</p>
          </div>
        </div>

        <Sheet open={isAddingContact} onOpenChange={setIsAddingContact}>
          <SheetTrigger asChild>
            <Button className="bg-care-purple hover:bg-care-light-purple text-white">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Contato
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle className="text-senior-lg">Adicionar Novo Contato</SheetTitle>
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
        <div className="flex items-start space-x-2 p-4 rounded-lg bg-amber-50 text-amber-800 mb-6">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <p className="text-senior">
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
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="text-senior-lg">Editar Contato</SheetTitle>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-senior">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteContact}
              className="bg-destructive hover:bg-destructive/90 text-senior"
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
