import { homeContent } from "@/data/company";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Philosophy() {
  const content = homeContent.philosophy;
  return (
    <section className="philosophy section-dark" id="philosophy">
      <div className="page-shell">
        <SectionLabel>{content.label}</SectionLabel>
        <h2 className="philosophy__title">
          {content.lines.map((line, index) => (
            <span className="philosophy__line" key={line} data-reveal-line>
              {index === 1 ? (
                <>
                  ALGO QUE SÓ <em>ELA</em>
                </>
              ) : line}
            </span>
          ))}
        </h2>
        <p className="philosophy__body" data-reveal>{content.body}</p>
      </div>
    </section>
  );
}
