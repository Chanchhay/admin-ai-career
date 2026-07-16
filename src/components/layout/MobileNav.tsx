"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open navigation menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-heading lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[260px] bg-canvas p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}