import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  Image,
  Video,
  Music,
  FileText,
  Play,
  Pause,
  Download,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MessageType, MediaUpload } from "@/types/playbook";

interface MediaUploaderProps {
  type: MessageType;
  onUpload: (url: string, metadata: {
    type: string;
    size: number;
    name: string;
    duration?: number;
  }) => void;
  currentUrl?: string;
  maxSize?: number; // em MB
}

export function MediaUploader({ 
  type, 
  onUpload, 
  currentUrl, 
  maxSize = 10 
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptedTypes = () => {
    switch (type) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'audio':
        return 'audio/*';
      case 'document':
        return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt';
      default:
        return '*/*';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Music;
      case 'document': return FileText;
      default: return Upload;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Verificar tamanho
    if (file.size > maxSize * 1024 * 1024) {
      return `Arquivo muito grande. Máximo permitido: ${maxSize}MB`;
    }

    // Verificar tipo
    const validTypes: Record<MessageType, string[]> = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/mov', 'video/avi', 'video/webm'],
      audio: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'],
      document: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ],
      text: [],
      link: [],
      location: [],
      contact: [],
      template: []
    };

    if (validTypes[type] && !validTypes[type].includes(file.type)) {
      return `Tipo de arquivo não suportado para ${type}`;
    }

    return null;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      // Simular upload com progress
      const uploadPromise = simulateUpload(file);
      
      // Criar preview se for imagem ou vídeo
      if (type === 'image' || type === 'video') {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
      }

      const uploadedUrl = await uploadPromise;
      
      // Obter metadados do arquivo
      const metadata = {
        type: file.type,
        size: file.size,
        name: file.name,
        duration: type === 'video' || type === 'audio' ? await getMediaDuration(file) : undefined
      };

      onUpload(uploadedUrl, metadata);
      setUploading(false);
      setProgress(100);
    } catch (error) {
      setError('Erro ao fazer upload do arquivo');
      setUploading(false);
      setProgress(0);
    }
  };

  const simulateUpload = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          // Simular URL do arquivo uploadado
          resolve(`/uploads/${type}/${file.name}`);
        }
        setProgress(progress);
      }, 200);
    });
  };

  const getMediaDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const element = document.createElement(type === 'video' ? 'video' : 'audio');
      element.src = URL.createObjectURL(file);
      element.onloadedmetadata = () => {
        resolve(element.duration);
        URL.revokeObjectURL(element.src);
      };
    });
  };

  const handleRemove = () => {
    setPreview(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const Icon = getIcon();

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      {!preview && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            "hover:border-primary hover:bg-primary/5",
            error && "border-red-300 bg-red-50"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <Icon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium">
            Clique para fazer upload de {type === 'image' ? 'imagem' : 
                                       type === 'video' ? 'vídeo' : 
                                       type === 'audio' ? 'áudio' : 'documento'}
          </p>
          <p className="text-xs text-muted-foreground">
            Máximo {maxSize}MB • {getAcceptedTypes()}
          </p>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline">{type}</Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            {type === 'image' && (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button variant="secondary" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                </div>
              </div>
            )}

            {type === 'video' && (
              <div className="relative">
                <video
                  src={preview}
                  className="w-full h-32 object-cover rounded-lg"
                  controls={false}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <Button variant="secondary" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Reproduzir
                  </Button>
                </div>
              </div>
            )}

            {type === 'audio' && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Music className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Arquivo de áudio</p>
                  <p className="text-xs text-muted-foreground">Clique para reproduzir</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            )}

            {type === 'document' && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Documento</p>
                  <p className="text-xs text-muted-foreground">Clique para visualizar</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Fazendo upload...</span>
            
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptedTypes()}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}