"use client";

import { ArrowUpRight } from "lucide-react";
import { Link } from "next-view-transitions";
import { useRef } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

type MagneticButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "light" | "dark" | "ghost";
  external?: boolean;
  className?: string;
};

export function MagneticButton({
  href,
  children,
  variant = "light",
  external = false,
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { onPointerMove, onPointerLeave } = useMagnetic(ref, 10);
  const classes = `magnetic-button magnetic-button--${variant} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
    </>
  );

  if (external) {
    return (
      <a
        ref={ref}
        href={href}
        className={classes}
        target="_blank"
        rel="noreferrer"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        data-cursor="CONTACT"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={classes}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      data-cursor="CONTACT"
    >
      {content}
    </Link>
  );
}
