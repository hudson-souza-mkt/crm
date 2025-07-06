import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const initialTags = [
  { id: 1, name: "Potencial", color: "bg-blue-500" },
  { id: 2, name: "Urgente", color: "bg-red-500" },
  { id: 3, name: "Alto valor", color: "bg-green-500" },
  { id: 4, name: "Follow-up", color: "bg-yellow-500" },
  { id: 5, name: "VIP", color: "bg-purple-500" },
];

export function TagsSettings() {
  const [tags, setTags] = useState(initialTags);
  const [newTagName, setNewTagName] = useState("");

  const handleAddTag = () => {
    if (newTagName.trim() === "") return;
    const newTag = {
      id: Math.max(...tags.map(t => t.id), 0) + 1,
      name: newTagName,
      color: "bg-gray-500", // Default color
    };
    setTags([...tags, newTag]);
    setNewTagName("");
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
          />
          <Button onClick={handleAddTag}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Tags existentes</h3>
        <div className="p-4 border rounded-lg space-y-3">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
              <Badge className={cn("text-white", tag.color)}>{tag.name}</Badge>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}