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
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FolderPlus,
  MessageSquare,
  Star,
  Copy,
  Edit,
  Trash2,
  Play,
  BarChart3,
  Settings,
  Upload,
  Zap
} from "lucide-react";
import { PlaybookSidebar } from "@/components/playbook/PlaybookSidebar";
import { ResponseCard } from "@/components/playbook/ResponseCard";
import { ResponseEditor } from "@/components/playbook/ResponseEditor";
import { FolderManager } from "@/components/playbook/FolderManager";
import { PlaybookStats } from "@/components/playbook/PlaybookStats";
import { usePlaybook } from "@/hooks/usePlaybook";
import type { PlaybookFolder, QuickResponse } from "@/types/playbook";

export default function Playbook() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [folderManagerOpen, setFolderManagerOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<QuickResponse | null>(null);

  const {
    folders,
    responses,
    stats,
    createFolder,
    updateFolder,
    deleteFolder,
    createResponse,
    updateResponse,
    deleteResponse,
    duplicateResponse,
    toggleFavorite,
    recordUsage
  } = usePlaybook();

  const filteredResponses = responses.filter(response => {
    const matchesFolder = !selectedFolder || response.folderId === selectedFolder;
    const matchesSearch = response.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = filterTag === "all" || response.tags.includes(filterTag);
    const matchesFavorites = !showFavorites || response.isFavorite;
    
    return matchesFolder && matchesSearch && matchesTag && matchesFavorites;
  });

  const selectedFolderData = folders.find(f => f.id === selectedFolder);
  const allTags = Array.from(new Set(responses.flatMap(r => r.tags)));

  const handleCreateResponse = () => {
    setSelectedResponse(null);
    setEditorOpen(true);
  };

  const handleEditResponse = (response: QuickResponse) => {
    setSelectedResponse(response);
    setEditorOpen(true);
  };

  const handleSaveResponse = (responseData: Partial<QuickResponse>) => {
    if (selectedResponse) {
      updateResponse(selectedResponse.id, responseData);
    } else {
      createResponse({
        ...responseData,
        folderId: selectedFolder || 'root'
      });
    }
    setEditorOpen(false);
  };

  const handleUseResponse = (response: QuickResponse) => {
    recordUsage({
      responseId: response.id,
      responseName: response.name,
      userId: 'current-user',
      userName: 'Usuário Atual',
      channel: 'manual',
      timestamp: new Date(),
      success: true,
      variables: {}
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <PlaybookSidebar
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectFolder={setSelectedFolder}
        onCreateFolder={() => setFolderManagerOpen(true)}
        onEditFolder={(folder) => {
          setSelectedResponse(null);
          setFolderManagerOpen(true);
        }}
        stats={stats}
      />

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">
                {selectedFolderData ? selectedFolderData.name : "Playbook de Vendas"}
              </h1>
              <p className="text-muted-foreground">
                {selectedFolderData 
                  ? selectedFolderData.description || "Respostas rápidas organizadas"
                  : "Organize e gerencie suas respostas rápidas"
                }
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStatsOpen(true)}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" onClick={() => setFolderManagerOpen(true)}>
                <FolderPlus className="h-4 w-4 mr-2" />
                Nova Pasta
              </Button>
              <Button onClick={handleCreateResponse}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Resposta
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar respostas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showFavorites ? "default" : "outline"}
              onClick={() => setShowFavorites(!showFavorites)}
            >
              <Star className="h-4 w-4 mr-2" />
              Favoritos
            </Button>
          </div>
        </div>

        {/* Lista de Respostas */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredResponses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || filterTag !== "all" || showFavorites
                    ? "Nenhuma resposta encontrada"
                    : "Nenhuma resposta criada"
                  }
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterTag !== "all" || showFavorites
                    ? "Tente ajustar os filtros de busca"
                    : "Comece criando sua primeira resposta rápida"
                  }
                </p>
                {!searchTerm && filterTag === "all" && !showFavorites && (
                  <Button onClick={handleCreateResponse}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Resposta
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResponses.map((response) => (
                <ResponseCard
                  key={response.id}
                  response={response}
                  onEdit={() => handleEditResponse(response)}
                  onDuplicate={() => duplicateResponse(response.id)}
                  onDelete={() => deleteResponse(response.id)}
                  onToggleFavorite={() => toggleFavorite(response.id)}
                  onUse={() => handleUseResponse(response)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ResponseEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        response={selectedResponse}
        folderId={selectedFolder}
        onSave={handleSaveResponse}
      />

      <FolderManager
        open={folderManagerOpen}
        onOpenChange={setFolderManagerOpen}
        folders={folders}
        onSave={(folderData) => {
          createFolder(folderData);
          setFolderManagerOpen(false);
        }}
      />

      <PlaybookStats
        open={statsOpen}
        onOpenChange={setStatsOpen}
        stats={stats}
      />
    </div>
  );
}