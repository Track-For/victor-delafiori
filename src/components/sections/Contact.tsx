import { homeContent } from "@/data/company";
import { ContactForm } from "./ContactForm";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Contact() {
  const content = homeContent.contact;
  return (
    <section className="contact section-light" id="contact">
      <div className="page-shell contact__intro">
        <h2 data-reveal>{content.title}</h2>
        <p className="contact__accent" data-reveal>{content.titleAccent}</p>
        <p className="contact__body" data-reveal>{content.body}</p>
        <MagneticButton href="#project-form" variant="dark">{content.cta}</MagneticButton>
      </div>
      <div className="page-shell contact__form-wrap" id="project-form">
        <h3>{content.formTitle}</h3>
        <ContactForm />
      </div>
    </section>
  );
}
