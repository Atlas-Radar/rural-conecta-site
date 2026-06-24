# Roadmap

## Status atual

Fundação de contexto, documentação e governança criada localmente em `C:\Users\Toru\Documents\ruralconectamg`.
Scaffold técnico inicial Astro static-first criado manualmente sobre a base de documentação já existente.

Concluído nesta etapa:

- `AGENTS.md` como contexto canônico.
- `docs/` com documentos principais e ADR inicial.
- `.agents/skills/` com 6 skills específicas do projeto.
- templates locais de GitHub para PR e issues.
- arquivos auxiliares de governança: `.editorconfig`, `.gitattributes`, `.gitignore`, `.env.example`, `README.md`, `CONTRIBUTING.md` e `SECURITY.md`.
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `astro.config.mjs` e `tsconfig.json`.
- `src/` com layout base, página inicial mínima, componentes de header/footer/botão, tokens CSS e dados de site.
- `tests/unit/` com teste mínimo para montagem do link de WhatsApp.
- Dependências instaladas dentro do escopo aprovado: `astro`; dev dependencies `@astrojs/check`, `typescript`, `prettier`, `prettier-plugin-astro`, `vitest` e `@vitest/coverage-v8`.
- Validações passaram via `corepack pnpm`: `format:check`, `check`, `test` e `build`.
- Build estático final gerou `dist/index.html` com aproximadamente 4.8 KB e CSS com aproximadamente 6.4 KB, sem JavaScript inicial, sem Google Maps, sem scripts de terceiros e sem imagens.

Ainda não executado por decisão de escopo:

- inicialização Git;
- commit;
- repositório remoto;
- CI/GitHub Actions;
- Cloudflare;
- Superpowers.

## Fase 0 — Contratos e decisões

API real, regiões center+zoom, marca, WhatsApp, privacidade e deploy.

## Fase 1 — Fundação

Parcialmente concluída: contexto, documentação, skills, templates de governança, scaffold Astro static-first, qualidade local básica e build estático estão criados. Ainda faltam Git e CI.

## Fase 2 — Landing estática mobile-first

Header, hero, seções institucionais, FAQ, rodapé e imagens otimizadas.

## Fase 3 — Viabilidade sem Maps

Regiões mockadas/fixture, GPS, coordenadas, modal e WhatsApp.

## Fase 4 — Google Maps sob demanda

Busca, mapa, toque, marcador arrastável e fallback.

## Fase 5 — API real

Contrato real, Worker se necessário, idempotência, cache, rate limit e logs seguros.

## Fase 6 — Qualidade e produção

Acessibilidade, SEO, privacidade, performance, domínio, monitoramento e runbook.
