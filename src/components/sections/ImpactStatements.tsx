import { homeContent } from "@/data/company";

export function ImpactStatements() {
  return (
    <section className="impact-statements section-dark" aria-label="Princípios de impacto da marca">
      <div className="impact-statements__track">
        {homeContent.impact.map((statement, index) => (
          <article
            className={`impact-statement${index === 1 ? " impact-statement--outline" : ""}`}
            data-impact-panel
            key={statement.label}
          >
            <span className="impact-statement__label font-mono">{statement.label}</span>
            <p className="impact-statement__copy" data-impact-copy>
              {statement.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <span className="impact-statement__accent font-display">{statement.accent}</span>
            <span className="impact-statement__rule" aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
}
