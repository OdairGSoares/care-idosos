
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Star } from 'lucide-react';
import { EmergencyContact } from '@/utils/emergencyContactsUtils';

interface EmergencyContactListProps {
  contacts: EmergencyContact[];
  onEdit: (contact: EmergencyContact) => void;
  onDelete: (id: number) => void;
}

const EmergencyContactList = ({ contacts, onEdit, onDelete }: EmergencyContactListProps) => {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Relacionamento</TableHead>
            <TableHead>Status</TableHead>
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
              <TableCell className="text-senior">{contact.relationship}</TableCell>
              <TableCell>
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
                    onClick={() => onEdit(contact)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(contact.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
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
