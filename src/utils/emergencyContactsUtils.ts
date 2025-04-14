
// Define o tipo para um contato de emergência
export interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
  relationship: string;
  isMainContact: boolean;
}

// Função para obter todos os contatos de emergência
export const getEmergencyContacts = (): EmergencyContact[] => {
  const contacts = localStorage.getItem('emergencyContacts');
  return contacts ? JSON.parse(contacts) : [];
};

// Função para salvar todos os contatos de emergência
export const saveEmergencyContacts = (contacts: EmergencyContact[]) => {
  localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  return true;
};

// Função para adicionar um novo contato de emergência
export const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>): EmergencyContact => {
  const contacts = getEmergencyContacts();
  
  // Se for marcado como contato principal, desmarca os outros
  if (contact.isMainContact) {
    contacts.forEach(c => {
      c.isMainContact = false;
    });
  }
  
  // Gera um ID único
  const newId = contacts.length > 0 
    ? Math.max(...contacts.map(c => c.id)) + 1 
    : 1;
  
  const newContact = {
    ...contact,
    id: newId
  };
  
  contacts.push(newContact);
  saveEmergencyContacts(contacts);
  
  return newContact;
};

// Função para atualizar um contato de emergência existente
export const updateEmergencyContact = (contact: EmergencyContact): boolean => {
  const contacts = getEmergencyContacts();
  const index = contacts.findIndex(c => c.id === contact.id);
  
  if (index === -1) {
    return false;
  }
  
  // Se for marcado como contato principal, desmarca os outros
  if (contact.isMainContact) {
    contacts.forEach(c => {
      if (c.id !== contact.id) {
        c.isMainContact = false;
      }
    });
  }
  
  contacts[index] = contact;
  return saveEmergencyContacts(contacts);
};

// Função para excluir um contato de emergência
export const deleteEmergencyContact = (id: number): boolean => {
  const contacts = getEmergencyContacts();
  const newContacts = contacts.filter(c => c.id !== id);
  
  if (newContacts.length === contacts.length) {
    return false;
  }
  
  return saveEmergencyContacts(newContacts);
};
