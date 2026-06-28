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
- Playwright local configurado para TDD visual e auditoria responsiva.

Ainda não executado por decisão de escopo:

- commit;
- push desta etapa;
- CI/GitHub workflows;
- GitHub settings/rulesets;
- Cloudflare;
- Superpowers.

## Fase 0 — Contratos e decisões

API real, regiões center+zoom, marca, WhatsApp, privacidade e deploy.

## Fase 1 — Fundação

Parcialmente concluída: contexto, documentação, skills, templates de governança, scaffold Astro static-first, qualidade local básica, build estático, Git local/remoto e Playwright local estão criados. CI/GitHub workflows ficam para pré-produção; ainda faltam GitHub settings/rulesets.

## Fase 2 — Landing estática mobile-first

Landing institucional completa, visualmente premium, mobile-first e ultraleve.

Execução atualizada: em vez de microetapas por seção, seguir `docs/INITIAL_UI_ROADMAP.md` no modo acelerado. Primeiro construir um mock visual completo da landing com todas as seções principais; depois refinar visual, textos, dados reais, iconização, animações leves e integrações.

Status em 2026-06-28: Ondas 1, 2 e 3 concluídas localmente. A landing já tem mock completo, pré-viabilidade funcional sem Maps, base local configurável para API Atlas e refino visual/copy comercial seguro. Próximo foco recomendado: Onda 4, refatorando a pré-análise para um modal fullscreen aberto somente por CTA, com localização leve, coordenadas DD/DMS e preparação técnica para mapa sob demanda.

Ondas atuais:

1. **Concluída** — Mock visual completo da landing, incluindo hero premium com imagem otimizada, consulta visual, seções institucionais, regiões mockadas/seguras, FAQ, CTA final e rodapé.
2. **Concluída** — Viabilidade funcional com API real sem Maps, usando `docs/LANDING_API_INTEGRATION.md`: regiões públicas, geolocalização/coordenadas, request de pré-viabilidade, estados de retorno, WhatsApp contextual e base local configurável via `PUBLIC_ATLAS_API_BASE_URL`.
3. **Concluída** — Refino visual e conteúdo após avaliação da página inteira e da base funcional: disponibilidade menos densa, planos/regiões/FAQ/copy comercial segura e prova social sem depoimentos fictícios.
4. **Pendente** — Modal fullscreen de pré-análise, localização sem Maps, coordenadas DD/DMS e preparação para mapa.
5. **Pendente** — Onda combinada Google Maps sob demanda + iconização/animações/polimento, sem perder o requisito de Maps inicial 0 KB.
6. **Pendente** — Qualidade final e produção.

Prompts podem ser mais longos e usar subagentes/execuções paralelas para assets, performance, testes e auditoria, desde que respeitem os limites do projeto e não façam commit/push sem autorização.

## Fase 3 — Viabilidade sem Maps

Regiões mockadas/fixture, GPS, coordenadas, modal e WhatsApp.

## Fase 4 — Google Maps sob demanda

Busca, mapa, toque, marcador arrastável e fallback.

## Fase 5 — API real

Contrato real, Worker se necessário, idempotência, cache, rate limit e logs seguros.

## Fase 6 — Qualidade e produção

Acessibilidade, SEO, privacidade, performance, domínio, monitoramento e runbook.
