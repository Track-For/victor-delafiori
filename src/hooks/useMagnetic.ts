"use client";

import { useCallback, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

export function useMagnetic(ref: RefObject<HTMLElement | null>, maxMovement = 10) {
  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!ref.current || event.pointerType === "touch") return;
      const bounds = ref.current.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * maxMovement * 2;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * maxMovement * 2;
      gsap.to(ref.current, { x, y, duration: 0.45, ease: "studio", overwrite: true });
    },
    [maxMovement, ref],
  );

  const onPointerLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.55, ease: "studio", overwrite: true });
  }, [ref]);

  return { onPointerMove, onPointerLeave };
}
