import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Calendar, 
  Tag, 
  User, 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  BarChart, 
  AlertTriangle,
  Info,
  UserCheck,
} from "lucide-react";
import type { Deal } from "./DealInfo";

interface DealDetailsProps {
  deal: Deal;
}

const DetailItem = ({ icon: Icon, label, value, children }: { icon: React.ElementType, label: string, value?: string | React.ReactNode, children?: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <Icon className="h-5 w-5 text-muted-foreground mt-1" />
    <div className="flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      {value && <p className="font-medium">{value}</p>}
      {children}
    </div>
  </div>
);

export function DealDetails({ deal }: DealDetailsProps) {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getPriorityBadge = (priority?: 'red' | 'green') => {
    if (!priority) return null;
    const styles = {
      green: "bg-green-100 text-green-800",
      red: "bg-red-100 text-red-800",
    };
    const labels = {
      green: "Normal",
      red: "Urgente",
    };
    return <Badge className={styles[priority]}>{labels[priority]}</Badge>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna Principal */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Informações Principais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem icon={DollarSign} label="Valor do Negócio" value={formatCurrency(deal.value || 0)} />
            <DetailItem icon={BarChart} label="Etapa do Funil" value={deal.stage} />
            <DetailItem icon={Calendar} label="Data de Criação" value={deal.date} />
            <DetailItem icon={UserCheck} label="Vendedor Responsável" value={deal.salesperson} />
            <DetailItem icon={AlertTriangle} label="Prioridade">
              {getPriorityBadge(deal.priority)}
            </DetailItem>
            <DetailItem icon={Tag} label="Tags">
              <div className="flex flex-wrap gap-2">
                {deal.tags?.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </DetailItem>
          </CardContent>
        </Card>
      </div>

      {/* Coluna Lateral */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contato Principal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem icon={User} label="Nome" value={deal.name} />
            <DetailItem icon={Phone} label="Telefone" value={deal.phone} />
            <DetailItem icon={Info} label="Documento" value={deal.document} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem icon={Building} label="Nome" value={deal.company} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}