"use client";

import { useEffect, useState } from "react";
import { subscribeToMediaQuery } from "@/lib/mediaQuery";

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setIsDesktop(media.matches);
    update();
    return subscribeToMediaQuery(media, update);
  }, []);

  return isDesktop;
}
