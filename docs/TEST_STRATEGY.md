# Estratégia de testes

## Status atual

Scaffold técnico inicial contém teste unitário mínimo em `tests/unit/site.test.ts` para validar o número oficial do WhatsApp e a codificação segura da mensagem no link `wa.me`.

Validações já executadas via `corepack pnpm`:

- `pnpm format:check`;
- `pnpm lint`;
- `pnpm check`;
- `pnpm test`;
- `pnpm build`.

Resultado atual:

- `format:check` passou;
- `lint` passou;
- `check` passou sem erros, warnings ou hints;
- `test` passou com 1 arquivo e 2 testes;
- `build` passou e gerou site estático.

Playwright/E2E foi configurado para orientar TDD visual conforme o projeto evoluir.

ESLint foi configurado para qualidade estática de JavaScript/TypeScript/Astro via `corepack pnpm lint`.

## Unitários

- parser de coordenadas
- validação de latitude/longitude
- normalização de regiões
- payload de viabilidade
- mapeamento de resultado
- mensagem do WhatsApp
- seleção da melhor leitura de GPS
- requestId/idempotência

Implementado nesta base inicial:

- mensagem do WhatsApp.

## Integração

- endpoints internos, se houver Worker/BFF
- timeout e erro normalizado
- cache de regiões

## E2E com Playwright

Comandos:

- `corepack pnpm test:e2e` roda a suíte headless.
- `corepack pnpm test:e2e:ui` abre o modo interativo para depuração visual.

Política permanente:

- Toda etapa visual implementada via Codex UI deve criar ou ajustar pelo menos um teste Playwright quando alterar comportamento, navegação, responsividade, menu, CTA ou fluxo de interação.
- O teste deve priorizar mobile 390 px e depois desktop 1440 px.
- O teste deve confirmar que Google Maps e scripts de terceiros continuam ausentes da carga inicial quando a etapa não autorizar integrações.
- Screenshots podem ser usados como evidência de auditoria, mas não substituem asserts de acessibilidade, presença de CTA e ausência de scripts proibidos.
- Ao auditar output do Codex UI, Hermes deve verificar se os testes Playwright relevantes foram atualizados junto da mudança visual.

Cobertura inicial:

- header mobile-first com marca, menu acessível e CTA principal do hero visível;
- header desktop com navegação e CTAs;
- ausência de Maps/scripts proibidos na carga inicial.

## E2E futuro

- landing abre sem Maps
- GPS permitido e negado
- coordenadas manuais
- Maps sob demanda
- modal/bottom sheet
- WhatsApp contextual
- navegação por teclado

## Performance

Testar 360–430 px primeiro e perfis de 1 Mbps e 512 Kbps.
