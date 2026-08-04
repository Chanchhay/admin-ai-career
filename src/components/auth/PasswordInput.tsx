"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
  label: string;
  error?: string;
};

export function PasswordInput({ label, id, error, className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label htmlFor={inputId} className="text-sm font-medium text-heading">
        {label}
        {props.required ? <span className="text-error"> *</span> : null}
      </label>
      <div className="relative mt-1">
        <Input
          id={inputId}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          className={cn("rounded-xl pr-11", className)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-1 top-1/2 size-9 -translate-y-1/2"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )}
        </Button>
      </div>
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
    </div>
  );
}
