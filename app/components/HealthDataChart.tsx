
import React, { useMemo, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilterX, PlusCircle, Activity, Heart, Droplet, Scale, Thermometer } from 'lucide-react';
import { HealthData, HealthDataType } from '@/utils/healthDataUtils';

// Importação dinâmica do ApexCharts para evitar problemas de SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface HealthDataChartProps {
  data: HealthData[];
  type: HealthDataType;
  onAddClick: (type: HealthDataType) => void;
}

// Interfaces para dados processados
interface BloodPressureData {
  date: string;
  sistólica: number;
  diastólica: number | null;
  tooltipDate: string;
  originalDate: string;
}

interface OtherHealthData {
  date: string;
  valor: number;
  tooltipDate: string;
  originalDate: string;
}

type ProcessedHealthData = BloodPressureData | OtherHealthData;

const HealthDataChart: React.FC<HealthDataChartProps> = ({ data, type, onAddClick }) => {
  console.log(`📊 [HealthDataChart] Renderizando gráfico para ${type}:`, data);
  console.log(`📊 [HealthDataChart] Tipo de dados:`, typeof data, 'Array?', Array.isArray(data));
  console.log(`📊 [HealthDataChart] Primeiro item:`, data?.[0]);
  
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      console.log(`📊 [HealthDataChart] Nenhum dado para ${type}`);
      return [];
    }
    
    console.log(`📊 [HealthDataChart] Processando ${data.length} itens para ${type}`);
    
    const processedData = data
      .filter(item => {
        // Validar se o item tem a estrutura correta
        console.log(`📊 [HealthDataChart] Validando item:`, item);
        if (!item.date || !item.value) {
          console.warn(`📊 [HealthDataChart] Item inválido para ${type}:`, item);
          return false;
        }
        return true;
      })
      .map(item => {
        try {
          console.log(`📊 [HealthDataChart] Processando item:`, item);
          const formattedDate = format(parseISO(item.date), 'dd/MM', { locale: ptBR });
          
          // Garantir que o valor seja um número
          const numericValue = typeof item.value === 'string' ? parseFloat(item.value) : Number(item.value);
          const numericSecondaryValue = item.secondaryValue ? 
            (typeof item.secondaryValue === 'string' ? parseFloat(item.secondaryValue) : Number(item.secondaryValue)) : 
            null;
          
          if (type === 'bloodPressure') {
            const processed: BloodPressureData = {
              date: formattedDate,
              sistólica: numericValue,
              diastólica: numericSecondaryValue,
              tooltipDate: format(parseISO(item.date), 'dd/MM/yyyy', { locale: ptBR }),
              originalDate: item.date
            };
            console.log(`📊 [HealthDataChart] Item processado (pressão):`, processed);
            return processed;
          }
          
          const processed: OtherHealthData = {
            date: formattedDate,
            valor: numericValue,
            tooltipDate: format(parseISO(item.date), 'dd/MM/yyyy', { locale: ptBR }),
            originalDate: item.date
          };
          console.log(`📊 [HealthDataChart] Item processado (outros):`, processed);
          return processed;
        } catch (error) {
          console.error(`📊 [HealthDataChart] Erro ao processar item para ${type}:`, item, error);
          return null;
        }
      })
      .filter((item): item is ProcessedHealthData => item !== null) // Remove itens null
      .sort((a, b) => {
        // Ordena por data original para garantir ordem cronológica
        return new Date(a.originalDate).getTime() - new Date(b.originalDate).getTime();
      });
    
    console.log(`📊 [HealthDataChart] Dados processados para ${type}:`, processedData);
    return processedData;
  }, [data, type]);

  // Logs de debug para renderização
  useEffect(() => {
    console.log(`📊 [HealthDataChart] Renderizando gráfico com ${chartData.length} dados para ${type}`);
    console.log(`📊 [HealthDataChart] Dados finais:`, chartData);
  }, [chartData, type]);

  const getChartConfig = () => {
    switch (type) {
      case 'bloodPressure':
        return {
          title: 'Pressão Arterial',
          unit: 'mmHg',
          color1: '#2563eb', // Azul para sistólica
          color2: '#7c3aed', // Roxo para diastólica
          icon: <Activity className="h-5 w-5 text-care-purple" />,
          minValue: 60,
          maxValue: 200,
        };
      case 'heartRate':
        return {
          title: 'Frequência Cardíaca',
          unit: 'BPM',
          color1: '#ef4444', // Vermelho para batimentos
          icon: <Heart className="h-5 w-5 text-care-purple" />,
          minValue: 40,
          maxValue: 200,
        };
      case 'glucose':
        return {
          title: 'Nível de Glicose',
          unit: 'mg/dL',
          color1: '#f97316', // Laranja para glicose
          icon: <Droplet className="h-5 w-5 text-care-purple" />,
          minValue: 50,
          maxValue: 400,
        };
      case 'weight':
        return {
          title: 'Peso',
          unit: 'kg',
          color1: '#10b981', // Verde para peso
          icon: <Scale className="h-5 w-5 text-care-purple" />,
          minValue: 30,
          maxValue: 200,
        };
      case 'temperature':
        return {
          title: 'Temperatura',
          unit: '°C',
          color1: '#f43f5e', // Rosa para temperatura
          icon: <Thermometer className="h-5 w-5 text-care-purple" />,
          minValue: 35,
          maxValue: 42,
        };
      default:
        return {
          title: 'Medição',
          unit: '',
          color1: '#3b82f6',
          icon: <Activity className="h-5 w-5 text-care-purple" />,
          minValue: 0,
          maxValue: 100,
        };
    }
  };

  const config = getChartConfig();

  // Dados do gráfico
  const chartSeries = useMemo(() => {
    if (type === 'bloodPressure') {
      const bloodPressureData = chartData.filter((item): item is BloodPressureData => 'sistólica' in item);
      return [
        {
          name: 'Sistólica',
          data: bloodPressureData.map(item => item.sistólica),
        },
        {
          name: 'Diastólica',
          data: bloodPressureData.map(item => item.diastólica).filter(val => val !== null),
        },
      ];
    } else {
      const otherData = chartData.filter((item): item is OtherHealthData => 'valor' in item);
      return [
        {
          name: config.title,
          data: otherData.map(item => item.valor),
        },
      ];
    }
  }, [chartData, type, config.title]);

  // Configuração do ApexCharts
  const chartOptions = useMemo(() => {
    const baseOptions = {
      chart: {
        type: 'line' as const,
        height: 300,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          }
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
        background: 'transparent',
      },
      stroke: {
        curve: 'smooth' as const,
        width: 3,
      },
      grid: {
        borderColor: '#e2e8f0',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        type: 'category' as const,
        categories: chartData.map(item => item.date),
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '12px',
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          formatter: (value: number) => `${value} ${config.unit}`,
          style: {
            colors: '#64748b',
            fontSize: '12px',
          },
        },
        min: config.minValue,
        max: config.maxValue,
      },
      tooltip: {
        enabled: true,
        theme: 'light',
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: (value: number) => `${value} ${config.unit}`,
        },
        custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
          const item = chartData[dataPointIndex];
          if (!item) return '';
          
          let tooltipContent = `<div class="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">`;
          tooltipContent += `<div class="font-medium text-care-purple mb-2">${item.tooltipDate}</div>`;
          
          if (type === 'bloodPressure' && 'sistólica' in item) {
            tooltipContent += `<div class="text-sm" style="color: ${config.color1}">Sistólica: ${item.sistólica} ${config.unit}</div>`;
            if (item.diastólica) {
              tooltipContent += `<div class="text-sm" style="color: ${config.color2}">Diastólica: ${item.diastólica} ${config.unit}</div>`;
            }
          } else if ('valor' in item) {
            tooltipContent += `<div class="text-sm" style="color: ${config.color1}">${config.title}: ${item.valor} ${config.unit}</div>`;
          }
          
          tooltipContent += `</div>`;
          return tooltipContent;
        }
      },
      legend: {
        show: true,
        position: 'top' as const,
        horizontalAlign: 'right' as const,
        fontSize: '12px',
      },
      colors: type === 'bloodPressure' ? [config.color1, config.color2] : [config.color1],
      markers: {
        size: 6,
        strokeWidth: 2,
        strokeColors: '#ffffff',
        fillColors: type === 'bloodPressure' ? [config.color1, config.color2] : [config.color1],
        hover: {
          size: 8,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.1,
          gradientToColors: [config.color1],
          inverseColors: false,
          opacityFrom: 0.3,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
    };

    return baseOptions;
  }, [chartData, type, config]);

  if (data.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            {config.icon}
            <CardTitle className="ml-2 text-xl text-care-purple">{config.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="py-6">
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <FilterX className="h-10 w-10 text-muted-foreground mb-3" />
            <CardDescription className="mx-auto max-w-sm text-center text-care-purple">
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

  // Se não há dados processados suficientes, mostrar mensagem
  if (chartData.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            {config.icon}
            <CardTitle className="ml-2 text-xl text-care-purple">{config.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="py-6">
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <FilterX className="h-10 w-10 text-muted-foreground mb-3" />
            <CardDescription className="mx-auto max-w-sm text-center text-care-purple">
              Dados inválidos para {config.title.toLowerCase()}. Adicione medições válidas.
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
    <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            {config.icon}
            <CardTitle className="ml-2 text-xl text-care-purple">{config.title}</CardTitle>
          </div>
          <CardDescription className="text-care-purple">
            {data.length} registro{data.length !== 1 ? 's' : ''} • Últimos 30 dias
          </CardDescription>
        </CardHeader>
      <CardContent>
        <div className="w-full">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={300}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onAddClick(type)} 
          className="w-full text-care-purple"
          variant="outline"
        >
          <PlusCircle className="h-4 w-4 text-care-purple" />
          Adicionar Nova Medição
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HealthDataChart;
