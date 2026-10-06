"use client";

import { company } from "@/data/company";

type BrandLogoProps = {
  symbolOnly?: boolean;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ symbolOnly = false, className = "" }: BrandLogoProps) {
  return (
    <span className={`brand-logo ${className}`} data-brand-target={symbolOnly || undefined}>
      <span className="brand-logo__fallback" aria-label={company.name}>
        {symbolOnly ? company.shortName : company.name}
      </span>
    </span>
  );
}
