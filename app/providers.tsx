"use client";

import { Toaster, TooltipProvider } from "@/components/ui";
import { TuroProvider } from "@/lib/turo-store";
import { LocaleProvider } from "@/lib/locale";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <LocaleProvider>
        <TuroProvider>
          {children}
          <Toaster richColors position="top-right" />
        </TuroProvider>
      </LocaleProvider>
    </TooltipProvider>
  );
}
