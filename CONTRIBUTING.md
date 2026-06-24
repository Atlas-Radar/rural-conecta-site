# Contribuição

## Antes de editar
1. Leia AGENTS.md.
2. Leia docs/PROJECT_CONTEXT.md e o documento específico da área alterada.
3. Confirme decisões pendentes em docs/DECISIONS_PENDING.md.

## Regras
- Mudanças pequenas e revisáveis.
- Mobile-first sempre.
- Sem dependência nova sem aprovação.
- Sem secrets em arquivos versionados.
- Sem push, merge, deploy ou alteração remota sem autorização explícita.

## Validações previstas
Quando as dependências estiverem instaladas:
- pnpm format:check
- pnpm check
- pnpm test
- pnpm build
