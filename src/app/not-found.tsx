import { Link } from "next-view-transitions";
import { uiCopy } from "@/data/company";

export default function NotFound() {
  return (
    <section className="not-found section-dark">
      <p className="font-mono">{uiCopy.notFound.code}</p>
      <h1>{uiCopy.notFound.title}</h1>
      <Link className="text-link text-link--light" href="/">{uiCopy.notFound.cta}</Link>
    </section>
  );
}
