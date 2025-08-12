import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Star,
  Play,
  MessageSquare,
  Image,
  Video,
  FileText,
  Music,
  MapPin,
  Link,
  Zap,
  Clock,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuickResponse, MessageType } from "@/types/playbook";

interface ResponseCardProps {
  response: QuickResponse;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  onUse: () => void;
}

export function ResponseCard({
  response,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  onUse
}: ResponseCardProps) {
  const getMessageTypeIcon = (type: MessageType) => {
    switch (type) {
      case 'text': return MessageSquare;
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Music;
      case 'document': return FileText;
      case 'location': return MapPin;
      case 'link': return Link;
      default: return MessageSquare;
    }
  };

  const getMessageTypeColor = (type: MessageType) => {
    switch (type) {
      case 'text': return 'text-blue-600';
      case 'image': return 'text-green-600';
      case 'video': return 'text-purple-600';
      case 'audio': return 'text-orange-600';
      case 'document': return 'text-red-600';
      case 'location': return 'text-cyan-600';
      case 'link': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  const messageTypes = Array.from(new Set(response.content.map(c => c.type)));
  const hasVariables = response.variables.length > 0;
  const totalDelay = response.content.reduce((sum, msg) => sum + (msg.delay || 0), 0);

  return (
    <Card className="hover:shadow-md transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg truncate">{response.name}</CardTitle>
              {response.isFavorite && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
              {response.isSequence && (
                <Badge variant="outline" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Sequência
                </Badge>
              )}
            </div>
            
            {response.description && (
              <CardDescription className="line-clamp-2">
                {response.description}
              </CardDescription>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onUse}>
                <Play className="mr-2 h-4 w-4" />
                Usar Resposta
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleFavorite}>
                <Star className="mr-2 h-4 w-4" />
                {response.isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Tipos de Mensagem */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Conteúdo:</span>
          <div className="flex gap-1">
            {messageTypes.map((type, index) => {
              const Icon = getMessageTypeIcon(type);
              return (
                <div
                  key={index}
                  className={cn(
                    "p-1 rounded",
                    getMessageTypeColor(type),
                    "bg-muted"
                  )}
                >
                  <Icon className="h-3 w-3" />
                </div>
              );
            })}
          </div>
          <span className="text-xs text-muted-foreground">
            {response.content.length} {response.content.length === 1 ? 'mensagem' : 'mensagens'}
          </span>
        </div>

        {/* Informações da Sequência */}
        {response.isSequence && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{totalDelay}s total</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>{response.sequenceDelay}s entre msgs</span>
            </div>
          </div>
        )}

        {/* Variáveis */}
        {hasVariables && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Variáveis:</span>
            <div className="flex flex-wrap gap-1">
              {response.variables.slice(0, 3).map((variable, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {variable.key}
                </Badge>
              ))}
              {response.variables.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{response.variables.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {response.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {response.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {response.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{response.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Estatísticas */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>{response.usageCount} usos</span>
            </div>
            {response.lastUsed && (
              <span>
                Usado {response.lastUsed.toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
          
          <Button size="sm" onClick={onUse}>
            <Play className="h-3 w-3 mr-1" />
            Usar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}