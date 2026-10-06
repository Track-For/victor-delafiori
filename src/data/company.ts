export const company = {
  name: "Victor Delafiori",
  shortName: "VD",
  description:
    "Identidades visuais autorais para marcas que querem construir uma presença única, sofisticada e impossível de confundir.",
  email: "[E-MAIL]",
  whatsapp: "",
  location: "[LOCALIZAÇÃO]",
  instagram: "#",
  behance: "#",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  social: {
    instagramLabel: "Instagram",
    behanceLabel: "Behance",
  },
} as const;

export const navigation = [
  { label: "WORK", href: "#work", number: "01" },
  { label: "PROCESS", href: "#process", number: "02" },
  { label: "ABOUT", href: "#about", number: "03" },
  { label: "CONTACT", href: "#contact", number: "04" },
] as const;

export const uiCopy = {
  navigation: {
    open: "Abrir menu",
    close: "Fechar menu",
    mainLabel: "Navegação principal",
    mobileLabel: "Navegação mobile",
    projectCta: "START A PROJECT",
  },
  form: {
    fields: {
      name: "Nome",
      company: "Empresa / Marca",
      website: "Instagram ou site atual",
      industry: "Segmento",
      identityStatus: "Sua marca já possui identidade visual?",
      service: "O que você procura?",
      story: "Conte um pouco sobre a marca",
      whatsapp: "WhatsApp",
      email: "E-mail",
    },
    submit: "Enviar projeto",
    submitting: "Enviando",
    success: "Mensagem preparada no WhatsApp. Revise e envie quando estiver pronto.",
  },
  notFound: {
    code: "404",
    title: "Esta página não encontrou sua forma.",
    cta: "Voltar ao início",
  },
} as const;

export const homeContent = {
  hero: {
    label: "INDEPENDENT BRAND IDENTITY",
    line1: "NÃO CRIAMOS APENAS LOGOS",
    line2: "TRANSFORMAMOS",
    line3: "a essência em símbolo",
    body: "Identidades visuais nascidas da estratégia, da personalidade e da percepção que tornam uma marca impossível de confundir",
    primaryCta: "Construir minha identidade",
    secondaryCta: "Ver projetos",
  },
  philosophy: {
    label: "01 - PHILOSOPHY",
    lines: ["TODA MARCA TEM", "ALGO QUE SÓ ELA", "PODERIA DIZER"],
    body: "Nosso trabalho é encontrar isso antes de desenhar qualquer coisa.",
  },
  understanding: {
    title: ["ANTES DA FORMA,", "EXISTE UMA ESSÊNCIA"],
    intro: "Uma identidade forte não começa no Illustrator. Começa em perguntas",
    body: [
      "Entendemos o negócio, a história, o posicionamento, o público e, principalmente, a percepção que a marca deseja construir",
      "Só então começamos a transformar estratégia em linguagem visual",
    ],
    words: [
      "HISTÓRIA",
      "PERSONALIDADE",
      "PÚBLICO",
      "POSICIONAMENTO",
      "PERCEPÇÃO",
      "VALORES",
      "DIFERENCIAÇÃO",
      "TOM",
      "FUTURO",
    ],
    result: "CONCEITO",
  },
  work: {
    label: "02 - SELECTED IDENTITIES",
    title: "IDENTIDADES",
    titleAccent: "com algo a dizer",
    cta: "Ver identidade",
  },
  symbol: {
    label: "03 - FROM IDEA TO SYMBOL",
    title: ["O ÓBVIO É", "APENAS O COMEÇO"],
    body: [
      "Uma referência pode estar em uma forma da natureza, em uma inicial, em um movimento, em uma arquitetura ou em uma história",
      "O trabalho não é copiá-la",
      "É descobrir qual característica merece sobreviver",
    ],
    attributes: ["FORMA", "MOVIMENTO", "SIMETRIA", "TENSÃO", "RITMO", "GESTO", "ESSÊNCIA"],
    closing: "Tudo que não precisava estar ali foi removido",
  },
  manifesto: {
    frames: [
      ["O LUXO NÃO ESTÁ", "NO EXCESSO"],
      ["ESTÁ NA CAPACIDADE", "DE REMOVER"],
      ["TUDO AQUILO", "QUE NÃO PRECISA", "ESTAR ALI"],
    ],
    body: "Até restar apenas o que torna aquela marca única",
  },
  impact: [
    {
      label: "03.1 — RECONHECIMENTO",
      lines: ["ANTES DE LER,", "JÁ PRECISA", "PARECER SUA"],
      accent: "parecer sua",
    },
    {
      label: "03.2 — DIFERENÇA",
      lines: ["SE PODERIA SER", "DE QUALQUER UM,", "NÃO É IDENTIDADE"],
      accent: "não é identidade",
    },
    {
      label: "03.3 — PRESENÇA",
      lines: ["A MARCA CERTA", "NÃO PEDE ATENÇÃO", "ELA PERMANECE"],
      accent: "ela permanece",
    },
  ],
  process: {
    label: "04 - PROCESS",
    title: ["UMA IDENTIDADE", "NÃO COMEÇA", "COM UM DESENHO"],
  },
  services: {
    title: ["DA ESTRATÉGIA", "À EXPRESSÃO"],
  },
  differentiation: {
    title: ["SUA MARCA NÃO", "DEVERIA PODER SER", "CONFUNDIDA"],
    principles: [
      {
        title: "NÃO SEGUIR FÓRMULAS",
        body: "Tendências passam. Uma identidade precisa continuar fazendo sentido depois delas",
      },
      {
        title: "NÃO COMEÇAR PELA ESTÉTICA",
        body: "Antes de escolher uma forma, entendemos o significado que ela precisa carregar",
      },
      {
        title: "NÃO PARAR NO LOGO",
        body: "Um símbolo forte precisa funcionar dentro de um sistema visual igualmente reconhecível",
      },
    ],
  },
  about: {
    label: "05 - THE DESIGNER",
    title: ["DESIGN COM", "INTENÇÃO"],
    body: "Victor Delafiori é designer especializado no desenvolvimento de identidades visuais e na construção de sistemas de marca",
    details: ["[TRAJETÓRIA]", "[VISÃO]", "[EXPERIÊNCIA]", "[METODOLOGIA]", "[ESPECIALIZAÇÕES]"],
  },
  quote: {
    prompt: ["SE RETIRÁSSEMOS", "SEU NOME DO LOGO..."],
    question: ["AS PESSOAS", "AINDA RECONHECERIAM", "SUA MARCA?"],
    body: "É esse nível de identidade que buscamos construir",
  },
  contact: {
    title: "SUA MARCA JÁ EXISTE",
    titleAccent: "Talvez sua identidade ainda não",
    body: "Vamos entender o que torna sua marca única e transformar isso em uma linguagem impossível de confundir",
    cta: "CONSTRUIR MINHA IDENTIDADE",
    formTitle: "Conte sobre o projeto",
  },
  footer: {
    invitation: "Vamos criar algo impossível de confundir",
  },
} as const;

export const formOptions = {
  identityStatus: ["Ainda não", "Sim, mas quero evoluir", "Estou criando uma nova marca"],
  services: ["Identidade visual", "Rebranding", "Logo", "Estratégia + identidade", "Ainda não sei"],
} as const;

export const caseContent = {
  back: "Voltar às identidades",
  client: "CLIENTE",
  context: "CONTEXTO",
  challenge: "DESAFIO",
  concept: "CONCEITO",
  research: "PESQUISA VISUAL",
  construction: "CONSTRUÇÃO",
  symbol: "SÍMBOLO",
  typography: "TIPOGRAFIA",
  colors: "CORES",
  visualSystem: "SISTEMA VISUAL",
  applications: "APLICAÇÕES",
  result: "RESULTADO",
  next: "NEXT IDENTITY",
  scroll: "SCROLL",
  placeholders: {
    context: "[CONTEXTO DO PROJETO]",
    research: "[NARRATIVA DA PESQUISA VISUAL]",
    construction: "[NARRATIVA DA CONSTRUÇÃO DO SÍMBOLO]",
    typography: "[DIREÇÃO TIPOGRÁFICA]",
    colors: "[DIREÇÃO CROMÁTICA]",
    visualSystem: "[DESCRIÇÃO DO SISTEMA VISUAL]",
    result: "[RESULTADO DO PROJETO]",
  },
} as const;
