import { homeContent } from "@/data/company";
import { services } from "@/data/services";
import { SplitHeading } from "@/components/ui/SplitHeading";

export function Services() {
  return (
    <section className="services section-light">
      <div className="page-shell services__layout">
        <SplitHeading lines={homeContent.services.title} className="display-title display-title--dark services__title" />
        <div className="services__list">
          {services.map((service, index) => (
            <article className="service-row" key={service.title} tabIndex={0}>
              <span className="service-row__number font-mono">{String(index + 1).padStart(2, "0")}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
