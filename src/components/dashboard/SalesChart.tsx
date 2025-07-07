import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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
        <CardTitle className="flex items-center gap-2">
          📈 Evolução de Vendas
        </CardTitle>
        <CardDescription>
          Vendas vs Meta nos últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" />
            <YAxis />
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
              dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="meta" 
              stroke="#6b7280" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}