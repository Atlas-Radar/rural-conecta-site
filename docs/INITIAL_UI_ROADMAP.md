# Roadmap inicial de UI

Este roadmap organiza a implementação visual/técnica da landing Rural Conecta em etapas pequenas para o fluxo Hermes → Grill-me → Codex UI → Auditoria Hermes → commit manual do usuário.

## Princípios

- Mobile-first antes de desktop.
- Rede abaixo de 1 Mbps como restrição real.
- Visual moderno, premium e rural-tech.
- Usar imagens de referência como direção visual, não como assets grandes.
- Astro Components + HTML semântico + CSS nativo.
- Sem React, Tailwind, biblioteca de UI ou biblioteca de animação.
- Google Maps, API real e fluxo completo de viabilidade ficam para etapas posteriores autorizadas.

## Etapa 0 — Preparação visual e tokens

Objetivo: transformar direção visual em tokens e regras de UI sem implementar a landing inteira.

Escopo provável:

- revisar `src/styles/tokens.css`;
- consolidar cores, spacing, radius, sombras e tipografia;
- documentar uso no `docs/DESIGN_SYSTEM.md`, se necessário.

Grill-me obrigatório:

- confirmar intensidade do dark premium;
- confirmar uso de seções claras;
- confirmar se haverá fonte local ou system font inicialmente;
- confirmar como as imagens de referência devem influenciar tokens.

## Etapa 1 — Header e Hero mobile-first

Objetivo: criar a primeira dobra com proposta clara, CTA de disponibilidade e WhatsApp.

Escopo provável:

- `src/components/layout/Header.astro`;
- `src/pages/index.astro`;
- estilos globais ou componentes específicos.

Critérios:

- CTA principal visível em 390 × 844 sem rolagem excessiva;
- sem imagem pesada obrigatória;
- visual alinhado às referências;
- desktop apenas expande o layout.

## Etapa 2 — Bloco de consulta de viabilidade sem integração

Objetivo: desenhar UI estática/placeholder da consulta sem API real e sem Maps.

Escopo provável:

- componente de seção de viabilidade;
- seletor visual de região desabilitado/mockado;
- métodos de localização como estados visuais não funcionais, se autorizado.

Critérios:

- não pedir nome/telefone;
- deixar claro que API real está pendente;
- não carregar Maps;
- não expor tecnologia provável.

## Etapa 3 — Como funciona em três passos

Objetivo: explicar fluxo região → localização → WhatsApp humano.

Critérios:

- três passos compactos;
- leitura rápida em mobile;
- baixo custo visual;
- sem animação pesada.

## Etapa 4 — Tecnologias oferecidas

Objetivo: apresentar fibra, rádio e dedicado sem prometer tecnologia na resposta da API.

Critérios:

- cards leves;
- sem especificações não confirmadas;
- CTA único para consultar disponibilidade;
- ícones SVG leves quando houver autorização.

## Etapa 5 — Planos e benefícios

Objetivo: criar seção de planos com placeholders seguros ou conteúdo confirmado.

Critérios:

- não inventar velocidades/preços como final;
- marcar placeholders claramente;
- evitar três cards densos no mobile.

## Etapa 6 — Atendimento local

Objetivo: reforçar confiança humana e regional.

Critérios:

- visual caloroso;
- WhatsApp como CTA;
- imagens apenas se otimizadas e autorizadas.

## Etapa 7 — Regiões atendidas institucional

Objetivo: mostrar regiões como conteúdo institucional, sem Google Maps público inicial.

Critérios:

- chips/cards leves;
- deixar claro que disponibilidade depende da coordenada;
- sem mapa técnico de infraestrutura.

## Etapa 8 — Empresas e fazendas

Objetivo: apresentar soluções dedicadas sem abrir fluxo de contratação complexa.

Critérios:

- linguagem consultiva;
- sem SLA ou IP válido se não confirmado;
- CTA WhatsApp.

## Etapa 9 — Depoimentos, FAQ e CTA final

Objetivo: fechar a landing com prova social segura, dúvidas e ação final.

Critérios:

- depoimentos reais ou marcados como placeholder;
- FAQ acessível;
- CTA final simples.

## Etapa 10 — Revisão visual integrada

Objetivo: auditar a página inteira em mobile e desktop antes de avançar para interatividade real.

Critérios:

- screenshots mobile e desktop;
- orçamento de performance;
- sem JS/Maps inicial inesperado;
- acessibilidade básica;
- relatório READY/NOT READY para commit manual.

## Etapas futuras fora deste roadmap visual inicial

- Viabilidade interativa sem Maps.
- Google Maps sob demanda.
- API real.
- Worker/BFF.
- Deploy/Cloudflare.
- CI/GitHub Actions.
