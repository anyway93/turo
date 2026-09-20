"use client";

import { Toaster, TooltipProvider } from "@/components/ui";
import { TuroProvider } from "@/lib/turo-store";
import { LocaleProvider } from "@/lib/locale";
import { DocumentTitle } from "@/components/layout/document-title/document-title";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <LocaleProvider>
        <TuroProvider>
          <DocumentTitle />
          {children}
          <Toaster richColors position="top-right" />
        </TuroProvider>
      </LocaleProvider>
    </TooltipProvider>
  );
}
