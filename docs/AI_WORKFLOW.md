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
- Git já foi inicializado em `main`, com upstream `origin/main`;
- CI básica criada em `.github/workflows/ci.yml`;
- sem push desta etapa, GitHub settings/rulesets, Cloudflare ou Superpowers.

Próximos agentes podem atuar sobre a base Astro existente, mantendo escopo pequeno. O trabalho pode ocorrer direto em `main` enquanto o dev interino autorizar, mas push, merge, deploy e settings remotos continuam exigindo autorização explícita.

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

## Fluxo visual permanente

Daqui para frente, o fluxo oficial para UI é:

1. Hermes gera roadmap visual/técnico.
2. Hermes faz Grill-me detalhado para cada etapa ou seção.
3. Hermes transforma o Grill-me aprovado em prompt detalhado para Codex UI.
4. Codex UI implementa usando imagens de referência anexadas.
5. Hermes audita o resultado real.
6. O usuário faz git commit e git push manualmente.

Documentos canônicos:

- `docs/UI_IMPLEMENTATION_WORKFLOW.md`;
- `docs/GRILL_ME_TEMPLATE.md`;
- `docs/CODEX_UI_PROMPT_TEMPLATE.md`;
- `docs/INITIAL_UI_ROADMAP.md`;
- `docs/prompts/codex_ui/README.md`.

Skills do fluxo:

- `.agents/skills/rural_ui_roadmap_grill/SKILL.md`;
- `.agents/skills/rural_codex_ui_prompt/SKILL.md`;
- `.agents/skills/rural_visual_audit/SKILL.md`.

Regras permanentes:

- toda tarefa visual para Codex UI deve usar imagens de referência anexadas;
- imagens são direção visual, não assets grandes do site;
- reconstruir UI em HTML, CSS nativo e Astro Components;
- não usar React, Tailwind, biblioteca de UI ou biblioteca de animação;
- não carregar Google Maps no início;
- não coletar nome/telefone na consulta de viabilidade;
- não expor torres, CTOs, rotas ou tecnologia provável;
- resultado da viabilidade continua simples: atende/não atende + WhatsApp;
- Codex UI deve entregar relatório final para commit manual do usuário.

## Ações remotas

Push, merge, deploy, settings GitHub e criação de remoto exigem autorização explícita.

## Superpowers

Opcional para Codex, não requisito do projeto. Não instalar Superpowers completo no Hermes inicialmente.
