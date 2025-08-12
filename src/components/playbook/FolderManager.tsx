import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  FolderPlus,
  Palette,
  Users,
  Save,
  Trash2,
  Edit,
  Copy,
  Share
} from "lucide-react";
import type { PlaybookFolder } from "@/types/playbook";

interface FolderManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: PlaybookFolder[];
  onSave: (folder: Partial<PlaybookFolder>) => void;
  editingFolder?: PlaybookFolder | null;
}

export function FolderManager({
  open,
  onOpenChange,
  folders,
  onSave,
  editingFolder
}: FolderManagerProps) {
  const [formData, setFormData] = useState<Partial<PlaybookFolder>>({
    name: "",
    description: "",
    icon: "📁",
    color: "#3b82f6",
    isShared: false
  });

  const predefinedIcons = [
    "📁", "👋", "🎯", "🛡️", "🎉", "📞", "💰", "📊", "🚀", "⭐",
    "💬", "📝", "🔥", "💡", "🎪", "🎨", "🎵", "📱", "💻", "🌟"
  ];

  const predefinedColors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
    "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"
  ];

  useEffect(() => {
    if (editingFolder) {
      setFormData(editingFolder);
    } else {
      setFormData({
        name: "",
        description: "",
        icon: "📁",
        color: "#3b82f6",
        isShared: false
      });
    }
  }, [editingFolder, open]);

  const handleSave = () => {
    if (!formData.name?.trim()) {
      return;
    }

    onSave(formData);
    onOpenChange(false);
  };

  const handleIconSelect = (icon: string) => {
    setFormData(prev => ({ ...prev, icon }));
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            {editingFolder ? "Editar Pasta" : "Nova Pasta"}
          </DialogTitle>
          <DialogDescription>
            Configure uma pasta para organizar suas respostas rápidas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview da Pasta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <span className="text-2xl">{formData.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">
                    {formData.name || "Nome da Pasta"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formData.description || "Descrição da pasta"}
                  </div>
                </div>
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: formData.color }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="folderName">Nome da Pasta</Label>
              <Input
                id="folderName"
                value={formData.name || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Abordagem Inicial"
              />
            </div>
            
            <div>
              <Label htmlFor="parentFolder">Pasta Pai (opcional)</Label>
              <Select
                value={formData.parentId || ""}
                onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value || undefined }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma pasta pai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma (pasta raiz)</SelectItem>
                  {folders
                    .filter(f => f.id !== editingFolder?.id)
                    .map(folder => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.icon} {folder.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="folderDescription">Descrição (opcional)</Label>
            <Textarea
              id="folderDescription"
              value={formData.description || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o propósito desta pasta..."
              rows={2}
            />
          </div>

          {/* Seleção de Ícone */}
          <div>
            <Label>Ícone da Pasta</Label>
            <div className="grid grid-cols-10 gap-2 mt-2">
              {predefinedIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleIconSelect(icon)}
                  className={`p-2 text-xl rounded-lg border-2 transition-colors hover:bg-muted ${
                    formData.icon === icon 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <Input
                value={formData.icon || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="Ou digite um emoji personalizado"
                className="w-32"
              />
            </div>
          </div>

          {/* Seleção de Cor */}
          <div>
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Cor da Pasta
            </Label>
            <div className="grid grid-cols-10 gap-2 mt-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    formData.color === color 
                      ? 'border-gray-800 scale-110' 
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="mt-2">
              <Input
                type="color"
                value={formData.color || "#3b82f6"}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-20 h-10"
              />
            </div>
          </div>

          {/* Configurações de Compartilhamento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Share className="h-4 w-4" />
                Compartilhamento
              </CardTitle>
              <CardDescription>
                Configure quem pode acessar esta pasta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isShared">Compartilhar com a Equipe</Label>
                  <p className="text-sm text-muted-foreground">
                    Outros membros da equipe poderão ver e usar as respostas desta pasta
                  </p>
                </div>
                <Switch
                  id="isShared"
                  checked={formData.isShared || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isShared: checked }))}
                />
              </div>

              {formData.isShared && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Dica:</strong> Pastas compartilhadas permitem que toda a equipe 
                    use as mesmas respostas, garantindo consistência no atendimento.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estatísticas (se editando) */}
          {editingFolder && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Estatísticas da Pasta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary">0</div>
                    <div className="text-xs text-muted-foreground">Respostas</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">0</div>
                    <div className="text-xs text-muted-foreground">Usos</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {editingFolder.createdAt.toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-xs text-muted-foreground">Criada em</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">
                      {editingFolder.createdBy}
                    </div>
                    <div className="text-xs text-muted-foreground">Criada por</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!formData.name?.trim()}>
            <Save className="h-4 w-4 mr-2" />
            {editingFolder ? "Atualizar" : "Criar"} Pasta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}