import { homeContent } from "@/data/company";
import { SplitHeading } from "@/components/ui/SplitHeading";

export function BrandUnderstanding() {
  const content = homeContent.understanding;
  return (
    <section className="understanding section-dark" data-essence-section>
      <div className="page-shell understanding__copy">
        <SplitHeading lines={content.title} className="display-title" />
        <div className="understanding__body" data-reveal>
          <strong>{content.intro}</strong>
          {content.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
      <div className="essence-map" data-essence-map aria-label="Síntese visual da estratégia em conceito">
        <div className="essence-map__grid" aria-hidden="true" />
        {content.words.map((word, index) => (
          <span className="essence-word font-mono" data-essence-word style={{ "--word-index": index } as React.CSSProperties} key={word}>
            {word}
          </span>
        ))}
        <svg className="essence-lines" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <line x1="90" y1="120" x2="500" y2="300" />
          <line x1="820" y1="110" x2="500" y2="300" />
          <line x1="180" y1="480" x2="500" y2="300" />
          <line x1="840" y1="470" x2="500" y2="300" />
        </svg>
        <span className="essence-result font-mono" data-essence-result>{content.result}</span>
      </div>
    </section>
  );
}
