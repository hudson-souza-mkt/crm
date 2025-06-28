import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Google Ads', value: 400 },
  { name: 'Facebook Ads', value: 300 },
  { name: 'Indicação', value: 300 },
  { name: 'Site', value: 200 },
];

const COLORS = ['#E63946', '#FF6B6B', '#2E2E2E', '#F5F5F5'];

const LeadsBySourceChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Negócios por Fonte</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadsBySourceChart;