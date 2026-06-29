# Roadmap acelerado de UI

Este roadmap substitui o fluxo visual inicial muito fragmentado por uma abordagem mais rápida: construir primeiro um mock visual completo da landing, com todas as seções principais, e depois refinar visual, textos, dados reais, animações, iconização e integrações.

O objetivo é sair rapidamente de uma base parcial para uma página inteira navegável, ainda respeitando as regras do projeto: mobile-first, baixo peso, Astro estático, CSS nativo, sem framework client-side e sem Google Maps no carregamento inicial.

## Estratégia nova

1. **Mock visual completo primeiro**
   - Implementar a landing inteira em uma onda maior.
   - Construir todas as seções principais com conteúdo provisório seguro.
   - Usar imagens de referência para direção visual.
   - Usar a imagem real aprovada no hero, otimizada.
   - Evitar perfeccionismo seção por seção nesta fase.

2. **Request da API funcional logo depois da base visual**
   - Depois do mock completo, avançar rapidamente a request da API de regiões/viabilidade com os dados reais disponíveis.
   - Deixar o fluxo sem Maps funcionando primeiro: região, localização/coordenadas, chamada da API, estados e WhatsApp contextual.
   - Manter Google Maps sob demanda em etapa própria.

3. **Refino iterativo depois**
   - Ajustar visual do que não agradar.
   - Trocar textos provisórios por textos finais.
   - Adicionar dados reais de regiões, planos e depoimentos.
   - Melhorar iconização.
   - Adicionar microinterações/animações leves.
   - Refinar acessibilidade e performance.

4. **Prompts maiores e subagentes**
   - Preferir ondas maiores com vários blocos relacionados.
   - Usar subagentes/execuções paralelas para auditoria, assets, testes e implementação isolada quando seguro.
   - Evitar microetapas excessivas que atrasem a visão completa do site.

## Princípios permanentes

- Mobile-first antes de desktop.
- Rede abaixo de 1 Mbps como restrição real.
- Visual moderno, premium e rural-tech.
- Astro Components + HTML semântico + CSS nativo.
- Sem React, Tailwind, biblioteca de UI ou biblioteca de animação.
- Não instalar dependências sem autorização explícita.
- Google Maps, Places e API real não devem carregar na abertura inicial.
- Não coletar nome, telefone, e-mail ou CPF na consulta de viabilidade.
- Não expor torres, CTOs, rotas, capacidade, distância até equipamentos ou tecnologia provável.
- Resultado público da viabilidade continua simples: atende/não atende + WhatsApp.

## Onda 1 — Mock visual completo da landing

**Status:** próxima execução recomendada.

**Objetivo:** montar a landing inteira visualmente, de ponta a ponta, com todas as seções principais em qualidade de mock implementável, sem exigir refinamento final de cada detalhe.

**Escopo principal:**

- Header ajustado:
  - manter logo oficial;
  - manter CTA de disponibilidade;
  - remover WhatsApp do header/menu como CTA destacado.
- Hero premium:
  - criar `src/components/sections/Hero.astro`;
  - usar a imagem real do técnico no hero, otimizada;
  - seguir referências desktop/mobile aprovadas;
  - CTA primário de disponibilidade;
  - CTA secundário de WhatsApp;
  - chips/benefícios abaixo dos CTAs.
- Consulta de viabilidade visual:
  - criar seção estática/mockada;
  - seletor visual de região;
  - métodos de localização;
  - microtexto de privacidade;
  - sem API real nesta onda, salvo se explicitamente incluído no prompt.
- Como funciona:
  - três passos claros.
- Tecnologias:
  - fibra, rádio e link dedicado;
  - sem prometer tecnologia no resultado.
- Planos/benefícios:
  - conteúdo provisório seguro, sem preços/velocidades falsas;
  - marcar placeholders quando necessário.
- Atendimento local:
  - seção humana/regional;
  - WhatsApp contextual.
- Benefícios de streaming/uso cotidiano:
  - linguagem segura, sem logos não autorizados.
- Regiões atendidas institucional:
  - chips/cards;
  - disponibilidade exata depende da coordenada;
  - sem mapa técnico.
  - usar seleção curta/mockada das principais localidades em `docs/REGIONS_REFERENCE.md`; a lista completa entra nos refinamentos.
- Empresas e fazendas:
  - abordagem consultiva;
  - sem SLA/IP/preços não confirmados.
- Depoimentos:
  - reais se existirem; caso contrário placeholders explícitos ou bloco alternativo.
- FAQ:
  - `<details>` nativo preferencialmente.
- CTA final e rodapé:
  - fechamento com disponibilidade + WhatsApp;
  - dados confirmados apenas.

**Arquivos prováveis:**

- `src/pages/index.astro`;
- `src/components/layout/Header.astro`;
- `src/components/layout/Footer.astro`;
- `src/components/sections/*.astro`;
- `src/components/ui/Button.astro`, se necessário;
- `src/data/site.ts`, se fizer sentido concentrar conteúdo;
- `src/styles/global.css`;
- `src/styles/tokens.css`, apenas ajustes pequenos;
- assets otimizados em `src/assets/` ou `public/`;
- testes em `tests/e2e/` e `tests/unit/` quando aplicável.
- `docs/REGIONS_REFERENCE.md` como referência de localidades para mocks e refinamentos.
- `docs/UI_REFERENCE_IMAGES.md` como índice das imagens desktop/mobile da Onda 1.

**Referências aprovadas para o hero:**

- Desktop: `D:\projects\exemplos landing page rural\atualizado\rural-conecta-01-hero-internet-rural-campo.png.png`
- Mobile: `D:\projects\exemplos landing page rural\atualizado\mobile atualizado\rural-conecta-mobile-01-hero-internet-rural-campo.png.png`
- Imagem real do hero: `D:\projects\exemplos landing page rural\atualizado\full-image-técnico.png`

**Critérios de aceite:**

- Página completa navegável em mobile e desktop.
- Mobile 360–430 px priorizado.
- Em 390 × 844, hero tem CTA principal acessível sem rolagem excessiva.
- WhatsApp removido do header como CTA destacado e recolocado nos CTAs contextuais.
- Todas as seções principais existem, mesmo com conteúdo provisório seguro.
- Sem API real obrigatória nesta onda, a menos que o prompt especifique.
- Sem Google Maps inicial.
- Sem scripts de terceiros.
- Sem dependências novas.
- Imagem do hero otimizada e reportada.
- Dist auditado para JS inicial, Maps e assets.
- Playwright atualizado para cobrir navegação/CTAs/responsividade da landing completa.

**Validações obrigatórias:**

- `corepack pnpm format:check`
- `corepack pnpm lint`
- `corepack pnpm check`
- `corepack pnpm test`
- `corepack pnpm test:e2e`
- `corepack pnpm build`

## Onda 2 — Viabilidade funcional com API real

**Objetivo:** deixar regiões e request de viabilidade funcionais usando os dados/API que o projeto já possui, mantendo privacidade e resposta simples.

**Escopo esperado:**

- Definir estratégia de chamada direta ou Worker/BFF conforme segredos, CORS, rate limit e proteção da API.
- Implementar `GET /api/regions` ou endpoint real equivalente.
- Implementar `POST /api/viability` ou endpoint real equivalente.
- Normalizar resposta para `atende`/`não atende`.
- Criar estados de loading, sucesso, não atende e erro.
- Montar WhatsApp contextual sem expor dado sensível.
- Validar coordenadas e região.
- Não pedir nome, telefone, e-mail ou CPF.
- Não expor tecnologia provável.

**Testes:**

- unitários para payload, validação, normalização e WhatsApp;
- E2E do fluxo sem Google Maps;
- tratamento de API lenta/erro.

## Onda 3 — Refino visual e conteúdo

**Objetivo:** corrigir rapidamente o que não agradar após ver a página inteira e após a base de request da API estar encaminhada.

**Escopo típico:**

- Ajustes de layout mobile/desktop.
- Hierarquia visual.
- Espaçamentos.
- Cores e contraste.
- Troca de textos provisórios.
- Reordenação ou remoção de seções.
- Ajustes de imagens.
- Melhor tratamento de cards/chips.
- Melhorias no footer.
- Dados comerciais reais de regiões, planos e depoimentos quando forem enviados.

## Onda 4 — Modal fullscreen de pré-análise e localização sem Maps

**Status:** concluída localmente em 2026-06-28. A pré-análise ficou modal-only: não há mais seção/chamada visível de disponibilidade na página principal; CTAs externos abrem o modal.

**Objetivo:** refatorar a pré-análise para um modal fullscreen aberto somente após CTA, completando métodos de localização leves antes do Google Maps completo.

**Escopo:**

- Abrir a pré-análise somente após clique em CTAs como “Verificar disponibilidade”, “Fazer pré-análise” ou equivalentes.
- Remover a seção/formulário longo da página principal; manter apenas o modal aberto por CTAs externos.
- Modal fullscreen mobile-first, com foco preso, Escape/fechar, scroll travado no fundo e acessibilidade de diálogo.
- Conteúdo do modal idealmente visível em uma única tela mobile, reduzindo textos e passo-a-passo excessivos.
- Geolocalização em tempo real com botão explícito “Pegar localização em tempo real”.
- Entrada manual de coordenadas em DD e DMS, com conversão automática.
- Aceitar latitude e longitude em DD no mesmo campo/label quando separadas por vírgula.
- Estado de ponto selecionado dentro do modal.
- Resultado final também dentro do modal, não abaixo da seção.
- Fallback WhatsApp.
- Preparar contrato visual e estado para abrir mapa sob demanda na próxima onda.

## Onda 5 — Google Maps sob demanda + iconização/animações/polimento

**Status:** concluída localmente em 2026-06-28, com fallback e testes mockados. Pendente validação manual com `PUBLIC_GOOGLE_MAPS_API_KEY` real restrita por domínio.

**Objetivo:** adicionar mapa somente após ação explícita do usuário e aplicar iconização, microinterações e polimento visual sem pesar a página.

**Escopo:**

- Loader sob demanda do Maps, iniciado apenas depois da abertura do modal de pré-análise.
- Places carregado junto do fluxo sob demanda para pesquisa textual no modal.
- Marcador/toque/arraste implementados com confirmação explícita do ponto.
- Confirmar ponto preenche o campo/estado de coordenadas existente e habilita a consulta.
- Fallback para chave ausente, Maps lento ou indisponível, mantendo GPS, coordenadas e WhatsApp.
- Ícones SVG inline consistentes para modal, métodos, CTAs, cards e estados.
- Microinterações leves para abrir/fechar modal, seleção de método, resultado e CTAs.
- Animações CSS discretas com `prefers-reduced-motion` obrigatório.
- Ajustes finos de foco/hover/active e detalhes visuais.

**Critérios:**

- Maps inicial continua 0 KB.
- Nada de torres, CTOs, rotas ou cobertura técnica pública.
- O mapa serve apenas para escolher ponto; a API decide disponibilidade.
- Sem bibliotecas de animação, pacotes grandes de ícones, efeitos permanentes pesados ou scripts de terceiros fora do Maps sob demanda aprovado.

## Onda 6 — Qualidade final e produção

**Objetivo:** preparar o site para publicação.

**Escopo:**

- Auditoria completa de performance.
- Acessibilidade.
- SEO/meta/social cards.
- Política de privacidade final.
- 404.
- Sitemap/robots se aplicável.
- CI/GitHub workflows, se aprovado.
- Deploy/Cloudflare/domínio, se aprovado.
- Runbook.

## Modelo de execução com subagentes

Para prompts maiores, a divisão recomendada é:

1. **Agente principal de implementação**
   - Aplica o mock completo ou a onda funcional.
   - Mantém escopo e arquivos.

2. **Subagente de assets/performance**
   - Otimiza imagens.
   - Verifica pesos.
   - Audita `dist`.

3. **Subagente de testes/auditoria**
   - Atualiza Playwright/Vitest quando necessário.
   - Roda validações.
   - Confere ausência de Maps/scripts proibidos.

4. **Hermes auditor final**
   - Não confia só no relatório do Codex.
   - Verifica git status, diff, arquivos, testes, screenshots e dist.
   - Retorna READY/NOT READY.

## Próximo prompt recomendado

Gerar um prompt único para a **Onda 1 — Mock visual completo da landing**, incorporando a Etapa 1B do hero e as seções restantes em versão mock segura.

O prompt deve ser maior que os anteriores, mas ainda com limites claros:

- implementar landing visual inteira;
- não integrar API real ainda, a menos que explicitamente alterado;
- não carregar Maps;
- não instalar dependências;
- usar imagens de referência do hero;
- otimizar imagem do técnico;
- remover WhatsApp do header;
- entregar screenshots, testes e auditoria de dist.

