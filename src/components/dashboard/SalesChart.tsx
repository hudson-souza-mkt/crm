import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";

const salesData = [
  { month: 'Jan', vendas: 32000, meta: 35000, leads: 120 },
  { month: 'Fev', vendas: 28000, meta: 35000, leads: 98 },
  { month: 'Mar', vendas: 41000, meta: 35000, leads: 145 },
  { month: 'Abr', vendas: 38000, meta: 35000, leads: 132 },
  { month: 'Mai', vendas: 45000, meta: 35000, leads: 156 },
  { month: 'Jun', vendas: 52000, meta: 35000, leads: 178 },
];

export function SalesChart() {
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
              Vendas vs Meta nos últimos 6 meses
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value, name) => [
                `R$ ${Number(value).toLocaleString('pt-BR')}`, 
                name === 'vendas' ? 'Vendas' : 'Meta'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="vendas" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', stroke: '#fff', strokeWidth: 2, r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="meta" 
              stroke="#6b7280" 
              strokeWidth={2}
              strokeDasharray="8 8"
              dot={{ fill: '#6b7280', stroke: '#fff', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}