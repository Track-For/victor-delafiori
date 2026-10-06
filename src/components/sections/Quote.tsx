import { homeContent } from "@/data/company";

export function Quote() {
  return (
    <section className="provocation section-dark" data-provocation>
      <div className="provocation__prompt">
        {homeContent.quote.prompt.map((line) => <span key={line}>{line}</span>)}
      </div>
      <div className="provocation__question" data-provocation-question>
        {homeContent.quote.question.map((line) => <span key={line}>{line}</span>)}
      </div>
      <p>{homeContent.quote.body}</p>
    </section>
  );
}
