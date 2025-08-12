import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FolderPlus,
  MoreHorizontal,
  Edit,
  Trash2,
  Share,
  Settings,
  BarChart3,
  Star,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlaybookFolder, PlaybookStats } from "@/types/playbook";

interface PlaybookSidebarProps {
  folders: PlaybookFolder[];
  selectedFolder: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: () => void;
  onEditFolder: (folder: PlaybookFolder) => void;
  stats: PlaybookStats;
}

export function PlaybookSidebar({
  folders,
  selectedFolder,
  onSelectFolder,
  onCreateFolder,
  onEditFolder,
  stats
}: PlaybookSidebarProps) {
  const getFolderUsage = (folderId: string) => {
    return stats.usageByFolder.find(u => u.folderId === folderId)?.count || 0;
  };

  return (
    <div className="w-80 border-r bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Pastas</h2>
          <Button variant="ghost" size="icon" onClick={onCreateFolder}>
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 bg-white rounded-lg">
            <div className="text-lg font-bold text-primary">{stats.totalResponses}</div>
            <div className="text-xs text-muted-foreground">Respostas</div>
          </div>
          <div className="p-2 bg-white rounded-lg">
            <div className="text-lg font-bold text-green-600">{stats.totalUsage}</div>
            <div className="text-xs text-muted-foreground">Usos</div>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {/* Todas as Respostas */}
          <button
            onClick={() => onSelectFolder(null)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
              selectedFolder === null
                ? "bg-primary text-primary-foreground"
                : "hover:bg-white/50"
            )}
          >
            <MessageSquare className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 font-medium">Todas as Respostas</span>
            <Badge variant="secondary" className="text-xs">
              {stats.totalResponses}
            </Badge>
          </button>

          {/* Favoritos */}
          <button
            onClick={() => onSelectFolder('favorites')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
              selectedFolder === 'favorites'
                ? "bg-primary text-primary-foreground"
                : "hover:bg-white/50"
            )}
          >
            <Star className="h-4 w-4 flex-shrink-0 text-yellow-500" />
            <span className="flex-1 font-medium">Favoritos</span>
          </button>

          <div className="h-px bg-border my-2" />

          {/* Pastas */}
          {folders.map((folder) => {
            const usageCount = getFolderUsage(folder.id);
            
            return (
              <div key={folder.id} className="group relative">
                <button
                  onClick={() => onSelectFolder(folder.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                    selectedFolder === folder.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-white/50"
                  )}
                >
                  <span className="text-lg flex-shrink-0">{folder.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{folder.name}</div>
                    {folder.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {folder.description}
                      </div>
                    )}
                  </div>
                  {usageCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {usageCount}
                    </Badge>
                  )}
                </button>

                {/* Menu de Ações */}
                <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditFolder(folder)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="mr-2 h-4 w-4" />
                        Compartilhar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </Button>
      </div>
    </div>
  );
}