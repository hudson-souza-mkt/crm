import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import type { Invoice } from "@/types/billing";

export function InvoiceHistory() {
  const [invoices] = useState<Invoice[]>([
    {
      id: "inv-001",
      planId: "professional",
      planName: "Professional",
      amount: 297,
      currency: "BRL",
      status: "paid",
      issueDate: new Date("2024-01-01"),
      dueDate: new Date("2024-01-15"),
      paidDate: new Date("2024-01-10"),
      paymentMethod: "Cartão •••• 4242",
      downloadUrl: "/invoices/inv-001.pdf"
    },
    {
      id: "inv-002",
      planId: "professional",
      planName: "Professional",
      amount: 297,
      currency: "BRL",
      status: "paid",
      issueDate: new Date("2024-02-01"),
      dueDate: new Date("2024-02-15"),
      paidDate: new Date("2024-02-08"),
      paymentMethod: "Cartão •••• 4242",
      downloadUrl: "/invoices/inv-002.pdf"
    },
    {
      id: "inv-003",
      planId: "professional",
      planName: "Professional",
      amount: 297,
      currency: "BRL",
      status: "pending",
      issueDate: new Date("2024-03-01"),
      dueDate: new Date("2024-03-15"),
      paymentMethod: "Cartão •••• 4242"
    },
    {
      id: "inv-004",
      planId: "starter",
      planName: "Starter",
      amount: 97,
      currency: "BRL",
      status: "failed",
      issueDate: new Date("2023-12-01"),
      dueDate: new Date("2023-12-15"),
      paymentMethod: "Cartão •••• 5555"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const getStatusIcon = (status: Invoice["status"]) => {
    switch (status) {
      case "paid": return CheckCircle;
      case "pending": return Clock;
      case "failed": return XCircle;
      case "cancelled": return AlertTriangle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid": return "text-green-600 bg-green-50 border-green-200";
      case "pending": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "failed": return "text-red-600 bg-red-50 border-red-200";
      case "cancelled": return "text-gray-600 bg-gray-50 border-gray-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusLabel = (status: Invoice["status"]) => {
    switch (status) {
      case "paid": return "Pago";
      case "pending": return "Pendente";
      case "failed": return "Falhou";
      case "cancelled": return "Cancelado";
      default: return "Desconhecido";
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const now = new Date();
      const invoiceDate = invoice.issueDate;
      
      switch (dateFilter) {
        case "last30":
          matchesDate = (now.getTime() - invoiceDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
          break;
        case "last90":
          matchesDate = (now.getTime() - invoiceDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
          break;
        case "thisYear":
          matchesDate = invoiceDate.getFullYear() === now.getFullYear();
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleDownload = (invoice: Invoice) => {
    if (invoice.downloadUrl) {
      // Simular download
      console.log(`Downloading invoice ${invoice.id}`);
    }
  };

  const handleRetryPayment = (invoice: Invoice) => {
    console.log(`Retrying payment for invoice ${invoice.id}`);
  };

  const totalPaid = invoices
    .filter(inv => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingAmount = invoices
    .filter(inv => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Histórico de Faturas</h2>
          <p className="text-muted-foreground">
            Visualize e gerencie todas as suas faturas
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Baixar Todas
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pago</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalPaid.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  R$ {pendingAmount.toFixed(2)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Faturas</p>
                <p className="text-2xl font-bold">{invoices.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Última Fatura</p>
                <p className="text-2xl font-bold">
                  {invoices[0]?.issueDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID ou plano..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os períodos</SelectItem>
                <SelectItem value="last30">Últimos 30 dias</SelectItem>
                <SelectItem value="last90">Últimos 90 dias</SelectItem>
                <SelectItem value="thisYear">Este ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Faturas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Faturas</CardTitle>
          <CardDescription>
            {filteredInvoices.length} de {invoices.length} faturas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fatura</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Emissão</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => {
                  const StatusIcon = getStatusIcon(invoice.status);
                  
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.planName}</div>
                          <div className="text-sm text-muted-foreground">
                            {invoice.planId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          R$ {invoice.amount.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(invoice.status)}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {getStatusLabel(invoice.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {invoice.issueDate.toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className={
                          invoice.status === "pending" && invoice.dueDate < new Date()
                            ? "text-red-600 font-medium"
                            : ""
                        }>
                          {invoice.dueDate.toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {invoice.paidDate && (
                            <div className="text-sm">
                              {invoice.paidDate.toLocaleDateString('pt-BR')}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {invoice.paymentMethod}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => console.log(`View ${invoice.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            {invoice.downloadUrl && (
                              <DropdownMenuItem onClick={() => handleDownload(invoice)}>
                                <Download className="mr-2 h-4 w-4" />
                                Baixar PDF
                              </DropdownMenuItem>
                            )}
                            {invoice.status === "failed" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleRetryPayment(invoice)}>
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Tentar Novamente
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma fatura encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Suas faturas aparecerão aqui quando forem geradas"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próxima Cobrança</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Plano:</span>
                <span className="font-medium">Professional</span>
              </div>
              <div className="flex justify-between">
                <span>Valor:</span>
                <span className="font-medium">R$ 297,00</span>
              </div>
              <div className="flex justify-between">
                <span>Data:</span>
                <span className="font-medium">15/04/2024</span>
              </div>
              <div className="flex justify-between">
                <span>Método:</span>
                <span className="font-medium">Cartão •••• 4242</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configurações de Fatura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Email de notificação</span>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Formato da fatura</span>
                <Button variant="outline" size="sm">
                  PDF
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Idioma</span>
                <Button variant="outline" size="sm">
                  Português
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}