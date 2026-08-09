"use client";

import { PetProvider } from "@/contexts/PetContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <PetProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </PetProvider>
  );
}
