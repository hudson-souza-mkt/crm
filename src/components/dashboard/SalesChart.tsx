import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
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
    <Card className="modern-card col-span-2 border-0 overflow-hidden">
      {/* Gradiente de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
      
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">
              Evolução de Vendas
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Vendas vs Meta nos últimos 6 meses
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="metaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20" stroke="#e5e7eb" />
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
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value, name) => [
                `R$ ${Number(value).toLocaleString('pt-BR')}`, 
                name === 'vendas' ? 'Vendas' : 'Meta'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="vendas" 
              stroke="url(#salesGradient)"
              strokeWidth={4}
              dot={{ fill: '#10b981', strokeWidth: 3, r: 6, stroke: '#fff' }}
              activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="meta" 
              stroke="url(#metaGradient)"
              strokeWidth={3}
              strokeDasharray="8 8"
              dot={{ fill: '#6b7280', strokeWidth: 2, r: 4, stroke: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}