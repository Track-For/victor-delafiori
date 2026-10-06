export type StudioVideo = {
  number: string;
  title: string;
  category: string;
  duration: string;
  src: string;
  poster: string;
};

export type StudioStill = {
  number: string;
  title: string;
  context: string;
  src: string;
  alt: string;
};

export const studioStills: StudioStill[] = [
  {
    number: "01",
    title: "Napoleão",
    context: "APLICAÇÃO / DETALHE",
    src: "/images/stills/napoleao-aplicacao.webp",
    alt: "Aplicação da identidade Napoleão em uma etiqueta metálica",
  },
  {
    number: "02",
    title: "Rossi",
    context: "PROCESSO / GESTO",
    src: "/images/stills/rossi-processo.webp",
    alt: "Mão desenhando uma linha gestual durante o processo da identidade Rossi",
  },
  {
    number: "03",
    title: "Mayane Ferreira",
    context: "APLICAÇÃO / ASSINATURA",
    src: "/images/stills/mayane-aplicacao.webp",
    alt: "Símbolo dourado da identidade Mayane Ferreira aplicado em couro branco",
  },
];

export const studioVideos: StudioVideo[] = [
  {
    number: "01",
    title: "O valor de uma identidade visual",
    category: "NEGÓCIO / IDENTIDADE",
    duration: "01:32",
    src: "/videos/valor-identidade-visual.mp4",
    poster: "/videos/posters/valor-identidade-visual.jpg",
  },
  {
    number: "02",
    title: "Napoleão — do nome ao símbolo",
    category: "CASE / NAPOLEÃO",
    duration: "00:48",
    src: "/videos/napoleao-construcao-de-marca.mp4",
    poster: "/videos/posters/napoleao-construcao-de-marca.jpg",
  },
  {
    number: "03",
    title: "Combinou e entregou",
    category: "POSICIONAMENTO",
    duration: "00:27",
    src: "/videos/combinou-e-entregou.mp4",
    poster: "/videos/posters/combinou-e-entregou.jpg",
  },
  {
    number: "04",
    title: "Rossi — uma identidade que se sente",
    category: "CASE / ROSSI",
    duration: "00:43",
    src: "/videos/fiori-identidade-que-permanece.mp4",
    poster: "/videos/posters/fiori-identidade-que-permanece.jpg",
  },
  {
    number: "05",
    title: "Mayane — da coruja ao símbolo",
    category: "CASE / MAYANE",
    duration: "01:18",
    src: "/videos/mayane-da-coruja-ao-simbolo.mp4",
    poster: "/videos/posters/mayane-da-coruja-ao-simbolo.jpg",
  },
];
