
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

const EmergencyContactsPage = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<number | null>(null);

  // Carregar contatos ao inicializar
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    const loadedContacts = getEmergencyContacts();
    setContacts(loadedContacts);
  };

  const handleAddContact = (data: Omit<EmergencyContact, 'id'>) => {
    addEmergencyContact(data);
    loadContacts();
    setIsAddingContact(false);
    toast.success('Contato adicionado com sucesso!');
  };

  const handleEditContact = (data: Omit<EmergencyContact, 'id'>) => {
    if (editingContact) {
      updateEmergencyContact({ ...data, id: editingContact.id });
      loadContacts();
      setEditingContact(null);
      toast.success('Contato atualizado com sucesso!');
    }
  };

  const handleDeleteContact = () => {
    if (deletingContactId !== null) {
      deleteEmergencyContact(deletingContactId);
      loadContacts();
      setDeletingContactId(null);
      toast.success('Contato removido com sucesso!');
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
            <Button className="bg-care-purple hover:bg-care-light-purple text-senior">
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
