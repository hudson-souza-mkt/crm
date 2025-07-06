import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/pipeline/ColorPicker"; // Reutilizando o seletor de cores

interface Tag {
  id: string;
  name: string;
  color: string;
  user_id: string;
}

// Função para buscar tags
const fetchTags = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");

  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export function TagsSettings() {
  const queryClient = useQueryClient();
  const [newTagName, setNewTagName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  // Busca de dados
  const { data: tags = [], isLoading } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  // Mutação para criar tag
  const createTagMutation = useMutation({
    mutationFn: async (newTag: { name: string; color: string; user_id: string }) => {
      const { error } = await supabase.from("tags").insert(newTag);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Tag criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setNewTagName("");
    },
    onError: (error) => {
      toast.error(`Falha ao criar tag: ${error.message}`);
    },
  });

  // Mutação para atualizar tag
  const updateTagMutation = useMutation({
    mutationFn: async (updatedTag: { id: string; name: string; color: string }) => {
      const { error } = await supabase
        .from("tags")
        .update({ name: updatedTag.name, color: updatedTag.color })
        .eq("id", updatedTag.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Tag atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setIsDialogOpen(false);
      setEditingTag(null);
    },
    onError: (error) => {
      toast.error(`Falha ao atualizar tag: ${error.message}`);
    },
  });

  // Mutação para deletar tag
  const deleteTagMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tags").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Tag excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (error) => {
      toast.error(`Falha ao excluir tag: ${error.message}`);
    },
  });

  const handleAddTag = async () => {
    if (newTagName.trim() === "") return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Você precisa estar logado para criar uma tag.");
      return;
    }
    createTagMutation.mutate({ name: newTagName, color: "gray", user_id: user.id });
  };

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag);
    setIsDialogOpen(true);
  };

  const handleUpdateTag = () => {
    if (!editingTag) return;
    updateTagMutation.mutate({
      id: editingTag.id,
      name: editingTag.name,
      color: editingTag.color,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tags</h2>
        <p className="text-muted-foreground mt-2">
          Crie e gerencie as tags para organizar seus leads e negócios.
        </p>
      </div>
      
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-medium">Adicionar nova tag</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Nome da tag"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            disabled={createTagMutation.isPending}
          />
          <Button onClick={handleAddTag} disabled={createTagMutation.isPending}>
            {createTagMutation.isPending ? "Adicionando..." : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Tags existentes</h3>
        <div className="p-4 border rounded-lg space-y-3">
          {isLoading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
          ) : (
            tags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                <Badge className={cn("text-white", `bg-${tag.color}-500`)}>{tag.name}</Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(tag)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => deleteTagMutation.mutate(tag.id)}
                    disabled={deleteTagMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
          {!isLoading && tags.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma tag criada ainda.</p>
          )}
        </div>
      </div>

      {/* Diálogo de Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tag</DialogTitle>
            <DialogDescription>Altere o nome e a cor da sua tag.</DialogDescription>
          </DialogHeader>
          {editingTag && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="tag-name">Nome da Tag</Label>
                <Input
                  id="tag-name"
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Cor da Tag</Label>
                <div className="pt-2">
                  <ColorPicker
                    selectedColor={editingTag.color}
                    onColorChange={(color) => setEditingTag({ ...editingTag, color })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateTag} disabled={updateTagMutation.isPending}>
              {updateTagMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}