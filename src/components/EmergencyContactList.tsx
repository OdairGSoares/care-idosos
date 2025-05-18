
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Star, PhoneCall, Loader2 } from 'lucide-react';
import { EmergencyContact, deleteEmergencyContact } from '@/utils/emergencyContactsUtils';
import { toast } from 'sonner';

interface EmergencyContactListProps {
  contacts: EmergencyContact[];
  onEdit: (contact: EmergencyContact) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

const EmergencyContactList = ({ contacts, onEdit, onDelete, isLoading }: EmergencyContactListProps) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Function to handle calling a contact
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Function to handle delete with loading state
  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este contato?")) {
      setDeletingId(id);
      try {
        const success = await deleteEmergencyContact(id);
        if (success) {
          onDelete(id);
          toast.success("Contato excluído com sucesso");
        }
      } catch (error) {
        console.error("Erro ao excluir contato:", error);
        toast.error("Erro ao excluir contato");
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-care-purple" />
        <p className="mt-2 text-gray-500">Carregando contatos...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md bg-muted/20">
        <div className="mb-4 rounded-full bg-care-light-purple p-4">
          <Star className="h-8 w-8 text-care-purple" />
        </div>
        <h3 className="text-xl font-medium mb-2">Nenhum contato cadastrado</h3>
        <p className="text-gray-500 mb-4 max-w-md">
          Adicione contatos de emergência para que possamos entrar em contato com alguém caso seja necessário.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead className="hidden md:table-cell">Relacionamento</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium text-senior">
                {contact.name}
              </TableCell>
              <TableCell className="text-senior">{contact.phone}</TableCell>
              <TableCell className="hidden md:table-cell text-senior">{contact.relationship}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {contact.isMainContact && (
                  <Badge className="bg-care-purple hover:bg-care-light-purple">
                    <Star className="h-3 w-3 mr-1" />
                    Principal
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCall(contact.phone)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    title="Ligar para contato"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span className="sr-only">Ligar</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(contact)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(contact.id)}
                    disabled={deletingId === contact.id}
                    className="text-destructive hover:text-destructive"
                  >
                    {deletingId === contact.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span className="sr-only">Excluir</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmergencyContactList;
