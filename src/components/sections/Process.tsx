import { homeContent } from "@/data/company";
import { processSteps } from "@/data/process";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitHeading } from "@/components/ui/SplitHeading";

export function Process() {
  return (
    <section className="process section-light" id="process">
      <div className="page-shell process__intro">
        <SectionLabel dark>{homeContent.process.label}</SectionLabel>
        <SplitHeading lines={homeContent.process.title} className="display-title display-title--dark" />
      </div>
      <div className="process__stack" data-process-stack>
        {processSteps.map((step) => (
          <article className="process-card" data-process-card key={step.number}>
            <span className="process-card__background" aria-hidden="true">{step.number}</span>
            <div className="process-card__content page-shell">
              <span className="font-mono">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
