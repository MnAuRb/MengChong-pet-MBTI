"use client";

import { PetProvider } from "@/contexts/PetContext";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <PetProvider>{children}</PetProvider>;
}
