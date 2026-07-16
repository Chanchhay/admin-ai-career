import type { ReactNode } from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

type FieldWrapperProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function FieldWrapper({ label, children, className }: FieldWrapperProps) {
  return (
    <FormItem className={cn("space-y-2", className)}>
      <FormLabel className="label-section">{label}</FormLabel>
      <FormControl>{children}</FormControl>
      <FormMessage className="text-xs" />
    </FormItem>
  );
}