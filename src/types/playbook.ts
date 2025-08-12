export interface PlaybookFolder {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isShared: boolean;
  permissions: FolderPermission[];
}

export interface QuickResponse {
  id: string;
  folderId: string;
  name: string;
  description?: string;
  content: MessageContent[];
  variables: Variable[];
  tags: string[];
  isSequence: boolean;
  sequenceDelay?: number; // segundos entre mensagens
  usageCount: number;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
  isFavorite: boolean;
}

export interface MessageContent {
  id: string;
  type: MessageType;
  order: number;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  mediaSize?: number;
  fileName?: string;
  thumbnail?: string;
  duration?: number; // para áudio/vídeo
  coordinates?: { lat: number; lng: number }; // para localização
  linkPreview?: LinkPreview;
  delay?: number; // delay antes desta mensagem na sequência
}

export type MessageType = 
  | 'text'
  | 'image'
  | 'audio'
  | 'video'
  | 'document'
  | 'link'
  | 'location'
  | 'contact'
  | 'template';

export interface Variable {
  id: string;
  name: string;
  key: string;
  description: string;
  type: VariableType;
  defaultValue?: string;
  options?: string[]; // para select
  required: boolean;
  validation?: string; // regex
}

export type VariableType = 
  | 'text'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'select'
  | 'boolean';

export interface LinkPreview {
  title: string;
  description: string;
  image?: string;
  url: string;
  domain: string;
}

export interface FolderPermission {
  userId: string;
  userName: string;
  role: 'viewer' | 'editor' | 'admin';
  grantedAt: Date;
  grantedBy: string;
}

export interface PlaybookUsage {
  id: string;
  responseId: string;
  responseName: string;
  userId: string;
  userName: string;
  channel: string;
  leadId?: string;
  leadName?: string;
  variables: Record<string, string>;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}

export interface PlaybookStats {
  totalResponses: number;
  totalUsage: number;
  topResponses: {
    id: string;
    name: string;
    usageCount: number;
    successRate: number;
  }[];
  usageByFolder: {
    folderId: string;
    folderName: string;
    count: number;
    percentage: number;
  }[];
  usageByChannel: {
    channel: string;
    count: number;
    percentage: number;
  }[];
  usageTrend: {
    date: Date;
    count: number;
  }[];
}

export interface MediaUpload {
  id: string;
  file: File;
  type: MessageType;
  url?: string;
  thumbnail?: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface SequencePreview {
  messages: MessageContent[];
  totalDuration: number;
  estimatedDeliveryTime: Date;
  variables: Record<string, string>;
}