"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { useProvinces, getCities } from "@/features/location/queries";
import { normalizePersian } from "@/shared/lib/persian-text";

interface DropdownProps {
  value: string;
  placeholder: string;
  options: string[];
  disabled?: boolean;
  onSelect: (value: string) => void;
  triggerClassName: string;
}

function Dropdown({
  value,
  placeholder,
  options,
  disabled,
  onSelect,
  triggerClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const filtered = useMemo(() => {
    const q = normalizePersian(query);
    if (!q) return options;
    return options.filter((o) => normalizePersian(o).includes(q));
  }, [options, query]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setOpen((v) => !v);
          setQuery("");
        }}
        className={`w-full flex items-center justify-between gap-2 text-right ${triggerClassName} ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <span className={value ? "" : "text-muted-foreground"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 left-0 mt-1 bg-card border border-border z-20 shadow-md rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جست‌وجو..."
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-sm text-muted-foreground text-center">
                موردی پیدا نشد
              </p>
            ) : (
              filtered.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-primary/15 text-right"
                >
                  <span>{option}</span>
                  {value === option && (
                    <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ProvinceCitySelectProps {
  province: string;
  city: string;
  onChange: (next: { province: string; city: string }) => void;
  /** Classes for the two trigger buttons, so each form keeps its own field sizing. */
  triggerClassName: string;
  labelClassName?: string;
  error?: string | null;
}

/**
 * Province → city picker shared by the checkout form and the profile address
 * form, both reading the same list from `GET /locations/provinces`.
 * Changing the province clears the city, so the two can never disagree.
 */
export default function ProvinceCitySelect({
  province,
  city,
  onChange,
  triggerClassName,
  labelClassName = "block text-sm md:text-base text-muted-foreground mb-1",
  error,
}: ProvinceCitySelectProps) {
  const { provinces, isPending } = useProvinces();
  const provinceNames = useMemo(
    () => provinces.map((p) => p.name),
    [provinces],
  );
  const cities = getCities(provinces, province);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClassName}>
            استان <span className="text-secondary">*</span>
          </label>
          <Dropdown
            value={province}
            placeholder={isPending ? "در حال بارگذاری…" : "انتخاب استان"}
            options={provinceNames}
            disabled={isPending}
            onSelect={(next) =>
              onChange({ province: next, city: next === province ? city : "" })
            }
            triggerClassName={triggerClassName}
          />
        </div>
        <div>
          <label className={labelClassName}>
            شهر <span className="text-secondary">*</span>
          </label>
          <Dropdown
            value={city}
            placeholder={province ? "انتخاب شهر" : "ابتدا استان را انتخاب کنید"}
            options={cities}
            disabled={!province || isPending}
            onSelect={(next) => onChange({ province, city: next })}
            triggerClassName={triggerClassName}
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
