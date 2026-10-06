# Pendências e fallbacks

## Dados comerciais

- Configurar `company.email`, `company.whatsapp`, `company.location`, Instagram e Behance em `src/data/company.ts`.
- Definir `NEXT_PUBLIC_SITE_URL` no ambiente de produção.
- Confirmar se Naming faz parte da oferta e remover o item de `src/data/services.ts` caso não faça.
- Substituir os textos entre colchetes em `src/data/company.ts` e `src/data/projects.ts`.
- Integrar um endpoint de formulário caso o projeto precise registrar leads além do WhatsApp.

## Marca e imagens

- Adicionar os SVGs oficiais em `/public/brand/`.
- Fotografia de perfil integrada em `/public/images/victor-delafiori.jpg`.
- Cinco vídeos editoriais integrados à home, com capas derivadas em `/public/videos/posters/`.
- Seis frames estratégicos integrados ao journal e à narrativa de símbolo em `/public/images/stills/`.
- Os 36 espaços de mídia dos cases Napoleão, Rossi e Mayane Ferreira estão preenchidos em `/public/projects/`.
- Criar e fornecer uma imagem OpenGraph oficial. Nenhuma imagem provisória foi gerada.

## Fallbacks atuais

- Sem o logo oficial, o header e o footer exibem fallback tipográfico. O preloader é automaticamente ignorado.
- O fallback de imagem permanece disponível para novos cases que ainda não tenham ativos.
- Sem número de WhatsApp, o formulário abre o compartilhamento do WhatsApp sem destinatário fixo.
- Playwright não está instalado neste repositório e nenhuma superfície de navegador estava disponível no ambiente de execução. Os screenshots visuais solicitados não foram gerados.
