type SplitHeadingProps = {
  lines: readonly string[];
  className?: string;
  as?: "h1" | "h2" | "h3";
  italicLine?: number;
};

export function SplitHeading({ lines, className = "", as = "h2", italicLine }: SplitHeadingProps) {
  const Tag = as;
  return (
    <Tag className={`split-heading ${className}`} data-split-heading>
      {lines.map((line, index) => (
        <span className="split-heading__line" key={`${line}-${index}`}>
          <span className={italicLine === index ? "font-display italic" : undefined}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
