# Estratégia de testes

## Status atual

Scaffold técnico inicial contém teste unitário mínimo em `tests/unit/site.test.ts` para validar o número oficial do WhatsApp e a codificação segura da mensagem no link `wa.me`.

Validações já executadas via `corepack pnpm`:

- `pnpm format:check`;
- `pnpm check`;
- `pnpm test`;
- `pnpm build`.

Resultado atual:

- `format:check` passou;
- `check` passou sem erros, warnings ou hints;
- `test` passou com 1 arquivo e 2 testes;
- `build` passou e gerou site estático.

Playwright/E2E ainda não foi instalado por decisão de escopo.

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

## E2E futuro

- landing abre sem Maps
- menu mobile
- GPS permitido e negado
- coordenadas manuais
- Maps sob demanda
- modal/bottom sheet
- WhatsApp contextual
- navegação por teclado

## Performance

Testar 360–430 px primeiro e perfis de 1 Mbps e 512 Kbps.
