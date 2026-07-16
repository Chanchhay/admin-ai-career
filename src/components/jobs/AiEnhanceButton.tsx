"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const POLISH = `\n\nYou will partner with product, design and engineering leaders to ship measurable outcomes, own delivery end to end, and help raise the technical bar across the team.`;

type AiEnhanceButtonProps = {
  value: string;
  onEnhanced: (value: string) => void;
};

export function AiEnhanceButton({ value, onEnhanced }: AiEnhanceButtonProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleClick = async () => {
    if (!value.trim()) {
      toast("Write a draft first, then let AI polish it.");
      return;
    }

    setIsEnhancing(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    onEnhanced(`${value.trimEnd()}${POLISH}`);
    setIsEnhancing(false);
    toast.success("Description enhanced.");
  };

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={isEnhancing}
      aria-label="Enhance job description with AI"
      className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800 transition-all duration-200 hover:bg-amber-200 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
    >
      {isEnhancing ? (
        <Loader2 aria-hidden="true" className="size-3 animate-spin" />
      ) : (
        <Sparkles aria-hidden="true" className="size-3" />
      )}
      {isEnhancing ? "Enhancing" : "AI Enhance"}
    </button>
  );
}