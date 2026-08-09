"use client";

import { PetProvider } from "@/contexts/PetContext";
import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <PetProvider>
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
    </PetProvider>
  );
}
