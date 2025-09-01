"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function ClientSheetWrapper({
  children,
  trigger,
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="left"
        className={`
          w-[70%] bg-slate-100
          dark:bg-slate-800
        `}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}
