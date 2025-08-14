import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, differenceInDays, format, isSameDay, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data para o ano inteiro
const fullSalesData = [
  { date: new Date(2023, 0, 15), vendas: 32000, meta: 35000, leads: 120 },
  { date: new Date(2023, 1, 15), vendas: 28000, meta: 35000, leads: 98 },
  { date: new Date(2023, 2, 15), vendas: 41000, meta: 35000, leads: 145 },
  { date: new Date(2023, 3, 15), vendas: 38000, meta: 35000, leads: 132 },
  { date: new Date(2023, 4, 15), vendas: 45000, meta: 40000, leads: 156 },
  { date: new Date(2023, 5, 15), vendas: 52000, meta: 40000, leads: 178 },
  { date: new Date(2023, 6, 15), vendas: 49000, meta: 40000, leads: 163 },
  { date: new Date(2023, 7, 15), vendas: 55000, meta: 45000, leads: 182 },
  { date: new Date(2023, 8, 15), vendas: 59000, meta: 45000, leads: 195 },
  { date: new Date(2023, 9, 15), vendas: 63000, meta: 45000, leads: 210 },
  { date: new Date(2023, 10, 15), vendas: 67000, meta: 50000, leads: 223 },
  { date: new Date(2023, 11, 15), vendas: 72000, meta: 50000, leads: 240 },
  { date: new Date(2024, 0, 15), vendas: 68000, meta: 55000, leads: 225 },
  { date: new Date(2024, 1, 15), vendas: 65000, meta: 55000, leads: 215 },
  { date: new Date(2024, 2, 15), vendas: 73000, meta: 55000, leads: 242 },
  { date: new Date(2024, 3, 15), vendas: 77000, meta: 60000, leads: 255 },
  { date: new Date(2024, 4, 15), vendas: 82000, meta: 60000, leads: 272 },
  { date: new Date(2024, 5, 15), vendas: 87000, meta: 60000, leads: 290 },
];

// Dados diários para períodos curtos
const generateDailyData = (startDate: Date, endDate: Date) => {
  const days = differenceInDays(endDate, startDate) + 1;
  const dailyData = [];
  
  for (let i = 0; i < days; i++) {
    const currentDate = addDays(startDate, i);
    const baseValue = 1000 + Math.random() * 500;
    dailyData.push({
      date: currentDate,
      vendas: Math.round(baseValue * (1 + (i / days))),
      meta: 1500,
      leads: Math.round(baseValue / 30),
    });
  }
  
  return dailyData;
};

interface SalesChartProps {
  dateRange?: DateRange;
}

export function SalesChart({ dateRange }: SalesChartProps) {
  // Filtrar dados com base no período selecionado
  const getFilteredData = () => {
    if (!dateRange?.from || !dateRange?.to) {
      return fullSalesData.slice(-6); // Últimos 6 meses por padrão
    }
    
    const daysDiff = differenceInDays(dateRange.to, dateRange.from);
    
    // Para períodos curtos (menos de 60 dias), usar dados diários
    if (daysDiff < 60) {
      return generateDailyData(dateRange.from, dateRange.to);
    }
    
    // Para períodos mais longos, filtrar dos dados mensais
    return fullSalesData.filter(item => 
      isWithinInterval(item.date, { 
        start: dateRange.from, 
        end: dateRange.to 
      })
    );
  };
  
  const filteredData = getFilteredData();
  
  // Formatar data com base no período selecionado
  const formatDate = (date: Date) => {
    const daysDiff = dateRange?.from && dateRange?.to 
      ? differenceInDays(dateRange.to, dateRange.from) 
      : 180;
      
    if (daysDiff <= 31) {
      return format(date, "dd/MM", { locale: ptBR });
    } else if (daysDiff <= 365) {
      return format(date, "MMM", { locale: ptBR });
    } else {
      return format(date, "MMM/yy", { locale: ptBR });
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-100">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle>
              Evolução de Vendas
            </CardTitle>
            <CardDescription>
              Vendas vs Meta no período selecionado
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tickFormatter={(date) => formatDate(new Date(date))}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `R$ ${value/1000}k`}
            />
            <Tooltip 
              formatter={(value, name) => [
                `R$ ${Number(value).toLocaleString('pt-BR')}`, 
                name === 'vendas' ? 'Vendas' : 'Meta'
              ]}
              labelFormatter={(date) => format(new Date(date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
            />
            <Line 
              type="monotone" 
              dataKey="vendas" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', stroke: '#fff', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#10b981', stroke: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="meta" 
              stroke="#6b7280" 
              strokeWidth={2}
              strokeDasharray="8 8"
              dot={{ fill: '#6b7280', stroke: '#fff', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}