import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Manrope } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Grain } from "@/components/layout/Grain";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { company } from "@/data/company";
import "./globals.css";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const mono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: `${company.name} - Identidade Visual & Branding`,
  description: company.description,
  openGraph: {
    title: `${company.name} - Identidade Visual & Branding`,
    description: company.description,
    type: "website",
    locale: "pt_BR",
    siteName: company.name,
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: company.name,
    description: company.description,
    url: company.siteUrl,
    email: company.email,
    areaServed: company.location,
  };

  return (
    <ViewTransitions>
      <html lang="pt-BR" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
        <body>
          <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
          <Header />
          <SmoothScroll />
          <Cursor />
          <Grain />
          <main id="main-content">{children}</main>
          <Footer />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        </body>
      </html>
    </ViewTransitions>
  );
}
