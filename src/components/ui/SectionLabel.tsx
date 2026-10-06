type SectionLabelProps = {
  children: React.ReactNode;
  dark?: boolean;
};

export function SectionLabel({ children, dark = false }: SectionLabelProps) {
  return <p className={`section-label ${dark ? "section-label--dark" : ""}`}>{children}</p>;
}
