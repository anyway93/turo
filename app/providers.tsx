"use client";

import { ThemeProvider } from "next-themes";
import { Toaster, TooltipProvider } from "@/components/ui";
import { TuroProvider } from "@/lib/turo-store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <TuroProvider>
          {children}
          <Toaster richColors position="top-right" />
        </TuroProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
