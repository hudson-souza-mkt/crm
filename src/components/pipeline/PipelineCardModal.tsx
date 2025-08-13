import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Phone, 
  Mail, 
  Building, 
  DollarSign, 
  Calendar,
  Target,
  Clock,
  Activity,
  FileText
} from "lucide-react";
import type { Lead } from "@/components/pipeline/PipelineCard";

interface PipelineCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onStageChange?: (leadId: string, newStage: string) => void;
  onLeadUpdate?: (leadId: string, updates: Partial<Lead>) => void;
}

export function PipelineCardModal({
  open,
  onOpenChange,
  lead,
  onStageChange,
  onLeadUpdate
}: PipelineCardModalProps) {
  const formatCurrency = (value?: number) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Não informado";
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch {
      return "Data inválida";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lead.name}
            <Badge variant="outline">
              {lead.stage}
            </Badge>
            {lead.value && (
              <Badge variant="secondary">
                {formatCurrency(lead.value)}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Informações do Negócio
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Atividades
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Arquivos
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="info" className="mt-0 h-full">
              {/* SUBSTITUINDO O ELEMENTO PROBLEMÁTICO */}
              <div className="p-6 space-y-6">
                {/* Header de Confirmação */}
                <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg">
                  <h1 className="text-2xl font-bold text-green-800">
                    ✅ INFORMAÇÕES DO NEGÓCIO CARREGADAS!
                  </h1>
                  <p className="text-green-700">
                    Substituindo o elemento que mostrava "Nenhuma informação do negócio."
                  </p>
                </div>

                {/* Métricas Principais */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                          <p className="text-2xl font-bold text-green-600">{formatCurrency(lead.value)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Etapa Atual</p>
                          <p className="text-xl font-bold text-blue-600">{lead.stage}</p>
                        </div>
                        <Target className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Origem</p>
                          <p className="text-lg font-bold text-purple-600">{lead.source || 'Manual'}</p>
                        </div>
                        <Activity className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-amber-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Status</p>
                          <p className="text-lg font-bold text-amber-600">{lead.status || 'Ativo'}</p>
                        </div>
                        <Clock className="h-8 w-8 text-amber-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Informações do Cliente */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informações do Cliente
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                        <p className="text-lg font-semibold">{lead.name}</p>
                      </div>

                      {lead.company && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Empresa</label>
                          <p className="text-sm flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            {lead.company}
                          </p>
                        </div>
                      )}

                      {lead.phone && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                          <p className="text-sm flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {lead.phone}
                          </p>
                        </div>
                      )}

                      {lead.email && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          <p className="text-sm flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {lead.email}
                          </p>
                        </div>
                      )}

                      {lead.assignedTo && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Responsável</label>
                          <p className="text-sm">{lead.assignedTo}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Detalhes do Negócio */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Detalhes do Negócio
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Valor do Negócio</label>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(lead.value)}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Etapa Atual</label>
                        <Badge variant="outline" className="ml-2 text-lg px-3 py-1">
                          {lead.stage}
                        </Badge>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <p className="text-sm">{lead.status || "Ativo"}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Origem</label>
                        <p className="text-sm">{lead.source || "Manual"}</p>
                      </div>

                      {lead.funnel && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Funil</label>
                          <p className="text-sm">{lead.funnel}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Datas Importantes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Datas Importantes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                        <p className="text-sm font-semibold">{formatDate(lead.createdAt)}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Última atualização</label>
                        <p className="text-sm font-semibold">{formatDate(lead.updatedAt)}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Último contato</label>
                        <p className="text-sm font-semibold">{formatDate(lead.lastContact)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags e Observações */}
                {(lead.tags?.length > 0 || lead.notes) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags e Observações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {lead.tags && lead.tags.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Tags</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {lead.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {lead.notes && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Observações</label>
                          <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm">{lead.notes}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Ações */}
                {onStageChange && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Ações Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => console.log('Voltar etapa clicado')}
                        >
                          Voltar Etapa
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => console.log('Avançar etapa clicado')}
                        >
                          Avançar Etapa
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0 h-full">
              <div className="p-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Histórico de mudanças do lead...</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activities" className="mt-0 h-full">
              <div className="p-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Atividades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Lista de atividades...</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="files" className="mt-0 h-full">
              <div className="p-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Arquivos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Arquivos anexados...</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}