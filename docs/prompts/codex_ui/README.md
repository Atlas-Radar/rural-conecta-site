# Prompts para Codex UI

Esta pasta guarda prompts aprovados para execução no Codex UI.

## Fluxo

1. Hermes gera ou atualiza o roadmap visual/técnico.
2. Hermes faz Grill-me da etapa.
3. Usuário aprova ou corrige o Grill-me.
4. Hermes gera o prompt final usando `docs/CODEX_UI_PROMPT_TEMPLATE.md`.
5. O prompt aprovado pode ser salvo nesta pasta, quando fizer sentido histórico.
6. Codex UI executa usando imagens de referência anexadas.
7. Hermes audita o resultado.
8. Usuário faz commit/push manualmente.

## Convenção de nomes

Use nomes curtos e ordenáveis:

```text
001_header_hero.md
002_viability_static.md
003_how_it_works.md
```

## Regras

- Não salvar imagens de referência grandes nesta pasta.
- Não incluir secrets.
- Não transformar prompt em autorização de commit/push.
- Cada prompt deve conter escopo, fora de escopo, arquivos prováveis, validações e relatório final obrigatório.
