# ADR 0001 — Astro static-first, TypeScript vanilla e CSS nativo

## Status

Aceita inicialmente.

## Contexto

A Rural Conecta precisa de uma landing mobile-first, leve e funcional em redes rurais lentas.

## Decisão

Usar Astro como ferramenta de build estática, TypeScript strict, CSS nativo e TypeScript vanilla para interatividade pontual.

## Consequências

- Sem runtime de framework client-side por padrão.
- Melhor controle de carga inicial.
- Interações precisam ser pequenas e bem isoladas.
- Dependências novas exigem justificativa e aprovação.
