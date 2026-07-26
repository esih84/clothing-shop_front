"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

type StepperVariant = "detail" | "cart";

interface QuantityStepperProps {
  quantity: number;
  /** Minimum quantity (default 1). */
  min?: number;
  /** Maximum quantity (usually the stock); the + button is disabled at this limit. */
  max?: number;
  disabled?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  /** At the minimum quantity, show a trash icon instead of the minus icon. */
  showTrashAtMin?: boolean;
  /** Appearance: "detail" for the product page, "cart" for the cart page. */
  variant?: StepperVariant;
}

const styles = {
  detail: {
    container:
      "flex items-center border border-border overflow-hidden rounded-xl",
    minus:
      "px-4 py-4 bg-primary/15 hover:bg-primary/60 text-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
    plus: "px-4 py-4 bg-secondary hover:bg-secondary/90 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-secondary",
    value: "px-6 py-3 text-lg font-bold bg-card tabular-nums",
    icon: "w-5 h-5",
  },
  cart: {
    container:
      "flex items-center rounded-xl border border-border overflow-hidden flex-shrink-0",
    minus:
      "px-2.5 py-1.5 md:px-4 md:py-2 bg-primary/15 hover:bg-primary/60 text-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
    plus: "px-2.5 py-1.5 md:px-4 md:py-2 bg-primary/15 hover:bg-primary/60 text-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
    value: "px-3 md:px-4 text-base md:text-lg tabular-nums",
    icon: "w-4 h-4 md:w-5 md:h-5",
  },
} as const;

/** Shared quantity stepper; used on the product and cart pages. */
export function QuantityStepper({
  quantity,
  min = 1,
  max,
  disabled = false,
  onIncrement,
  onDecrement,
  showTrashAtMin = false,
  variant = "cart",
}: QuantityStepperProps) {
  const s = styles[variant];
  const atMax = max != null && quantity >= max;
  const showTrash = showTrashAtMin && quantity <= min;

  return (
    <div className={s.container}>
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled}
        className={s.minus}
        aria-label={showTrash ? "حذف از سبد خرید" : "کاهش تعداد"}
      >
        {showTrash ? (
          <Trash2 className={s.icon} />
        ) : (
          <Minus className={s.icon} />
        )}
      </button>
      <span className={s.value}>{quantity}</span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled || atMax}
        className={s.plus}
        aria-label="افزایش تعداد"
      >
        <Plus className={s.icon} />
      </button>
    </div>
  );
}
