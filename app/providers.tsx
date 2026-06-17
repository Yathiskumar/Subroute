"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProgressSync } from "@/components/progress/ProgressSync";
import { QuizSync } from "@/components/progress/QuizSync";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthProvider>
        <ProgressSync />
        <QuizSync />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
