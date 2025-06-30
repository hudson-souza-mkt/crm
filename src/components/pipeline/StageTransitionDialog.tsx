import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface StageTransitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromStage: string;
  toStage: string;
  isClosing: boolean; // Se está indo para "Ganho" ou "Perdido"
  onConfirm: (reason: string, comments: string) => void;
}

// Razões para ganho de negócio
const winReasons = [
  "Produto adequado às necessidades",
  "Preço competitivo",
  "Atendimento de qualidade",
  "Reputação da empresa",
  "Funcionalidades superiores",
  "Recomendação de terceiros",
  "Outro"
];

// Razões para perda de negócio
const lossReasons = [
  "Preço alto",
  "Falta de funcionalidades",
  "Escolheu concorrente",
  "Timing inadequado",
  "Mudança de prioridades",
  "Falta de orçamento",
  "Sem necessidade atual",
  "Outro"
];

export function StageTransitionDialog({ 
  open, 
  onOpenChange, 
  fromStage, 
  toStage, 
  isClosing, 
  onConfirm 
}: StageTransitionDialogProps) {
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");

  const handleConfirm = () => {
    onConfirm(reason, comments);
    setReason("");
    setComments("");
  };

  // Escolha a lista de razões com base no tipo de transição
  const reasonOptions = isClosing ? 
    (toStage === "Ganho" ? winReasons : lossReasons) : 
    [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isClosing 
              ? (toStage === "Ganho" ? "Ganhar negócio" : "Perder negócio") 
              : `Mover de ${fromStage} para ${toStage}`}
          </DialogTitle>
          <DialogDescription>
            {isClosing 
              ? (toStage === "Ganho" 
                ? "Registre o motivo pelo qual o negócio foi ganho e adicione comentários relevantes." 
                : "Registre o motivo da perda para ajudar a melhorar processos futuros.")
              : "Adicione comentários sobre esta mudança de etapa."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {isClosing && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Motivo
              </Label>
              <Select
                value={reason}
                onValueChange={setReason}
              >
                <SelectTrigger id="reason" className="col-span-3">
                  <SelectValue placeholder="Selecione um motivo" />
                </SelectTrigger>
                <SelectContent>
                  {reasonOptions.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="comments" className="text-right pt-2">
              Comentários
            </Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Adicione detalhes sobre esta mudança..."
              className="col-span-3 resize-none"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isClosing && !reason}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}