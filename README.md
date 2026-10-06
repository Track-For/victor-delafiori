# Victor Delafiori

Site editorial de identidade visual desenvolvido com Next.js 16, React 19, TypeScript, Tailwind CSS 4, GSAP e Lenis.

## Executar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Conteúdo

- Dados comerciais: `src/data/company.ts`
- Projetos: `src/data/projects.ts`
- Serviços: `src/data/services.ts`
- Processo: `src/data/process.ts`

## Ativos

A fotografia de Victor e cinco vídeos do estúdio estão integrados à home. As capas e seis recortes editoriais foram extraídos do próprio material para preservar a direção visual e evitar o carregamento antecipado dos arquivos completos.

Os três cases publicados — Napoleão, Rossi e Mayane Ferreira — usam frames reais extraídos dos vídeos. Os logos oficiais do estúdio ainda podem ser adicionados nos caminhos listados em `RELATORIO.md`.

## Validação

```bash
npm run build
npm run lint
npx tsc --noEmit
```
