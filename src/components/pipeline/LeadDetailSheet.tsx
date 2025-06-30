import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tag,
  Edit,
  MessageSquare,
  Briefcase,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import type { Lead } from "./PipelineCard";

interface LeadDetailSheetProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const historyMock = [
  {
    type: "tag_add",
    content: 'Tag "Morno" adicionada ao lead.',
    date: "27/06/2025 14:46",
  },
  {
    type: "tag_add",
    content: 'Tag "Quente" adicionada ao lead.',
    date: "26/06/2025 16:30",
  },
  {
    type: "tag_remove",
    content: 'Tag "Morno" removida do lead.',
    date: "26/06/2025 16:30",
  },
  {
    type: "tag_add",
    content: 'Tag "Morno" adicionada ao lead.',
    date: "25/06/2025 11:30",
  },
  {
    type: "lead_update",
    content: "Lead atualizado.",
    date: "25/06/2025 10:01",
  },
  {
    type: "tag_remove",
    content: 'Tag "Frio" removida do lead.',
    date: "25/06/2025 10:01",
  },
  {
    type: "tag_remove",
    content: 'Tag "Quente" removida do lead.',
    date: "25/06/2025 10:01",
  },
];

const TimelineItem = ({ icon, children, isLast = false }: { icon: React.ReactNode, children: React.ReactNode, isLast?: boolean }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="bg-green-100 rounded-full h-8 w-8 flex items-center justify-center text-green-600">
        {icon}
      </div>
      {!isLast && <div className="w-px h-full bg-gray-200" />}
    </div>
    <div className="pb-8 flex-1">
      <div className="p-4 rounded-lg bg-white border">
        {children}
      </div>
    </div>
  </div>
);

const getIconForHistory = (type: string) => {
  switch (type) {
    case "tag_add":
    case "tag_remove":
      return <Tag className="h-4 w-4" />;
    case "lead_update":
      return <Edit className="h-4 w-4" />;
    default:
      return <Briefcase className="h-4 w-4" />;
  }
};

export function LeadDetailSheet({ lead, open, onOpenChange }: LeadDetailSheetProps) {
  if (!lead) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[1200px] p-0">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-[320px] bg-gray-50 border-r flex-shrink-0 flex flex-col p-6">
            <Avatar className="h-24 w-24 mx-auto border-4 border-white shadow-md">
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {lead.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-center mt-4">{lead.name}</h2>
            <p className="text-sm text-muted-foreground text-center">{lead.company}</p>
            <div className="flex gap-2 justify-center mt-4">
              <Badge variant="destructive">Quente</Badge>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">Morno</Badge>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-gray-200">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-start">
                <Mail className="h-4 w-4 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <span className="font-medium">E-mail:</span>
                  <p className="text-muted-foreground hover:text-primary cursor-pointer">Clique para editar</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-4 w-4 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <span className="font-medium">Telefone:</span>
                  <p className="text-muted-foreground">{lead.phone}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <span className="font-medium">Endereço:</span>
                  <p className="text-muted-foreground hover:text-primary cursor-pointer">Clique para editar</p>
                </div>
              </div>
              <div className="flex items-start">
                <CalendarIcon className="h-4 w-4 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <span className="font-medium">Desde:</span>
                  <p className="text-muted-foreground">{lead.date} (6 dias)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-white">
            <SheetHeader className="p-4 border-b flex-row justify-between items-center">
              <SheetTitle className="sr-only">Detalhes do Lead</SheetTitle>
              <SheetDescription className="sr-only">Veja os detalhes e histórico do lead.</SheetDescription>
              <div />
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </SheetClose>
            </SheetHeader>
            <div className="flex-1 p-6 overflow-y-auto">
              <Tabs defaultValue="historico">
                <TabsList>
                  <TabsTrigger value="historico">Histórico</TabsTrigger>
                  <TabsTrigger value="atividades">Atividades</TabsTrigger>
                  <TabsTrigger value="negocios">Negócios</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>
                <TabsContent value="historico" className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Histórico</h3>
                      <p className="text-sm text-muted-foreground">Veja o histórico do seu lead</p>
                    </div>
                    <div className="flex gap-2">
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Todos os Tipos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os Tipos</SelectItem>
                          <SelectItem value="tags">Tags</SelectItem>
                          <SelectItem value="updates">Atualizações</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Comentário
                      </Button>
                    </div>
                  </div>
                  <div>
                    {historyMock.map((item, index) => (
                      <TimelineItem key={index} icon={getIconForHistory(item.type)} isLast={index === historyMock.length - 1}>
                        <p className="font-medium">{item.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                      </TimelineItem>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="atividades">
                  <div className="text-center py-12">
                    <p>Nenhuma atividade encontrada.</p>
                  </div>
                </TabsContent>
                <TabsContent value="negocios">
                  <div className="text-center py-12">
                    <p>Nenhum negócio encontrado.</p>
                  </div>
                </TabsContent>
                <TabsContent value="chat">
                  <div className="text-center py-12">
                    <p>Nenhum chat encontrado.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}