
import React, { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilterX, PlusCircle, Activity, Heart, Droplet, Scale, Thermometer } from 'lucide-react';
import { HealthData, HealthDataType } from '@/utils/healthDataUtils';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';

interface HealthDataChartProps {
  data: HealthData[];
  type: HealthDataType;
  onAddClick: (type: HealthDataType) => void;
}

const HealthDataChart: React.FC<HealthDataChartProps> = ({ data, type, onAddClick }) => {
  const chartData = useMemo(() => {
    return data.map(item => {
      const formattedDate = format(parseISO(item.date), 'dd/MM', { locale: ptBR });
      
      if (type === 'bloodPressure') {
        return {
          date: formattedDate,
          sistólica: Number(item.value),
          diastólica: item.secondaryValue,
          tooltipDate: format(parseISO(item.date), 'dd/MM/yyyy', { locale: ptBR })
        };
      }
      
      return {
        date: formattedDate,
        valor: Number(item.value),
        tooltipDate: format(parseISO(item.date), 'dd/MM/yyyy', { locale: ptBR })
      };
    }).sort((a, b) => {
      // Ordena por data (assumindo que a data esteja no formato dd/MM)
      const [aDay, aMonth] = a.date.split('/').map(Number);
      const [bDay, bMonth] = b.date.split('/').map(Number);
      if (aMonth !== bMonth) return aMonth - bMonth;
      return aDay - bDay;
    });
  }, [data, type]);

  const getChartConfig = () => {
    switch (type) {
      case 'bloodPressure':
        return {
          title: 'Pressão Arterial',
          unit: 'mmHg',
          color1: '#2563eb', // Azul para sistólica
          color2: '#7c3aed', // Roxo para diastólica
          icon: <Activity className="h-5 w-5" />,
        };
      case 'heartRate':
        return {
          title: 'Frequência Cardíaca',
          unit: 'BPM',
          color1: '#ef4444', // Vermelho para batimentos
          icon: <Heart className="h-5 w-5" />,
        };
      case 'glucose':
        return {
          title: 'Nível de Glicose',
          unit: 'mg/dL',
          color1: '#f97316', // Laranja para glicose
          icon: <Droplet className="h-5 w-5" />,
        };
      case 'weight':
        return {
          title: 'Peso',
          unit: 'kg',
          color1: '#10b981', // Verde para peso
          icon: <Scale className="h-5 w-5" />,
        };
      case 'temperature':
        return {
          title: 'Temperatura',
          unit: '°C',
          color1: '#f43f5e', // Rosa para temperatura
          icon: <Thermometer className="h-5 w-5" />,
        };
      default:
        return {
          title: 'Medição',
          unit: '',
          color1: '#3b82f6',
          icon: <Activity className="h-5 w-5" />,
        };
    }
  };

  const config = getChartConfig();

  const chartConfig = {
    primary: { theme: { light: config.color1, dark: config.color1 } },
    secondary: { theme: { light: config.color2, dark: config.color2 } },
  };

  if (data.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            {config.icon}
            <CardTitle className="ml-2 text-xl">{config.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="py-6">
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <FilterX className="h-10 w-10 text-muted-foreground mb-3" />
            <CardDescription className="mx-auto max-w-sm text-center">
              Nenhum dado registrado para {config.title.toLowerCase()}.
            </CardDescription>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => onAddClick(type)} 
            className="w-full"
            variant="outline"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Medição
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mb-6 overflow-x-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          {config.icon}
          <CardTitle className="ml-2 text-xl">{config.title}</CardTitle>
        </div>
        <CardDescription>Últimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis unit={` ${config.unit}`} allowDecimals={type === 'weight' || type === 'temperature'} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value, name, props) => [`${value} ${config.unit}`, name]} />} />
                {type === 'bloodPressure' ? (
                  <>
                    <Line type="monotone" dataKey="sistólica" name="Sistólica" stroke={config.color1} activeDot={{ r: 8 }} strokeWidth={2} />
                    <Line type="monotone" dataKey="diastólica" name="Diastólica" stroke={config.color2} activeDot={{ r: 8 }} strokeWidth={2} />
                  </>
                ) : (
                  <Line type="monotone" dataKey="valor" name={config.title} stroke={config.color1} activeDot={{ r: 8 }} strokeWidth={2} />
                )}
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onAddClick(type)} 
          className="w-full"
          variant="outline"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Nova Medição
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HealthDataChart;
