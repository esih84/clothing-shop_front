"use client";

import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { cn } from "@/shared/lib/utils";

interface JalaliDatePickerProps {
  /** Gregorian value as YYYY-MM-DD (the same thing sent to the backend). */
  value?: string;
  /** New Gregorian value (YYYY-MM-DD) or an empty string when cleared. */
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const inputClass =
  "w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-secondary bg-card text-foreground placeholder:text-muted-foreground rounded-xl";

/**
 * Jalali (Persian) date picker. Shows the user a Persian date but outputs a Gregorian
 * value (YYYY-MM-DD) so the backend stores the Gregorian date unchanged.
 */
export function JalaliDatePicker({
  value,
  onChange,
  placeholder = "انتخاب تاریخ",
  className,
  disabled,
}: JalaliDatePickerProps) {
  // Input Gregorian value → Jalali DateObject for display
  const displayValue = value
    ? new DateObject({
        date: value,
        format: "YYYY-MM-DD",
        calendar: gregorian,
        locale: gregorian_en,
      }).convert(persian, persian_fa)
    : "";

  return (
    <DatePicker
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      format="YYYY/MM/DD"
      value={displayValue}
      disabled={disabled}
      onChange={(date) => {
        const d = date as DateObject | null;
        if (!d) {
          onChange("");
          return;
        }
        // Jalali DateObject → Gregorian YYYY-MM-DD (without timezone shift)
        const g = new DateObject(d).convert(gregorian, gregorian_en);
        onChange(g.format("YYYY-MM-DD"));
      }}
      inputClass={cn(inputClass, className)}
      placeholder={placeholder}
      containerClassName="w-full"
      editable={false}
    />
  );
}
