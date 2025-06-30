import { useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSectionProps {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

export function FilterSection({ title, children, defaultOpen = false }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="flex items-center justify-between w-full py-2 text-sm font-medium text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <ChevronRight className={cn("h-4 w-4 mr-2 transition-transform", isOpen && "transform rotate-90")} />
          {title}
        </div>
        {!isOpen && <Plus className="h-4 w-4 text-muted-foreground" />}
      </button>
      {isOpen && <div className="pt-1 pb-3 pl-6 space-y-2">{children}</div>}
    </div>
  );
}