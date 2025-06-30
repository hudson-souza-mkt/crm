import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CompanySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Empresa</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie as informações e detalhes da sua empresa.
        </p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nome da Empresa</Label>
            <Input id="company-name" defaultValue="Space Sales" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" defaultValue="00.000.000/0001-00" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Input id="address" defaultValue="Rua das Estrelas, 123" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" defaultValue="Galáxia Central" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input id="state" defaultValue="Via Láctea" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" type="tel" defaultValue="(11) 99999-8888" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" type="url" defaultValue="https://www.spacesales.com" />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button>Salvar Alterações</Button>
      </div>
    </div>
  );
}