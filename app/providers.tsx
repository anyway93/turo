"use client";

import { Toaster, TooltipProvider } from "@/components/ui";
import { TuroProvider } from "@/lib/turo-store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <TuroProvider>
        {children}
        <Toaster richColors position="top-right" />
      </TuroProvider>
    </TooltipProvider>
  );
}
