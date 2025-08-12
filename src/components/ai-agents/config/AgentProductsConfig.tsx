import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Package, Wrench, DollarSign, Star } from "lucide-react";
import { useState } from "react";
import type { AIAgent, ProductInfo, ServiceInfo, PricingPlan } from "@/types/aiAgent";

interface AgentProductsConfigProps {
  data: Partial<AIAgent>;
  onChange: (updates: Partial<AIAgent>) => void;
  onSave: () => void;
}

export function AgentProductsConfig({ data, onChange, onSave }: AgentProductsConfigProps) {
  const [activeTab, setActiveTab] = useState("produtos");

  // Produto em edição
  const [editingProduct, setEditingProduct] = useState<ProductInfo | null>(null);
  const [productForm, setProductForm] = useState<Partial<ProductInfo>>({});

  // Serviço em edição
  const [editingService, setEditingService] = useState<ServiceInfo | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<ServiceInfo>>({});

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      features: [],
      benefits: [],
      pricing: { plans: [], currency: "BRL" },
      targetAudience: "",
      useCases: []
    });
  };

  const handleEditProduct = (product: ProductInfo) => {
    setEditingProduct(product);
    setProductForm(product);
  };

  const handleSaveProduct = () => {
    if (!productForm.name) return;

    const newProduct: ProductInfo = {
      id: editingProduct?.id || `product-${Date.now()}`,
      name: productForm.name || "",
      description: productForm.description || "",
      features: productForm.features || [],
      benefits: productForm.benefits || [],
      pricing: productForm.pricing || { plans: [], currency: "BRL" },
      targetAudience: productForm.targetAudience || "",
      useCases: productForm.useCases || []
    };

    const currentProducts = data.products || [];
    const updatedProducts = editingProduct
      ? currentProducts.map(p => p.id === editingProduct.id ? newProduct : p)
      : [...currentProducts, newProduct];

    onChange({ products: updatedProducts });
    setEditingProduct(null);
    setProductForm({});
  };

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = (data.products || []).filter(p => p.id !== productId);
    onChange({ products: updatedProducts });
  };

  const handleAddService = () => {
    setEditingService(null);
    setServiceForm({
      name: "",
      description: "",
      deliverables: [],
      duration: "",
      pricing: "",
      requirements: []
    });
  };

  const handleEditService = (service: ServiceInfo) => {
    setEditingService(service);
    setServiceForm(service);
  };

  const handleSaveService = () => {
    if (!serviceForm.name) return;

    const newService: ServiceInfo = {
      id: editingService?.id || `service-${Date.now()}`,
      name: serviceForm.name || "",
      description: serviceForm.description || "",
      deliverables: serviceForm.deliverables || [],
      duration: serviceForm.duration || "",
      pricing: serviceForm.pricing || "",
      requirements: serviceForm.requirements || []
    };

    const currentServices = data.services || [];
    const updatedServices = editingService
      ? currentServices.map(s => s.id === editingService.id ? newService : s)
      : [...currentServices, newService];

    onChange({ services: updatedServices });
    setEditingService(null);
    setServiceForm({});
  };

  const handleDeleteService = (serviceId: string) => {
    const updatedServices = (data.services || []).filter(s => s.id !== serviceId);
    onChange({ services: updatedServices });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Produtos e Serviços</h3>
        <p className="text-sm text-muted-foreground">
          Configure o catálogo de produtos e serviços que o agente deve conhecer
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="produtos" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="servicos" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Serviços
          </TabsTrigger>
        </TabsList>

        <TabsContent value="produtos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium">Produtos</h4>
            <Button onClick={handleAddProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          </div>

          {/* Lista de Produtos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.products || []).map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditProduct(product)}
                        className="h-8 w-8"
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="h-8 w-8 text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {product.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Planos:</p>
                      <p className="text-sm">{product.pricing.plans.length} planos disponíveis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Formulário de Produto */}
          {(editingProduct !== null || Object.keys(productForm).length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingProduct ? "Editar Produto" : "Novo Produto"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productName">Nome do Produto</Label>
                    <Input
                      id="productName"
                      value={productForm.name || ""}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Ex: CRM Pro"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productTarget">Público-Alvo</Label>
                    <Input
                      id="productTarget"
                      value={productForm.targetAudience || ""}
                      onChange={(e) => setProductForm({ ...productForm, targetAudience: e.target.value })}
                      placeholder="Ex: Pequenas e médias empresas"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="productDescription">Descrição</Label>
                  <Textarea
                    id="productDescription"
                    value={productForm.description || ""}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Descreva o produto..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveProduct}>
                    {editingProduct ? "Atualizar" : "Adicionar"} Produto
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({});
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="servicos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium">Ser viços</h4>
            <Button onClick={handleAddService}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Serviço
            </Button>
          </div>

          {/* Lista de Serviços */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.services || []).map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {service.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditService(service)}
                        className="h-8 w-8"
                      >
                        <Wrench className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteService(service.id)}
                        className="h-8 w-8 text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Duração:</span>
                      <span className="text-sm font-medium">{service.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Preço:</span>
                      <span className="text-sm font-medium">{service.pricing}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Entregáveis:</p>
                      <p className="text-sm">{service.deliverables.length} itens</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Formulário de Serviço */}
          {(editingService !== null || Object.keys(serviceForm).length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingService ? "Editar Serviço" : "Novo Serviço"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="serviceName">Nome do Serviço</Label>
                    <Input
                      id="serviceName"
                      value={serviceForm.name || ""}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                      placeholder="Ex: Implementação"
                    />
                  </div>
                  <div>
                    <Label htmlFor="serviceDuration">Duração</Label>
                    <Input
                      id="serviceDuration"
                      value={serviceForm.duration || ""}
                      onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                      placeholder="Ex: 2-4 semanas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="servicePricing">Preço</Label>
                    <Input
                      id="servicePricing"
                      value={serviceForm.pricing || ""}
                      onChange={(e) => setServiceForm({ ...serviceForm, pricing: e.target.value })}
                      placeholder="Ex: A partir de R$ 2.500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="serviceDescription">Descrição</Label>
                  <Textarea
                    id="serviceDescription"
                    value={serviceForm.description || ""}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    placeholder="Descreva o serviço..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveService}>
                    {editingService ? "Atualizar" : "Adicionar"} Serviço
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingService(null);
                      setServiceForm({});
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Ações */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={onSave}>Salvar Catálogo</Button>
      </div>
    </div>
  );
}