import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  CreditCard,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  Check,
  AlertTriangle,
  Shield,
  Smartphone,
  FileText,
  Wallet
} from "lucide-react";
import type { PaymentMethod } from "@/types/billing";

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm-1",
      type: "credit_card",
      last4: "4242",
      brand: "visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      isValid: true
    },
    {
      id: "pm-2",
      type: "credit_card",
      last4: "5555",
      brand: "mastercard",
      expiryMonth: 8,
      expiryYear: 2024,
      isDefault: false,
      isValid: true
    },
    {
      id: "pm-3",
      type: "pix",
      isDefault: false,
      isValid: true
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    type: "credit_card" as PaymentMethod["type"],
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    holderName: "",
    cpf: ""
  });

  const getPaymentIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "credit_card": return CreditCard;
      case "pix": return Smartphone;
      case "boleto": return FileText;
      case "paypal": return Wallet;
      default: return CreditCard;
    }
  };

  const getPaymentLabel = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "credit_card": return "Cartão de Crédito";
      case "pix": return "PIX";
      case "boleto": return "Boleto";
      case "paypal": return "PayPal";
      default: return "Cartão de Crédito";
    }
  };

  const getBrandIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case "visa":
        return "💳";
      case "mastercard":
        return "💳";
      case "amex":
        return "💳";
      default:
        return "💳";
    }
  };

  const handleAddMethod = () => {
    setEditingMethod(null);
    setFormData({
      type: "credit_card",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      holderName: "",
      cpf: ""
    });
    setShowAddDialog(true);
  };

  const handleEditMethod = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      cardNumber: `****-****-****-${method.last4}`,
      expiryMonth: method.expiryMonth?.toString() || "",
      expiryYear: method.expiryYear?.toString() || "",
      cvv: "",
      holderName: "",
      cpf: ""
    });
    setShowAddDialog(true);
  };

  const handleSaveMethod = () => {
    if (editingMethod) {
      // Atualizar método existente
      setPaymentMethods(prev => prev.map(pm => 
        pm.id === editingMethod.id 
          ? { ...pm, ...formData }
          : pm
      ));
    } else {
      // Adicionar novo método
      const newMethod: PaymentMethod = {
        id: `pm-${Date.now()}`,
        type: formData.type,
        last4: formData.cardNumber.slice(-4),
        brand: formData.cardNumber.startsWith("4") ? "visa" : "mastercard",
        expiryMonth: parseInt(formData.expiryMonth),
        expiryYear: parseInt(formData.expiryYear),
        isDefault: paymentMethods.length === 0,
        isValid: true
      };
      setPaymentMethods(prev => [...prev, newMethod]);
    }
    setShowAddDialog(false);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => prev.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
  };

  const handleDeleteMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
  };

  const isFormValid = () => {
    if (formData.type === "credit_card") {
      return formData.cardNumber.length >= 16 && 
             formData.expiryMonth && 
             formData.expiryYear && 
             formData.cvv.length >= 3 &&
             formData.holderName.trim();
    }
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Métodos de Pagamento</h2>
          <p className="text-muted-foreground">
            Gerencie seus cartões e formas de pagamento
          </p>
        </div>
        <Button onClick={handleAddMethod}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Método
        </Button>
      </div>

      {/* Lista de Métodos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethods.map((method) => {
          const Icon = getPaymentIcon(method.type);
          const isExpiringSoon = method.expiryYear === 2024 && method.expiryMonth && method.expiryMonth <= 12;
          
          return (
            <Card key={method.id} className="relative">
              {method.isDefault && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-green-600">
                    <Star className="h-3 w-3 mr-1" />
                    Padrão
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{getPaymentLabel(method.type)}</span>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!method.isDefault && (
                        <>
                          <DropdownMenuItem onClick={() => handleSetDefault(method.id)}>
                            <Star className="mr-2 h-4 w-4" />
                            Definir como Padrão
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem onClick={() => handleEditMethod(method)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteMethod(method.id)}
                        className="text-red-600"
                        disabled={method.isDefault}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                {method.type === "credit_card" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-mono">
                        {getBrandIcon(method.brand)} •••• {method.last4}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {method.brand?.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Expira em {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                      </span>
                      {isExpiringSoon && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Expirando
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {method.type === "pix" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-green-600" />
                      <span className="text-sm">PIX Instantâneo</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Pagamento via chave PIX cadastrada
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  {method.isValid ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Válido</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">Inválido</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Estado Vazio */}
      {paymentMethods.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum método de pagamento</h3>
            <p className="text-muted-foreground mb-4">
              Adicione um cartão ou método de pagamento para continuar
            </p>
            <Button onClick={handleAddMethod}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Método
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Informações de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Segurança dos Pagamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Criptografia SSL 256-bit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Certificação PCI DSS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Dados não armazenados</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Adicionar/Editar */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? "Editar Método" : "Adicionar Método de Pagamento"}
            </DialogTitle>
            <DialogDescription>
              Configure um novo método de pagamento para suas assinaturas
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="paymentType">Tipo de Pagamento</Label>
              <Select
                value={formData.type}
                onValueChange={(value: PaymentMethod["type"]) => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Cartão de Crédito
                    </div>
                  </SelectItem>
                  <SelectItem value="pix">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      PIX
                    </div>
                  </SelectItem>
                  <SelectItem value="boleto">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Boleto
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === "credit_card" && (
              <>
                <div>
                  <Label htmlFor="holderName">Nome do Titular</Label>
                  <Input
                    id="holderName"
                    value={formData.holderName}
                    onChange={(e) => setFormData(prev => ({ ...prev, holderName: e.target.value }))}
                    placeholder="Nome como está no cartão"
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <Input
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="expiryMonth">Mês</Label>
                    <Select
                      value={formData.expiryMonth}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, expiryMonth: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <SelectItem key={month} value={month.toString()}>
                            {month.toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="expiryYear">Ano</Label>
                    <Select
                      value={formData.expiryYear}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, expiryYear: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="AAAA" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={formData.cvv}
                      onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                    placeholder="000.000.000-00"
                  />
                </div>
              </>
            )}

            {formData.type === "pix" && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  O PIX será configurado automaticamente usando os dados da sua conta.
                  Você poderá pagar instantaneamente via QR Code ou chave PIX.
                </p>
              </div>
            )}

            {formData.type === "boleto" && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  O boleto será gerado automaticamente a cada cobrança.
                  Você receberá o link por email para pagamento.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveMethod} disabled={!isFormValid()}>
              {editingMethod ? "Atualizar" : "Adicionar"} Método
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}