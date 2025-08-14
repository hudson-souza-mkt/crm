"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DateRangePickerProps = {
  className?: string;
  onChange: (dateRange: DateRange | undefined) => void;
};

export function DateRangePicker({
  className,
  onChange,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  const [presetOption, setPresetOption] = React.useState<string>("thisMonth");

  // Predefined date ranges
  const presets = {
    today: {
      label: "Hoje",
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
    },
    yesterday: {
      label: "Ontem",
      dateRange: {
        from: addDays(new Date(), -1),
        to: addDays(new Date(), -1),
      },
    },
    thisWeek: {
      label: "Esta semana",
      dateRange: {
        from: addDays(new Date(), -new Date().getDay()),
        to: new Date(),
      },
    },
    lastWeek: {
      label: "Semana passada",
      dateRange: {
        from: addDays(new Date(), -new Date().getDay() - 7),
        to: addDays(new Date(), -new Date().getDay() - 1),
      },
    },
    thisMonth: {
      label: "Este mês",
      dateRange: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
    },
    lastMonth: {
      label: "Mês passado",
      dateRange: {
        from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      },
    },
    last30Days: {
      label: "Últimos 30 dias",
      dateRange: {
        from: addDays(new Date(), -30),
        to: new Date(),
      },
    },
    last90Days: {
      label: "Últimos 90 dias",
      dateRange: {
        from: addDays(new Date(), -90),
        to: new Date(),
      },
    },
    thisYear: {
      label: "Este ano",
      dateRange: {
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
      },
    },
    custom: {
      label: "Personalizado",
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
    },
  };

  const handlePresetChange = (value: string) => {
    setPresetOption(value);

    if (value !== "custom") {
      const newRange = presets[value as keyof typeof presets].dateRange;
      setDate(newRange);
      onChange(newRange);
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDate(range);
    
    if (range?.from && range?.to) {
      // Set preset to custom if the date range doesn't match any preset
      setPresetOption("custom");
      onChange(range);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center gap-2">
        <Select
          value={presetOption}
          onValueChange={handlePresetChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(presets).map(([key, preset]) => (
              <SelectItem key={key} value={key}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-auto justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                    {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                  </>
                ) : (
                  format(date.from, "dd/MM/yyyy", { locale: ptBR })
                )
              ) : (
                <span>Selecione datas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}