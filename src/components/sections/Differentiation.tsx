import { homeContent } from "@/data/company";
import { SplitHeading } from "@/components/ui/SplitHeading";

export function Differentiation() {
  const content = homeContent.differentiation;
  return (
    <section className="differentiation section-dark">
      <div className="page-shell">
        <SplitHeading lines={content.title} className="display-title" />
        <div className="differentiation__principles">
          {content.principles.map((principle, index) => (
            <article key={principle.title} data-reveal>
              <span className="font-mono">{String(index + 1).padStart(2, "0")}</span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
