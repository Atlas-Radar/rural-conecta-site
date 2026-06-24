# Fluxo de agentes

## Status atual

Fundação de governança criada e scaffold técnico inicial aprovado como base.

Estado local atual:

- scaffold Astro static-first criado manualmente em diretório já existente;
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `astro.config.mjs`, `tsconfig.json`, `src/` e `tests/unit/` criados;
- dependências instaladas dentro do escopo aprovado: `astro`; dev dependencies `@astrojs/check`, `typescript`, `prettier`, `prettier-plugin-astro`, `vitest` e `@vitest/coverage-v8`;
- validações passaram via `corepack pnpm`: `format:check`, `check`, `test` e `build`;
- build final estático sem JavaScript inicial, sem Google Maps, sem scripts de terceiros e sem imagens;
- `dist/index.html` tem aproximadamente 4.8 KB e o CSS gerado aproximadamente 6.4 KB;
- Git ainda não foi inicializado;
- sem commit, remoto, GitHub settings, Cloudflare ou Superpowers.

Próximos agentes podem atuar sobre a base Astro existente, mantendo escopo pequeno e sem ações remotas sem autorização explícita.

## Fonte canônica

AGENTS.md na raiz é o contexto operacional compartilhado para Hermes e Codex.

## Docs

Detalhes vivem em docs/. Não duplicar todo o contexto em AGENTS.md.

## Skills do projeto

Skills versionadas vivem em .agents/skills/.

## Hermes

Não alterar configuração global silenciosamente. Para usar skills do projeto no Hermes, propor patch de external_dirs e pedir aprovação antes de aplicar.

## Codex

Codex deve ler AGENTS.md e usar skills do projeto quando disponíveis.

## Ações remotas

Push, merge, deploy, settings GitHub e criação de remoto exigem autorização explícita.

## Superpowers

Opcional para Codex, não requisito do projeto. Não instalar Superpowers completo no Hermes inicialmente.
