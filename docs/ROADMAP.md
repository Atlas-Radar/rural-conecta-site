# Roadmap

## Status atual

Fundação de contexto, documentação e governança criada localmente em `C:\Users\Toru\Documents\ruralconectamg`.
Scaffold técnico inicial Astro static-first criado manualmente sobre a base de documentação já existente.
Fluxo permanente de UI salvo: Hermes gera roadmap, faz Grill-me, transforma em prompt para Codex UI, audita o resultado, e o usuário faz commit/push manualmente.

Concluído nesta etapa:

- `AGENTS.md` como contexto canônico.
- `docs/` com documentos principais e ADR inicial.
- `.agents/skills/` com 6 skills específicas do projeto.
- templates locais de GitHub para PR e issues.
- arquivos auxiliares de governança: `.editorconfig`, `.gitattributes`, `.gitignore`, `.env.example`, `README.md`, `CONTRIBUTING.md` e `SECURITY.md`.
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `astro.config.mjs` e `tsconfig.json`.
- `src/` com layout base, página inicial mínima, componentes de header/footer/botão, tokens CSS e dados de site.
- `tests/unit/` com teste mínimo para montagem do link de WhatsApp.
- documentos e skills do fluxo UI: `docs/UI_IMPLEMENTATION_WORKFLOW.md`, `docs/GRILL_ME_TEMPLATE.md`, `docs/CODEX_UI_PROMPT_TEMPLATE.md`, `docs/INITIAL_UI_ROADMAP.md`, `docs/prompts/codex_ui/README.md`, `rural_ui_roadmap_grill`, `rural_codex_ui_prompt` e `rural_visual_audit`.
- Dependências instaladas dentro do escopo aprovado: `astro`; dev dependencies `@astrojs/check`, `typescript`, `prettier`, `prettier-plugin-astro`, `vitest` e `@vitest/coverage-v8`.
- Validações passaram via `corepack pnpm`: `format:check`, `check`, `test` e `build`.
- Build estático final gerou `dist/index.html` com aproximadamente 4.8 KB e CSS com aproximadamente 6.4 KB, sem JavaScript inicial, sem Google Maps, sem scripts de terceiros e sem imagens.
- Repositório Git já inicializado em `main`, com upstream `origin/main`.
- CI básica criada em `.github/workflows/ci.yml` para `pull_request` e `push` em `main`.

Ainda não executado por decisão de escopo:

- commit;
- push desta etapa;
- GitHub settings/rulesets;
- Cloudflare;
- Superpowers.

## Fase 0 — Contratos e decisões

API real, regiões center+zoom, marca, WhatsApp, privacidade e deploy.

## Fase 1 — Fundação

Parcialmente concluída: contexto, documentação, skills, templates de governança, scaffold Astro static-first, qualidade local básica, build estático, Git local/remoto e CI básica estão criados. Ainda faltam commit/push desta etapa e GitHub settings/rulesets.

## Fase 2 — Landing estática mobile-first

Header, hero, seções institucionais, FAQ, rodapé e imagens otimizadas.

Execução deve seguir `docs/INITIAL_UI_ROADMAP.md`: roadmap visual/técnico → Grill-me → prompt Codex UI com imagens de referência → implementação → auditoria Hermes → commit/push manual do usuário.

## Fase 3 — Viabilidade sem Maps

Regiões mockadas/fixture, GPS, coordenadas, modal e WhatsApp.

## Fase 4 — Google Maps sob demanda

Busca, mapa, toque, marcador arrastável e fallback.

## Fase 5 — API real

Contrato real, Worker se necessário, idempotência, cache, rate limit e logs seguros.

## Fase 6 — Qualidade e produção

Acessibilidade, SEO, privacidade, performance, domínio, monitoramento e runbook.
