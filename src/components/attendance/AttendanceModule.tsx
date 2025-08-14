import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AttendanceChat } from "./AttendanceChat";
import { 
  User, 
  MessageSquare, 
  Clock, 
  Calendar, 
  BarChart, 
  Users,
  ArrowLeftRight
} from "lucide-react";

// Dados fictícios para simulação
const MOCK_ATTENDANCES = [
  {
    id: "atd-1",
    customer: {
      id: "cust-1",
      name: "João Silva",
      email: "joao.silva@example.com",
      phone: "(11) 98765-4321",
      company: "TechSolutions",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    startedAt: new Date(),
    status: "active",
    channel: "whatsapp",
    tags: ["lead", "plano_professional"],
    priority: "medium"
  },
  {
    id: "atd-2",
    customer: {
      id: "cust-2",
      name: "Maria Santos",
      email: "maria.santos@example.com",
      phone: "(21) 97654-3210",
      company: "InnovateDesign",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    startedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutos atrás
    status: "waiting",
    channel: "webchat",
    tags: ["suporte", "implementacao"],
    priority: "high"
  },
  {
    id: "atd-3",
    customer: {
      id: "cust-3",
      name: "Carlos Oliveira",
      email: "carlos.oliveira@example.com",
      phone: "(31) 98765-1234",
      company: "GlobalLogistics",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    startedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    status: "waiting",
    channel: "email",
    tags: ["proposta", "enterprise"],
    priority: "medium"
  }
];

// Dados do atendente
const CURRENT_ATTENDANT = {
  id: "att-1",
  name: "Rafael Costa",
  email: "rafael.costa@empresa.com",
  avatar: "https://randomuser.me/api/portraits/men/42.jpg",
  department: "Vendas",
  status: "online"
};

// Dados de métricas
const ATTENDANCE_METRICS = {
  today: {
    total: 15,
    waiting: 2,
    active: 3,
    resolved: 10,
    avgResponseTime: "1m 30s",
    avgResolutionTime: "12m 45s",
    satisfaction: 4.8
  },
  week: {
    total: 78,
    waiting: 5,
    active: 8,
    resolved: 65,
    avgResponseTime: "1m 45s",
    avgResolutionTime: "14m 20s",
    satisfaction: 4.6
  }
};

export function AttendanceModule() {
  const [activeAttendance, setActiveAttendance] = useState(MOCK_ATTENDANCES[0]);
  const [tab, setTab] = useState("attendances");

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Atendimentos</h1>
          <p className="text-muted-foreground">
            Gerencie seus atendimentos e use agentes de IA para automatizar processos
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            <Clock className="h-4 w-4 inline mr-1" />
            {new Date().toLocaleDateString()}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{CURRENT_ATTENDANT.name}</span>
            <span className="h-2 w-2 rounded-full bg-green-500" />
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendances" className="gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Atendimentos</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1">
            <Calendar className="h-4 w-4" />
            <span>Histórico</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1">
            <BarChart className="h-4 w-4" />
            <span>Análises</span>
          </TabsTrigger>
          <TabsTrigger value="agents" className="gap-1">
            <ArrowLeftRight className="h-4 w-4" />
            <span>Integrações IA</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendances" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Lista de atendimentos */}
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Atendimentos Ativos</CardTitle>
                  <CardDescription>
                    {MOCK_ATTENDANCES.filter(a => a.status === "active").length} ativos,{" "}
                    {MOCK_ATTENDANCES.filter(a => a.status === "waiting").length} aguardando
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {MOCK_ATTENDANCES.map((attendance) => (
                    <Button
                      key={attendance.id}
                      variant={activeAttendance.id === attendance.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setActiveAttendance(attendance)}
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium text-sm">
                            {attendance.customer.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {attendance.channel} • {getTimeAgo(attendance.startedAt)}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Métricas de Hoje</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-medium">{ATTENDANCE_METRICS.today.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Resolvidos</span>
                    <span className="font-medium">{ATTENDANCE_METRICS.today.resolved}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tempo médio</span>
                    <span className="font-medium">{ATTENDANCE_METRICS.today.avgResolutionTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Satisfação</span>
                    <span className="font-medium">{ATTENDANCE_METRICS.today.satisfaction}★</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat do atendimento */}
            <div className="md:col-span-3">
              <AttendanceChat
                attendanceId={activeAttendance.id}
                customer={activeAttendance.customer}
                attendant={CURRENT_ATTENDANT}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Atendimentos</CardTitle>
              <CardDescription>
                Visualize e filtre atendimentos anteriores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Histórico de Atendimentos</h3>
                <p>
                  Visualize e filtre todos os atendimentos realizados anteriormente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Desempenho</CardTitle>
              <CardDescription>
                Métricas e indicadores de performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Análises de Atendimento</h3>
                <p>
                  Visualize métricas de desempenho, tempos de resposta e satisfação.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents">
          <Card>
            <CardHeader>
              <CardTitle>Integrações com Agentes de IA</CardTitle>
              <CardDescription>
                Configure como os agentes de IA são utilizados nos atendimentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Configurações de Integração</h3>
                <p>
                  Defina quando e como os agentes de IA participam dos atendimentos.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Função auxiliar para calcular tempo decorrido
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s atrás`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m atrás`;
  
  const hours = Math.floor(minutes / 60);
  return `${hours}h atrás`;
}