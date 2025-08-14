import { useState } from "react";
import { Kanban, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PipelineViewToggleProps {
  activeView: "kanban" | "list";
  onChange: (view: "kanban" | "list") => void;
}

export function PipelineViewToggle({ activeView, onChange }: PipelineViewToggleProps) {
  return (
    <div className="flex items-center bg-white border rounded-md overflow-hidden ml-auto">
      <Button 
        variant={activeView === "kanban" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("kanban")}
        className="rounded-none border-r h-9 px-3"
      >
        <Kanban className="h-4 w-4 mr-2" />
        Kanban
      </Button>
      <Button 
        variant={activeView === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("list")}
        className="rounded-none h-9 px-3"
      >
        <List className="h-4 w-4 mr-2" />
        Lista
      </Button>
    </div>
  );
}