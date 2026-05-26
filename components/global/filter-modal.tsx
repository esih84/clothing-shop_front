"use client"

import { useState, useRef, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface FilterOption {
  id: string
  label: string
  count?: number
  checked?: boolean
}

interface FilterGroup {
  id: string
  title: string
  type: "checkbox" | "radio" | "color"
  options: FilterOption[]
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simple slider component for price range
function PriceSlider({ min, max, value, onChange }: { min: number; max: number; value: [number, number]; onChange: (val: [number, number]) => void }) {
  const [dragging, setDragging] = useState<null | 0 | 1>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Always keep minValue <= maxValue
  const minValue = Math.min(value[0], value[1]);
  const maxValue = Math.max(value[0], value[1]);

  // Convert value to percent
  const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

  // Handle mouse/touch events
  const handleDrag = (idx: 0 | 1, clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let percent = (clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    let newValue = Math.round(min + percent * (max - min));
    let newRange: [number, number] = [...value] as [number, number];
    newRange[idx] = newValue;
    // Always call onChange with [min, max] order
    if (newRange[0] > newRange[1]) {
      onChange([newRange[1], newRange[0]]);
    } else {
      onChange(newRange);
    }
  };

  const handleThumbDown = (idx: 0 | 1) => (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(idx);
    e.stopPropagation();
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (dragging === null) return;
    let clientX = (e as MouseEvent).clientX;
    if ((e as TouchEvent).touches) clientX = (e as TouchEvent).touches[0].clientX;
    handleDrag(dragging, clientX);
  };

  const handleUp = () => setDragging(null);

  useEffect(() => {
    if (dragging !== null) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchend", handleUp);
      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("mouseup", handleUp);
        window.removeEventListener("touchend", handleUp);
      };
    }
  });

  return (
    <div className="w-full px-2 py-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>{max.toLocaleString()} $</span>
        <span>{min.toLocaleString()} $</span>
      </div>
      <div ref={trackRef} className="relative h-2 bg-gray-200 rounded-full cursor-pointer">
        <div
          className="absolute h-2 bg-[#670626] rounded-full"
          style={{
            left: `${getPercent(minValue)}%`,
            width: `${getPercent(maxValue) - getPercent(minValue)}%`,
            top: 0,
          }}
        />
        {[0, 1].map((idx) => (
          <div
            key={idx}
            className={`absolute w-5 h-5 bg-white border-2 border-[#670626] rounded-full shadow -top-1.5 z-10 cursor-pointer transition-transform ${dragging === idx ? "scale-110" : ""}`}
            style={{ left: `calc(${getPercent(value[idx])}% - 10px)` }}
            onMouseDown={handleThumbDown(idx as 0 | 1)}
            onTouchStart={handleThumbDown(idx as 0 | 1)}
          />
        ))}
      </div>
      <div className="flex justify-between mt-3 text-sm">
        <span>تا <b>{maxValue.toLocaleString()} $</b></span>
        <span>از <b>{minValue.toLocaleString()} $</b></span>
      </div>
    </div>
  );
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  // Sample filter data
  const filterGroups: FilterGroup[] = [
    {
      id: "gender",
      title: "جنسیت",
      type: "checkbox",
      options: [
        { id: "men", label: "مردانه", count: 1276, checked: false },
        { id: "women", label: "زنانه", count: 897, checked: false },
      ],
    },
    {
      id: "size",
      title: "سایز",
      type: "radio",
      options: [
        { id: "s", label: "کوچک (S)", checked: true },
        { id: "m", label: "متوسط (M)", checked: false },
        { id: "l", label: "بزرگ (L)", checked: false },
        { id: "xl", label: "خیلی بزرگ (XL)", checked: false },
        { id: "xxl", label: "دو ایکس لارج (XXL)", checked: false },
      ],
    },
    {
      id: "color",
      title: "رنگ",
      type: "color",
      options: [
        { id: "black", label: "مشکی" },
        { id: "white", label: "سفید" },
        { id: "grey", label: "خاکستری" },
        { id: "green", label: "سبز" },
        { id: "blue", label: "آبی" },
        { id: "orange", label: "نارنجی" },
        { id: "red", label: "قرمز" },
        { id: "pink", label: "صورتی" },
        { id: "yellow", label: "زرد" },
        { id: "purple", label: "بنفش" },
      ],
    },
    {
      id: "price",
      title: "قیمت",
      type: "checkbox",
      options: [
        { id: "under30", label: "زیر ۳۰ دلار", count: 63, checked: false },
        { id: "30-50", label: "۳۰ تا ۵۰ دلار", count: 721, checked: false },
      ],
    },
  ];

  const [filters, setFilters] = useState(filterGroups)

  // Extract price min/max from filterGroups
  const priceGroup = filterGroups.find(g => g.id === "price");
  // Parse numeric values from price options (e.g., "under30" => 0, "30-50" => 30, 50)
  let priceValues: number[] = [];
  if (priceGroup) {
    priceGroup.options.forEach(opt => {
      if (/under/i.test(opt.id) && /\d+/.test(opt.id)) {
        priceValues.push(0);
        const match = opt.id.match(/\d+/);
        if (match) priceValues.push(Number(match[0]));
      } else if (/\d+-\d+/.test(opt.id)) {
        const [min, max] = opt.id.split("-").map(Number);
        priceValues.push(min, max);
      } else if (/\d+/.test(opt.id)) {
        priceValues.push(Number(opt.id.match(/\d+/)![0]));
      }
    });
  }
  const priceMin = priceValues.length ? Math.min(...priceValues) : 0;
  const priceMax = priceValues.length ? Math.max(...priceValues) : 100;
  const [priceRange, setPriceRange] = useState<[number, number]>([priceMin, priceMax]);

  // Handle filter apply
  const handleApplyFilters = () => {
    // Collect selected filters
    const selected = filters.reduce((acc, group) => {
      if (group.type === "checkbox") {
        acc[group.id] = group.options.filter(o => o.checked).map(o => o.id);
      } else if (group.type === "radio") {
        const sel = group.options.find(o => o.checked);
        acc[group.id] = sel ? sel.id : null;
      } else if (group.type === "color") {
        const sel = group.options.find(o => o.checked);
        acc[group.id] = sel ? sel.id : null;
      }
      return acc;
    }, {} as Record<string, any>);
    selected.priceRange = [Math.min(...priceRange), Math.max(...priceRange)];
    // Log to console
    console.log("Selected Filters:", selected);
    // Close dialog
    onClose();
  };

  // Handle checkbox change
  const handleCheckboxChange = (groupId: string, optionId: string) => {
    setFilters((prevFilters) =>
      prevFilters.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            options: group.options.map((option) => {
              if (option.id === optionId) {
                return { ...option, checked: !option.checked }
              }
              return option
            }),
          }
        }
        return group
      }),
    )
  }

  // Handle radio change
  const handleRadioChange = (groupId: string, optionId: string) => {
    setFilters((prevFilters) =>
      prevFilters.map((group) => {
        if (group.id === groupId) {
          return {  
            ...group,
            options: group.options.map((option) => ({
              ...option,
              checked: option.id === optionId,
            })),
          }
        }
        return group
      }),
    )
  }

  // Color selection state for color group
  const handleColorSelect = (groupId: string, optionId: string) => {
    setFilters((prevFilters) =>
      prevFilters.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            options: group.options.map((option) => ({
              ...option,
              checked: option.id === optionId,
            })),
          };
        }
        return group;
      })
    );
  };

  return (
    <Drawer open={isOpen}  onOpenChange={onClose}>
      <DrawerContent className="h-[90vh] md:h-full w-full max-w-md mx-auto md:mx-0 shadow-2xl bg-white">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2 text-2xl font-bold text-[#670626]">

              فیلتر محصولات
            </DrawerTitle>
            <DrawerDescription className="text-gray-500 text-right">برای جستجوی دقیق‌تر، فیلترهای مورد نظر را انتخاب کنید</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-8 overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
            {filters.map((group) => (
              <div key={group.id} className="pb-4 last:border-b-0 border-b border-[#E3A7C4]/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#670626] text-base flex items-center gap-1">
                    {group.title}
                  </h3>
                </div>
                <div className="space-y-2">
                  {group.type === "checkbox" && group.id === "gender" && (
                    <div className="flex gap-4 justify-start my-2">
                      {group.options.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleCheckboxChange(group.id, option.id)}
                          className={`flex flex-col items-center justify-center px-6 py-2 rounded-xl border-2 transition-all duration-150 shadow-sm text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#670626] gap-2
                            ${option.checked ? "bg-[#670626] text-white border-[#670626] scale-105" : "bg-white text-[#670626] border-[#E3A7C4] hover:bg-[#fbeaf3]"}`}
                        >
                            {/* No icon, just label */}
                          <span>{option.label}</span>
                          {/* {option.count !== undefined && (
                            <span className="text-xs font-medium mt-1 text-gray-300">{option.count}</span>
                          )} */}
                        </button>
                      ))}
                    </div>
                  )}
                  {group.type === "checkbox" && group.id !== "gender" && (
                    <div className="space-y-2">
                      {group.options.map((option) => (
                        <label key={option.id} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={option.checked}
                            onChange={() => handleCheckboxChange(group.id, option.id)}
                            className="w-4 h-4 rounded border-gray-300 text-[#670626] focus:ring-[#670626] accent-[#670626]"
                          />
                          <span className="ml-2 group-hover:text-[#670626] transition-colors">{option.label}</span>
                          {option.count !== undefined && (
                            <span className="ml-auto text-gray-400 text-xs font-medium">{option.count}</span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}

                  {group.type === "radio" && (
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleRadioChange(group.id, option.id)}
                          className={`px-4 py-2 rounded-full text-sm border transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#670626] ${option.checked ? "bg-[#670626] text-white border-[#670626] shadow" : "bg-gray-100 text-gray-700 border-gray-200 hover:border-[#E3A7C4]"}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {group.type === "color" && (
                    <div className="grid grid-cols-5 gap-3">
                      {group.options.map((option) => {
                        const colorClass =
                          {
                            black: "bg-black",
                            white: "bg-white border border-gray-200",
                            grey: "bg-gray-400",
                            green: "bg-green-500",
                            blue: "bg-blue-500",
                            orange: "bg-orange-500",
                            red: "bg-red-500",
                            pink: "bg-pink-500",
                            yellow: "bg-yellow-500",
                            purple: "bg-purple-500",
                          }[option.id] || "bg-gray-200";
                        const isChecked = !!option.checked;
                        return (
                          <div key={option.id} className="flex flex-col items-center">
                            <button
                              className={`w-8 h-8 rounded-full border-2 transition-all duration-150 mb-1 focus:outline-none focus:ring-2 focus:ring-[#670626] ${colorClass} ${isChecked ? "ring-2 ring-[#670626] scale-110" : "hover:scale-105 border-transparent"}`}
                              aria-label={option.label}
                              onClick={() => handleColorSelect(group.id, option.id)}
                            />
                            <span className={`text-xs ${isChecked ? "text-[#670626] font-semibold" : "text-gray-600"}`}>{option.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {group.id === "price" && (
                    <PriceSlider
                      min={priceMin}
                      max={priceMax}
                      value={priceRange}
                      onChange={setPriceRange}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <DrawerFooter className="flex flex-col gap-2 mt-2">
            <button
              className="px-4 py-2 bg-[#670626] hover:bg-[#ffbdc5]/80 text-white rounded-lg text-base font-semibold shadow transition-colors"
              onClick={handleApplyFilters}
            >
              اعمال فیلتر
            </button>
            <DrawerClose asChild>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors">بازنشانی</button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
