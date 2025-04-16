
import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, FileText } from 'lucide-react';
import { HealthData, HealthDataType, deleteHealthData } from '@/utils/healthDataUtils';
import { toast } from 'sonner';

interface HealthDataHistoryProps {
  data: HealthData[];
  type: HealthDataType;
  onDataChange: () => void;
}

const HealthDataHistory = ({ data, type, onDataChange }: HealthDataHistoryProps) => {
  const sortedData = [...data].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      deleteHealthData(id);
      toast.success("Registro excluído com sucesso!");
      onDataChange();
    }
  };

  const getTypeLabel = (type: HealthDataType) => {
    switch (type) {
      case 'bloodPressure': return 'Pressão Arterial';
      case 'heartRate': return 'Frequência Cardíaca';
      case 'glucose': return 'Nível de Glicose';
      case 'weight': return 'Peso';
      case 'temperature': return 'Temperatura';
      default: return 'Medição';
    }
  };

  const getValueWithUnit = (data: HealthData) => {
    switch (data.type) {
      case 'bloodPressure':
        return `${data.value}/${data.secondaryValue} mmHg`;
      case 'heartRate':
        return `${data.value} BPM`;
      case 'glucose':
        return `${data.value} mg/dL`;
      case 'weight':
        return `${data.value} kg`;
      case 'temperature':
        return `${data.value} °C`;
      default:
        return data.value;
    }
  };

  if (sortedData.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6 overflow-hidden">
      <CardHeader>
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          <CardTitle className="text-lg">Histórico de {getTypeLabel(type)}</CardTitle>
        </div>
        <CardDescription className="hidden sm:block">Registros ordenados por data (mais recente primeiro)</CardDescription>
      </CardHeader>
      <CardContent className="px-1 sm:px-6">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Data</TableHead>
                <TableHead className="whitespace-nowrap">Valor</TableHead>
                <TableHead className="hidden sm:table-cell">Observações</TableHead>
                <TableHead className="text-right w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(parseISO(item.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">{getValueWithUnit(item)}</TableCell>
                  <TableCell className="hidden sm:table-cell max-w-[200px] truncate">{item.notes || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthDataHistory;
