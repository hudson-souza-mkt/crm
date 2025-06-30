import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  // Opções de cores com suas classes Tailwind
  const colorOptions = [
    { name: "Azul", value: "blue", bg: "bg-blue-500", hover: "hover:bg-blue-600" },
    { name: "Roxo", value: "purple", bg: "bg-purple-500", hover: "hover:bg-purple-600" },
    { name: "Verde", value: "green", bg: "bg-green-500", hover: "hover:bg-green-600" },
    { name: "Âmbar", value: "amber", bg: "bg-amber-500", hover: "hover:bg-amber-600" },
    { name: "Vermelho", value: "red", bg: "bg-red-500", hover: "hover:bg-red-600" },
    { name: "Rosa", value: "pink", bg: "bg-pink-500", hover: "hover:bg-pink-600" },
    { name: "Índigo", value: "indigo", bg: "bg-indigo-500", hover: "hover:bg-indigo-600" },
    { name: "Ciano", value: "cyan", bg: "bg-cyan-500", hover: "hover:bg-cyan-600" },
    { name: "Cinza", value: "gray", bg: "bg-gray-500", hover: "hover:bg-gray-600" },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 rounded-full p-0 flex items-center justify-center"
          style={{ background: `var(--${selectedColor}-500)` }}
        >
          <span className="sr-only">Escolher cor</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Escolha uma cor para esta etapa</h4>
          <div className="grid grid-cols-3 gap-2">
            {colorOptions.map((color) => (
              <Button
                key={color.value}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-full rounded-md p-0 flex items-center justify-center",
                  color.bg,
                  color.hover,
                  "text-white"
                )}
                onClick={() => onColorChange(color.value)}
              >
                {color.value === selectedColor && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
                <span className="sr-only">{color.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}