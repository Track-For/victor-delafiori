export type Project = {
  slug: string;
  number: string;
  client: string;
  industry: string;
  year: string;
  description: string;
  concept: string;
  challenge: string;
  image: string;
  symbol: string;
  research: string;
  construction: string;
  application: string;
};

export const projects: Project[] = [
  {
    slug: "napoleao",
    number: "01",
    client: "Napoleão",
    industry: "IDENTIDADE VISUAL",
    year: "",
    description: "Recortes do processo e das aplicações da identidade Napoleão",
    concept: "Do encontro entre nome e símbolo nasce uma presença visual sóbria",
    challenge: "Construir uma marca reconhecível em escalas, superfícies e contextos distintos",
    image: "/projects/napoleao/hero.webp",
    symbol: "/projects/napoleao/symbol.webp",
    research: "/projects/napoleao/process-01.webp",
    construction: "/projects/napoleao/construction.webp",
    application: "/projects/napoleao/application-01.webp",
  },
  {
    slug: "rossi",
    number: "02",
    client: "Rossi",
    industry: "IDENTIDADE VISUAL",
    year: "",
    description: "Uma identidade apresentada pelo gesto, pelo ritmo e pela experiência que deixa",
    concept: "Uma forma simples capaz de carregar movimento e memória",
    challenge: "Traduzir uma experiência sensível em uma assinatura visual reconhecível",
    image: "/projects/rossi/colors.webp",
    symbol: "/projects/rossi/symbol.webp",
    research: "/projects/rossi/process-01.webp",
    construction: "/projects/rossi/construction.webp",
    application: "/projects/rossi/application-01.webp",
  },
  {
    slug: "mayane-ferreira",
    number: "03",
    client: "Mayane Ferreira",
    industry: "MARCA PESSOAL",
    year: "",
    description: "Pesquisa, construção e aplicação da identidade Mayane Ferreira",
    concept: "A coruja é sintetizada em uma forma que também sugere a letra M",
    challenge: "Transformar uma referência figurativa em um símbolo próprio e versátil",
    image: "/projects/mayane-ferreira/hero.webp",
    symbol: "/projects/mayane-ferreira/symbol.webp",
    research: "/projects/mayane-ferreira/process-01.webp",
    construction: "/projects/mayane-ferreira/construction.webp",
    application: "/projects/mayane-ferreira/application-01.webp",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}
