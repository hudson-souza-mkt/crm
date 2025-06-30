import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, Plus, Move } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type FieldType = "short_text" | "long_text" | "select" | "tags" | "rating" | "number";

interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  showOnLead: boolean;
  showOnDeal: boolean;
  options?: string[]; // Para campos do tipo select ou tags
  required?: boolean;
}

const initialFields: CustomField[] = [
  {
    id: "1",
    name: "Cargo",
    type: "short_text",
    showOnLead: true,
    showOnDeal: false,
    required: false,
  },
  {
    id: "2",
    name: "Observações",
    type: "long_text",
    showOnLead: true,
    showOnDeal: true,
    required: false,
  },
  {
    id: "3",
    name: "Origem",
    type: "select",
    showOnLead: true,
    showOnDeal: true,
    options: ["Site", "Indicação", "Google", "Facebook", "Instagram"],
    required: true,
  },
  {
    id: "4",
    name: "Avaliação",
    type: "rating",
    showOnLead: false,
    showOnDeal: true,
    required: false,
  },
];

const fieldTypeLabels: Record<FieldType, string> = {
  short_text: "Texto curto",
  long_text: "Texto longo",
  select: "Seleção de lista",
  tags: "Tags personalizadas",
  rating: "Avaliações",
  number: "Número"
};

export function CustomFieldsSettings() {
  const [fields, setFields] = useState<CustomField[]>(initialFields);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);

  // Estado para o formulário
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState<FieldType>("short_text");
  const [showOnLead, setShowOnLead] = useState(true);
  const [showOnDeal, setShowOnDeal] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [fieldOptions, setFieldOptions] = useState("");

  const resetForm = () => {
    setFieldName("");
    setFieldType("short_text");
    setShowOnLead(true);
    setShowOnDeal(false);
    setIsRequired(false);
    setFieldOptions("");
    setEditingField(null);
  };

  const openNewFieldDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditFieldDialog = (field: CustomField) => {
    setEditingField(field);
    setFieldName(field.name);
    setFieldType(field.type);
    setShowOnLead(field.showOnLead);
    setShowOnDeal(field.showOnDeal);
    setIsRequired(field.required || false);
    setFieldOptions(field.options?.join(", ") || "");
    setIsDialogOpen(true);
  };

  const handleSaveField = () => {
    if (!fieldName.trim()) {
      toast.error("Por favor, digite um nome para o campo");
      return;
    }

    const options = fieldType === "select" || fieldType === "tags" 
      ? fieldOptions.split(",").map(option => option.trim()).filter(Boolean)
      : undefined;

    if ((fieldType === "select" || fieldType === "tags") && (!options || options.length === 0)) {
      toast.error("Por favor, adicione pelo menos uma opção");
      return;
    }

    const newField: CustomField = {
      id: editingField ? editingField.id : Date.now().toString(),
      name: fieldName,
      type: fieldType,
      showOnLead,
      showOnDeal,
      options,
      required: isRequired
    };

    if (editingField) {
      setFields(fields.map(f => f.id === editingField.id ? newField : f));
      toast.success("Campo atualizado com sucesso!");
    } else {
      setFields([...fields, newField]);
      toast.success("Campo criado com sucesso!");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    toast.success("Campo excluído com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Campos Adicionais</h2>
        <p className="text-muted-foreground mt-2">
          Crie campos personalizados para seus leads e negócios.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Campos existentes</h3>
        <Button onClick={openNewFieldDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Campo
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]"></TableHead>
              <TableHead>Nome do Campo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Visibilidade</TableHead>
              <TableHead>Obrigatório</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.id}>
                <TableCell>
                  <Move className="h-4 w-4 text-muted-foreground cursor-move" />
                </TableCell>
                <TableCell className="font-medium">{field.name}</TableCell>
                <TableCell>{fieldTypeLabels[field.type]}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {field.showOnLead && <Badge variant="outline">Lead</Badge>}
                    {field.showOnDeal && <Badge variant="outline">Negócio</Badge>}
                  </div>
                </TableCell>
                <TableCell>{field.required ? "Sim" : "Não"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditFieldDialog(field)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteField(field.id)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {fields.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhum campo adicional criado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingField ? "Editar campo" : "Criar novo campo"}</DialogTitle>
            <DialogDescription>
              Defina as propriedades do campo personalizado
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="field-name" className="text-right">
                Nome do campo
              </Label>
              <Input
                id="field-name"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                className="col-span-3"
                placeholder="Ex: Cargo, Departamento, Orçamento..."
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="field-type" className="text-right">
                Tipo de campo
              </Label>
              <Select
                value={fieldType}
                onValueChange={(value) => setFieldType(value as FieldType)}
              >
                <SelectTrigger className="col-span-3" id="field-type">
                  <SelectValue placeholder="Selecione o tipo de campo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short_text">Texto curto</SelectItem>
                  <SelectItem value="long_text">Texto longo</SelectItem>
                  <SelectItem value="select">Seleção de lista</SelectItem>
                  <SelectItem value="tags">Tags personalizadas</SelectItem>
                  <SelectItem value="rating">Avaliações</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(fieldType === "select" || fieldType === "tags") && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="field-options" className="text-right pt-2">
                  Opções
                </Label>
                <div className="col-span-3 space-y-1">
                  <Textarea
                    id="field-options"
                    value={fieldOptions}
                    onChange={(e) => setFieldOptions(e.target.value)}
                    placeholder="Digite as opções separadas por vírgula"
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ex: Opção 1, Opção 2, Opção 3
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Visibilidade</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-on-lead"
                    checked={showOnLead}
                    onCheckedChange={(checked) => setShowOnLead(checked as boolean)}
                  />
                  <Label htmlFor="show-on-lead" className="font-normal cursor-pointer">
                    Mostrar no Lead
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-on-deal"
                    checked={showOnDeal}
                    onCheckedChange={(checked) => setShowOnDeal(checked as boolean)}
                  />
                  <Label htmlFor="show-on-deal" className="font-normal cursor-pointer">
                    Mostrar no Negócio
                  </Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Obrigatório</Label>
              <div className="col-span-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-required"
                    checked={isRequired}
                    onCheckedChange={(checked) => setIsRequired(checked as boolean)}
                  />
                  <Label htmlFor="is-required" className="font-normal cursor-pointer">
                    Campo obrigatório
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveField}>
              {editingField ? "Salvar alterações" : "Criar campo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}