# Prompt Codex UI — Onda 5.1 Maps real + modal limpo

Leia `AGENTS.md`, `docs/ROADMAP.md`, `docs/INITIAL_UI_ROADMAP.md`, `docs/MAPS_KEYS_VALIDATION.md`, `docs/UI_IMPLEMENTATION_WORKFLOW.md`, `docs/PERFORMANCE_BUDGET.md`, `docs/ACCESSIBILITY.md`, `docs/LOCATION_STRATEGY.md` e `docs/LANDING_API_INTEGRATION.md`.

Objetivo: executar a Onda 5.1 antes da Onda 6. Resolva dois bloqueios: (1) deixar documentado/testável o fluxo de validação local/prod das chaves públicas restritas do Google Maps; (2) simplificar visualmente o modal de pré-análise, que está poluído no mobile.

Escopo técnico:
- Não commitar, não fazer push, não fazer deploy e não inserir chave real em arquivo versionado.
- Manter `PUBLIC_GOOGLE_MAPS_API_KEY` e `PUBLIC_GOOGLE_MAP_ID` como variáveis públicas documentadas; segurança por HTTP referrers + APIs restritas, conforme `docs/MAPS_KEYS_VALIDATION.md`.
- Se necessário, melhorar docs/checklists sem valores reais.
- Manter Maps 0 KB na carga inicial; Maps/Places só após ação explícita no modal.
- Manter fallback sem chave.

Escopo UI:
- Redesenhar `src/components/sections/AvailabilityPreview.astro` para reduzir poluição visual no mobile 360–430 px.
- Menos texto sempre visível; usar iconografia e labels curtos.
- GPS deve ser a ação principal.
- Busca/mapa e coordenadas devem ser opções progressivas/compactas, sem mostrar tudo com o mesmo peso ao mesmo tempo.
- Manter: região, GPS, coordenadas DD/DMS, busca Places, clique/toque no mapa, marcador arrastável, confirmar ponto, resultado, WhatsApp e acessibilidade.
- Não usar React, Tailwind, bibliotecas de UI, bibliotecas de modal, bibliotecas de ícone ou animação.

Arquivos prováveis:
- `.env.example`
- `docs/MAPS_KEYS_VALIDATION.md`
- `docs/ROADMAP.md`
- `docs/INITIAL_UI_ROADMAP.md`
- `docs/DECISIONS_PENDING.md`
- `src/components/sections/AvailabilityPreview.astro`
- `src/scripts/availability.ts`
- `tests/e2e/availability.spec.ts`
- `tests/unit/availability.test.ts`, se comportamento mudar

Validações obrigatórias:
- `corepack pnpm format:check`
- `corepack pnpm lint`
- `corepack pnpm check`
- `corepack pnpm test`
- `corepack pnpm test:e2e`
- `corepack pnpm build`

Auditoria obrigatória:
- Confirmar `dist/index.html` sem `maps.googleapis.com`.
- Confirmar que `maps.googleapis.com` aparece somente no bundle sob demanda, se aparecer.
- Confirmar ausência de `googletagmanager`, React e Tailwind no build.
- Gerar evidência visual mobile 390 px e desktop, incluindo modal fechado, modal aberto limpo, mapa/fallback e resultado.

Saída esperada:
READY ou NOT READY, resumo, arquivos alterados, validações executadas, evidências visuais, impacto mobile/performance, acessibilidade, riscos pendentes, git status final e commit sugerido sem executar commit.
