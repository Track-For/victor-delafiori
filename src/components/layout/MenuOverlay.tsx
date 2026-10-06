"use client";

import { X } from "lucide-react";
import { Link } from "next-view-transitions";
import { company, navigation, uiCopy } from "@/data/company";

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  return (
    <div className="menu-overlay" data-open={open || undefined} aria-hidden={!open}>
      <button className="menu-overlay__close" onClick={onClose} aria-label={uiCopy.navigation.close} tabIndex={open ? 0 : -1}>
        <X aria-hidden="true" size={24} strokeWidth={1.5} />
      </button>
      <nav aria-label={uiCopy.navigation.mobileLabel}>
        {navigation.map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose} tabIndex={open ? 0 : -1}>
            <span className="font-mono">{item.number}</span>
            <strong>{item.label}</strong>
          </Link>
        ))}
      </nav>
      <div className="menu-overlay__social">
        <a href={company.instagram} tabIndex={open ? 0 : -1}>Instagram</a>
        <a href={company.behance} tabIndex={open ? 0 : -1}>Behance</a>
        <a href={`mailto:${company.email}`} tabIndex={open ? 0 : -1}>E-mail</a>
      </div>
    </div>
  );
}
