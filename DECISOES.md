# Decisões do projeto

1. O nome `Victor Delafiori` foi adotado a partir do nome do próprio repositório. Todos os demais dados pessoais e comerciais ausentes permanecem como placeholders editáveis em `src/data/`.
2. Nenhuma imagem, fotografia, marca, logo ou símbolo foi criado. O componente `AssetMedia` tenta carregar o caminho configurado e mantém um container neutro quando o arquivo não existe.
3. O preloader só é executado quando `/public/brand/logo-symbol.svg` estiver disponível. Ele usa os traços do SVG oficial, nunca um símbolo alternativo.
4. A direção visual usa superfícies Black, Obsidian e Ivory, tipografia editorial de alto contraste e apenas o champagne `#C3A979` como acento.
5. O sistema de formas é deliberadamente reto, sem cards arredondados, sombras decorativas ou glassmorphism.
6. Cormorant Garamond foi escolhida para momentos editoriais porque o briefing pede explicitamente uma serif de luxo. Manrope sustenta textos e interface; IBM Plex Mono sustenta metadados.
7. O movimento comunica o processo da marca: síntese no mapa de essência, redução no estudo de símbolo, remoção no manifesto e progressão no empilhamento do processo.
8. GSAP, ScrollTrigger, SplitText e CustomEase foram usados. Flip está registrado e disponível para evoluções futuras, mas não foi aplicado sem uma mudança de layout que justificasse seu custo.
9. Lenis compartilha o ticker do GSAP. Em `prefers-reduced-motion`, Lenis, preloader, cursor, pins e animações complexas são desativados.
10. WebGL, Three.js e React Three Fiber não foram adicionados porque a linguagem vetorial em CSS atende ao conceito com menor custo de carregamento.
11. `next-view-transitions` é usado na navegação entre a home e os cases. A mídia principal compartilha um `view-transition-name` por projeto.
12. O formulário não simula envio para um backend inexistente. Após validação, prepara a mensagem e abre o WhatsApp; o número fica configurável em `src/data/company.ts`.
13. A URL canônica usa `NEXT_PUBLIC_SITE_URL` e cai para `http://localhost:3000` somente no ambiente local.
14. O portfólio foi consolidado em três cases com material real: Napoleão, Rossi e Mayane Ferreira.
15. Cada case usa 12 frames WebP extraídos do vídeo correspondente, cobrindo hero, pesquisa, construção, símbolo, sistema e aplicações sem depender de imagens externas.
