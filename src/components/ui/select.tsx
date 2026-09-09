"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { useSyncExternalStore } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption<T extends string | number> = {
  value: T;
  label: string;
};

function subscribeMobile(callback: () => void) {
  const media = window.matchMedia("(max-width: 639px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const getMobileSnapshot = () => window.matchMedia("(max-width: 639px)").matches;
const getServerSnapshot = () => false;

/**
 * The console's dropdown.
 *
 * A native `<select>` is correct behaviour wrapped in someone else's paint: the
 * popup is drawn by the OS, in the OS accent colour, at the OS's sizes, so it
 * never matches the interface around it. This keeps the behaviour — typeahead,
 * arrow keys, Escape, focus return — by building on Base UI's Select, and
 * paints the surface with the app's own tokens.
 */
export function Select<T extends string | number>({
  value,
  onChange,
  options,
  id,
  className,
  disabled,
  placeholder,
  mobileDropdownBelow = false,
  "aria-label": ariaLabel,
}: {
  value: T;
  onChange: (value: T) => void;
  options: readonly SelectOption<T>[];
  id?: string;
  className?: string;
  disabled?: boolean;
  /** Shown when the value matches no option — never as a selectable row. */
  placeholder?: string;
  mobileDropdownBelow?: boolean;
  "aria-label"?: string;
}) {
  const selected = options.find((option) => option.value === value);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, getServerSnapshot);
  const below = mobileDropdownBelow && isMobile;

  return (
    <SelectPrimitive.Root
      value={value}
      disabled={disabled}
      onValueChange={(next) => onChange(next as T)}
    >
      <SelectPrimitive.Trigger
        id={id}
        aria-label={ariaLabel}
        className={cn(
          "flex h-9 items-center justify-between gap-2 rounded-md border border-ws-line bg-ws-panel px-2.5 text-base font-medium text-ws-fg transition-colors outline-none select-none",
          "hover:bg-ws-card focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
          "data-[popup-open]:bg-ws-card disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
      >
        <SelectPrimitive.Value
          className={cn("truncate", !selected && "text-ws-faint")}
        >
          {selected?.label ?? placeholder ?? ""}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon className="flex shrink-0 text-ws-faint">
          <ChevronDown aria-hidden="true" className="size-4" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          side="bottom"
          align={below ? "start" : undefined}
          collisionAvoidance={below ? { side: "none", align: "shift" } : undefined}
          sideOffset={6}
          alignItemWithTrigger={false}
          className="z-50 outline-none"
        >
          <SelectPrimitive.Popup
            className={cn(
              "max-h-72 min-w-(--anchor-width) overflow-y-auto rounded-lg border border-ws-line bg-ws-panel p-1 text-ws-fg shadow-(--shadow-dropdown) outline-none",
              "origin-(--transform-origin) transition-[transform,opacity] data-[ending-style]:scale-98 data-[ending-style]:opacity-0 data-[starting-style]:scale-98 data-[starting-style]:opacity-0",
              below && "w-(--anchor-width) min-w-0 max-w-[calc(100vw-2rem)] max-h-[min(18rem,var(--available-height))]",
            )}
          >
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className={cn(
                  "flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-2 text-base outline-none select-none",
                  // Highlight follows the keyboard as well as the pointer, and
                  // it is the app's own surface — never the OS accent.
                  "data-[highlighted]:bg-ws-card data-[selected]:font-medium",
                )}
              >
                {/* The slot is always in the layout and only its contents
                    come and go, so labels do not shift as the selection moves. */}
                <span className="flex size-4 shrink-0 items-center justify-center text-brand">
                  <SelectPrimitive.ItemIndicator>
                    <Check aria-hidden="true" className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText className={cn("flex-1", below && "min-w-0 whitespace-normal break-words")}>
                  {option.label}
                </SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
