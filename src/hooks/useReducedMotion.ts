"use client";

import { useEffect, useState } from "react";
import { subscribeToMediaQuery } from "@/lib/mediaQuery";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    return subscribeToMediaQuery(media, update);
  }, []);

  return reduced;
}
