import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { PipelineColumn } from "@/components/pipelines/PipelineColumn";
import { DealCard } from "@/components/pipelines/DealCard";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DealInfo } from "@/components/deals/DealInfo"; // Importar o novo componente

// Dados de exemplo
const initialColumns = {
  lead: {
    id: "lead",
    title: "Lead",
    deals: [
      { id: "deal-1", title: "Novo site para Café Saboroso", value: 15000 },
      { id: "deal-2", title: "App de delivery para Pizzaria Delícia", value: 30000 },
    ],
  },
  qualified: {
    id: "qualified",
    title: "Qualificado",
    deals: [
      { id: "deal-3", title: "Sistema de gestão para Academia Foco", value: 45000 },
    ],
  },
  proposal: {
    id: "proposal",
    title: "Proposta Enviada",
    deals: [
      { id: "deal-4", title: "Desenvolvimento de E-commerce para TechCorp", value: 75000 },
      { id: "deal-5", title: "Manutenção de software para Logística Rápida", value: 12000 },
    ],
  },
  negotiation: {
    id: "negotiation",
    title: "Em Negociação",
    deals: [
      { id: "deal-6", title: "Consultoria de SEO para Marketing Criativo", value: 8000 },
    ],
  },
};

export default function Pipelines() {
  const [columns, setColumns] = useState(initialColumns);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = active.data.current?.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId;

    if (activeContainer !== overContainer) {
      setColumns((prev) => {
        const activeItems = prev[activeContainer].deals;
        const overItems = prev[overContainer].deals;

        const activeIndex = activeItems.findIndex((item) => item.id === active.id);
        const [movedItem] = activeItems.splice(activeIndex, 1);

        return {
          ...prev,
          [activeContainer]: {
            ...prev[activeContainer],
            deals: activeItems,
          },
          [overContainer]: {
            ...prev[overContainer],
            deals: [...overItems, movedItem],
          },
        };
      });
    }
  };

  const handleCardClick = (deal: any) => {
    setSelectedDeal(deal);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Pipeline de Vendas</h1>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex gap-4 p-4 overflow-x-auto">
          {Object.values(columns).map((column) => (
            <SortableContext
              key={column.id}
              items={column.deals.map((deal) => deal.id)}
              strategy={rectSortingStrategy}
            >
              <PipelineColumn id={column.id} title={column.title}>
                {column.deals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    id={deal.id}
                    title={deal.title}
                    value={deal.value}
                    onClick={() => handleCardClick(deal)}
                  />
                ))}
              </PipelineColumn>
            </SortableContext>
          ))}
        </div>
      </DndContext>

      <Sheet open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
        <SheetContent className="sm:max-w-3xl w-full">
          <SheetHeader>
            <SheetTitle>{selectedDeal?.title}</SheetTitle>
            <SheetDescription>
              Gerencie todos os detalhes deste negócio.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <Tabs defaultValue="info" className="w-full">
              <TabsList>
                <TabsTrigger value="info">Informações do Negócio</TabsTrigger>
                <TabsTrigger value="activities">Atividades</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="mt-4">
                <DealInfo />
              </TabsContent>
              <TabsContent value="activities" className="mt-4">
                <p>Aqui ficarão as atividades relacionadas ao negócio.</p>
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <p>Aqui ficará o histórico de alterações do negócio.</p>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}