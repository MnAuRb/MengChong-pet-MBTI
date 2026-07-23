"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import type { TrackEvent } from "@/types";

interface Props {
  event: TrackEvent;
}

export default function TrackPageView({ event }: Props) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    track(event);
  }, [event]);

  return null;
}
