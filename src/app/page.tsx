import { About } from "@/components/sections/About";
import { BrandUnderstanding } from "@/components/sections/BrandUnderstanding";
import { Contact } from "@/components/sections/Contact";
import { Differentiation } from "@/components/sections/Differentiation";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Philosophy } from "@/components/sections/Philosophy";
import { Process } from "@/components/sections/Process";
import { Quote } from "@/components/sections/Quote";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Services } from "@/components/sections/Services";
import { StudioJournal } from "@/components/sections/StudioJournal";
import { SymbolStory } from "@/components/sections/SymbolStory";
import { HomeMotion } from "@/components/layout/HomeMotion";

export default function HomePage() {
  return (
    <HomeMotion>
      <Hero />
      <Philosophy />
      <BrandUnderstanding />
      <SelectedWork />
      <StudioJournal />
      <SymbolStory />
      <Manifesto />
      <Process />
      <Services />
      <Differentiation />
      <About />
      <Quote />
      <Contact />
    </HomeMotion>
  );
}
