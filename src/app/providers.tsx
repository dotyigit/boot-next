"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TailwindIndicator } from "@/components/dev/tailwind-indicator";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      {children}
      <TailwindIndicator />
      <Toaster richColors />
    </TooltipProvider>
  );
}
