"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
    onChange: (date: Date) => void;
    value: Date;
    disabled?: boolean;
}

export default function DatePicker({ onChange, value = new Date(), disabled = false }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
                  )}
                  disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={date => {
            setDate(date);
            onChange(date ?? new Date());
          }}
          autoFocus
          startMonth={new Date(1900, 11)}
            endMonth={new Date()}
            disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  )
}
