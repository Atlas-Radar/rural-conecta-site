# Arquitetura

## Status

DRAFT inicial com scaffold técnico Astro criado manualmente.

## Decisão base

Astro static-first, TypeScript strict, CSS nativo e TypeScript vanilla no navegador.

## Scaffold atual

Criado manualmente para preservar a documentação e governança existentes no diretório.

Arquivos técnicos criados:

- `package.json`;
- `pnpm-lock.yaml`;
- `pnpm-workspace.yaml`;
- `astro.config.mjs`;
- `tsconfig.json`;
- `src/pages/index.astro`;
- `src/layouts/BaseLayout.astro`;
- `src/styles/tokens.css`;
- `src/styles/reset.css`;
- `src/styles/global.css`;
- `src/components/layout/Header.astro`;
- `src/components/layout/Footer.astro`;
- `src/components/ui/Button.astro`;
- `src/data/site.ts`;
- `tests/unit/site.test.ts`.

O build atual gera site estático com HTML funcional sem JavaScript. A página inicial contém header simples, hero textual, CTA HTML para WhatsApp, placeholder da futura verificação de disponibilidade e footer simples.

Não há nesta base inicial:

- framework client-side;
- Google Maps;
- API real;
- Worker/BFF;
- autenticação;
- banco de dados;
- imagens;
- scripts de terceiros;
- arquivo de secret.

## Fluxo principal

Visitante abre HTML/CSS estático no CDN, escolhe região, informa localização, consulta viabilidade e segue para WhatsApp humano.

```text
Visitante
  -> HTML/CSS/imagens estáticas
  -> GET /api/regions
  -> Geolocation API
  -> Google Maps/Places somente após ação
  -> POST /api/viability
  -> resultado atende/não atende
  -> WhatsApp humano
```

## Worker/BFF

Pendente. Usar Worker se for necessário esconder token, normalizar resposta, controlar CORS, aplicar cache, timeout, rate limit, idempotência ou proteger detalhes internos.

## Dependências permitidas

Produção: astro.
Desenvolvimento: typescript, @astrojs/check, vitest, @vitest/coverage-v8, prettier, prettier-plugin-astro.

## Dependências instaladas

Produção:

- `astro`.

Desenvolvimento:

- `@astrojs/check`;
- `typescript`;
- `prettier`;
- `prettier-plugin-astro`;
- `vitest`;
- `@vitest/coverage-v8`.

`pnpm-workspace.yaml` registra aprovação limitada dos build scripts transitivos necessários de `esbuild` e `sharp`, usados pela cadeia do Astro.

## Build atual

Validações executadas via `corepack pnpm`:

- `pnpm format:check`;
- `pnpm check`;
- `pnpm test`;
- `pnpm build`.

Resultado do build estático:

- `dist/index.html`: aproximadamente 4.8 KB;
- CSS gerado: aproximadamente 6.4 KB;
- JavaScript inicial: 0 KB;
- Google Maps inicial: 0 KB;
- scripts de terceiros iniciais: 0;
- imagens iniciais: 0.

## Proibido por padrão

React, Vue, Svelte, Preact, Tailwind, Axios, bibliotecas de componentes, estado, modal, carrossel, animação e loader de Google Maps de terceiros.
