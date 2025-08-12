import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Columns, 
  Users, 
  MessageSquare, 
  Calendar,
  Bot,
  Target,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  // Redirecionar automaticamente para o dashboard após um tempo
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const features = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      description: "Visão geral completa do seu negócio",
      path: "/dashboard",
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: Columns,
      title: "Pipelines",
      description: "Gerencie seu funil de vendas",
      path: "/pipelines",
      color: "text-purple-600 bg-purple-50"
    },
    {
      icon: Users,
      title: "Leads",
      description: "Organize seus leads e clientes",
      path: "/leads",
      color: "text-green-600 bg-green-50"
    },
    {
      icon: Calendar,
      title: "Agenda",
      description: "Calendário e agendamentos",
      path: "/calendar",
      color: "text-orange-600 bg-orange-50"
    },
    {
      icon: MessageSquare,
      title: "Atendimentos",
      description: "Chat e comunicação",
      path: "/chat",
      color: "text-cyan-600 bg-cyan-50"
    },
    {
      icon: Bot,
      title: "Automações",
      description: "Automatize processos",
      path: "/automations",
      color: "text-indigo-600 bg-indigo-50"
    }
  ];

  const stats = [
    { label: "Leads Ativos", value: "1,234", icon: Users, trend: "+12%" },
    { label: "Taxa de Conversão", value: "23.5%", icon: TrendingUp, trend: "+5.2%" },
    { label: "Agendamentos Hoje", value: "8", icon: Clock, trend: "+2" },
    { label: "Tarefas Concluídas", value: "15", icon: CheckCircle, trend: "+3" }
  ];

  return (
    <div className="min-h-[calc(100vh-theme(spacing.16))] bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bem-vindo ao Space Sales
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Sua plataforma completa de CRM e automação de vendas
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              Ir para Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/pipelines")}
            >
              Ver Pipelines
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.trend}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <stat.icon className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => navigate(feature.path)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
                <div className="flex items-center mt-4 text-primary group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium">Acessar</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades mais utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-16 flex-col gap-2"
                onClick={() => navigate("/leads")}
              >
                <Users className="h-5 w-5" />
                <span>Adicionar Lead</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col gap-2"
                onClick={() => navigate("/calendar")}
              >
                <Calendar className="h-5 w-5" />
                <span>Agendar Reunião</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col gap-2"
                onClick={() => navigate("/pipelines")}
              >
                <Columns className="h-5 w-5" />
                <span>Ver Pipeline</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Auto redirect notice */}
        <div className="text-center text-sm text-gray-500">
          <p>Você será redirecionado automaticamente para o dashboard em alguns segundos...</p>
        </div>
      </div>
    </div>
  );
}