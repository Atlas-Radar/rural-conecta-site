# Documentação Rural Conecta

## Status de bootstrap

Contexto, documentação, governança e scaffold técnico inicial foram criados localmente.

Estado técnico atual:

- scaffold Astro static-first criado manualmente;
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `astro.config.mjs`, `tsconfig.json`, `src/` e `tests/unit/` criados;
- dependências instaladas dentro do escopo aprovado;
- validações passaram via `corepack pnpm`: `format:check`, `lint`, `check`, `test` e `build`;
- build final sem JavaScript inicial, sem Google Maps, sem scripts de terceiros e sem imagens;
- `dist/index.html` tem aproximadamente 4.8 KB e o CSS gerado aproximadamente 6.4 KB.

Git local/remoto e Playwright local já foram configurados. CI/GitHub workflows, GitHub settings/rulesets, Cloudflare e Superpowers ficam para etapas futuras autorizadas.

## Desenvolvimento local

A landing local deve subir somente em `http://127.0.0.1:4321/`, porque essa é a origem permitida pela API/CORS local do Atlas. Use:

```bash
corepack pnpm dev
```

O script `pnpm dev` valida a disponibilidade da porta 4321 e falha em vez de subir em outra porta.

Use `ROADMAP.md` para status de fases e `DECISIONS_PENDING.md` para decisões abertas antes da implementação técnica.

| Documento             | Finalidade                                  | Quando atualizar                                   |
| --------------------- | ------------------------------------------- | -------------------------------------------------- |
| PROJECT_CONTEXT.md    | Produto, usuários, decisões e não objetivos | Quando produto, fluxo ou restrições mudarem        |
| DESIGN_BRIEF.md       | Direção visual mobile e desktop             | Quando marca, layout ou arte mudarem               |
| ARCHITECTURE.md       | Arquitetura técnica e dependências          | Quando stack, integrações ou fluxo técnico mudarem |
| API_CONTRACT.md       | Contrato de regiões e viabilidade           | Quando endpoints reais forem confirmados           |
| DESIGN_SYSTEM.md      | Tokens, componentes e padrões visuais       | Quando UI base mudar                               |
| LOCATION_STRATEGY.md  | GPS, busca, mapa, coordenadas e fallback    | Quando fluxo de localização mudar                  |
| PERFORMANCE_BUDGET.md | Orçamentos e perfis de rede                 | Quando assets/dependências impactarem performance  |
| ACCESSIBILITY.md      | WCAG, teclado, toque e dialog               | Quando componente interativo mudar                 |
| PRIVACY_DATA.md       | Dados coletados, retenção, logs e analytics | Antes de produção e quando dados mudarem           |
| TEST_STRATEGY.md      | Unitários, integração, E2E e performance    | Quando estratégia de validação mudar               |
| MAPS_KEYS_VALIDATION.md | Chaves públicas restritas do Google Maps e checklist local/prod | Antes de validar Maps real ou produção |
| ROADMAP.md            | Marcos do projeto                           | Quando fases forem concluídas ou replanejadas      |
| DECISIONS_PENDING.md  | Decisões abertas                            | Sempre que uma decisão for aberta ou fechada       |
| AI_WORKFLOW.md        | Uso de Hermes, Codex, AGENTS e skills       | Quando governança de agentes mudar                 |
| AI_SKILLS_CATALOG.md  | Catálogo das skills do projeto              | Quando skill for criada, editada ou removida       |
