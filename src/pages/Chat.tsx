import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Button } from "@/components/ui/button";
import { Phone, LayoutList, Zap, Lightbulb, Search, Calendar, Tag, MessagesSquare, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

export default function Chat() {
  const isMobile = useIsMobile();
  const [selectedChat, setSelectedChat] = useState(1); // ID do chat selecionado

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col">
      <div className="flex h-full">
        {/* Sidebar de navegação */}
        <div className="hidden md:flex flex-col w-56 bg-white border-r">
          <div className="flex items-center p-4 border-b">
            <div className="bg-primary rounded-full p-2">
              <MessagesSquare className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-normal text-primary ml-2">atendechat</h2>
          </div>
          
          <nav className="p-2 space-y-1 pt-4">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <Phone className="mr-2 h-4 w-4" />
              Atendimentos
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <LayoutList className="mr-2 h-4 w-4" />
              Kanban
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <Zap className="mr-2 h-4 w-4" />
              Respostas Rápidas
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <Lightbulb className="mr-2 h-4 w-4" />
              Tarefas
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <Search className="mr-2 h-4 w-4" />
              Contatos
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              Agendamentos
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <Tag className="mr-2 h-4 w-4" />
              Tags
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <MessagesSquare className="mr-2 h-4 w-4" />
              Bate-papo Interno
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <HelpCircle className="mr-2 h-4 w-4" />
              Ajuda
            </Button>
          </nav>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col">
          <div className="bg-primary text-white px-4 py-2">
            <span>Olá Suporte, Bem vindo a Space Sales!</span>
          </div>
          
          <div className="flex-1 flex flex-col">
            <Tabs defaultValue="abertas" className="flex-1 flex flex-col">
              <div className="bg-white border-b">
                <TabsList className="p-0 h-auto bg-transparent">
                  <TabsTrigger 
                    value="abertas" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-4 px-8"
                  >
                    ABERTAS
                  </TabsTrigger>
                  <TabsTrigger 
                    value="resolvidos" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-4 px-8"
                  >
                    RESOLVIDOS
                  </TabsTrigger>
                  <TabsTrigger 
                    value="busca" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-4 px-8"
                  >
                    BUSCA
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="abertas" className="flex-1 flex mt-0">
                <div className="w-80 border-r flex flex-col">
                  <div className="p-3 flex justify-between items-center border-b">
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      NOVO
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Fila</span>
                      <select className="text-sm border rounded px-2 py-1">
                        <option>Todos</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <Tabs defaultValue="atendendo" className="flex-1 flex flex-col">
                      <TabsList className="w-full rounded-none bg-transparent">
                        <TabsTrigger value="atendendo" className="flex-1 rounded-none data-[state=active]:bg-white">
                          ATENDENDO
                          <Badge className="ml-1 bg-primary">3</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="aguardando" className="flex-1 rounded-none data-[state=active]:bg-white">
                          AGUARDANDO
                          <Badge className="ml-1 bg-red-500">1</Badge>
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="atendendo" className="mt-0 flex-1 overflow-auto">
                        <ConversationList />
                      </TabsContent>
                      
                      <TabsContent value="aguardando" className="mt-0 flex-1">
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          Nenhum atendimento aguardando no momento
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
                
                {!isMobile && (
                  <div className="flex-1">
                    <ChatWindow />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="resolvidos" className="flex-1 mt-0">
                <div className="p-4">
                  <Input 
                    placeholder="Buscar atendimentos resolvidos..." 
                    className="mb-4"
                  />
                  <div className="text-center text-sm text-muted-foreground p-8">
                    Nenhum atendimento resolvido encontrado
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="busca" className="flex-1 mt-0">
                <div className="p-4">
                  <Input 
                    placeholder="Buscar em todos os atendimentos..." 
                    className="mb-4"
                  />
                  <div className="text-center text-sm text-muted-foreground p-8">
                    Use a busca acima para encontrar atendimentos
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}