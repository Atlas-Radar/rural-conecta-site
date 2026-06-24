# Template de prompt para Codex UI

Use este template depois que o Grill-me da etapa for aprovado.

```text
Você está no projeto Rural Conecta.

Antes de editar, leia:
- AGENTS.md
- docs/UI_IMPLEMENTATION_WORKFLOW.md
- docs/PROJECT_CONTEXT.md
- docs/DESIGN_BRIEF.md
- docs/DESIGN_SYSTEM.md
- docs/PERFORMANCE_BUDGET.md
- docs/ACCESSIBILITY.md
- docs/ROADMAP.md
- docs/DECISIONS_PENDING.md
- .agents/skills/rural_ui_roadmap_grill/SKILL.md
- .agents/skills/rural_codex_ui_prompt/SKILL.md
- .agents/skills/rural_visual_audit/SKILL.md

Tarefa:
[descrever etapa aprovada]

Contexto aprovado no Grill-me:
[colar respostas aprovadas]

Imagens de referência:
- Use as imagens anexadas como referência de direção visual.
- Não transforme as imagens anexadas em imagens grandes do site.
- Reconstrua o layout em HTML semântico, CSS nativo e Astro Components.

Escopo permitido:
- [arquivos]
- [componentes]
- [seções]

Fora de escopo:
- Não usar React.
- Não usar Tailwind.
- Não usar biblioteca de UI.
- Não usar biblioteca de animação.
- Não instalar dependências.
- Não alterar stack.
- Não criar CI ou workflow GitHub.
- Não fazer commit.
- Não fazer push.
- Não carregar Google Maps no início.
- Não integrar API real.
- Não coletar nome/telefone/e-mail/CPF na consulta.
- Não expor torres, CTOs, rotas, capacidade ou tecnologia provável.

Requisitos de produto:
- Mobile-first.
- Deve funcionar bem em conexões abaixo de 1 Mbps.
- Aparência moderna, premium e rural-tech.
- Resultado de viabilidade sempre simples: atende/não atende + WhatsApp.
- WhatsApp humano permanece como saída principal.

Requisitos técnicos:
- Astro static-first.
- TypeScript strict.
- CSS nativo.
- Componentes Astro pequenos.
- Sem JS inicial desnecessário.
- Sem Maps inicial.
- Sem scripts de terceiros.
- Conteúdo institucional útil mesmo sem JS.

Critérios de aceite:
- Funciona entre 360 e 430 px.
- Desktop expande o mobile, não cria outro produto.
- Botões com área de toque confortável.
- Foco visível e contraste adequado.
- Estados não dependem só de cor.
- Sem assets pesados desnecessários.
- `dist` final não inclui JS/Maps inicial se a etapa não exigir JS.

Validações obrigatórias:
- corepack pnpm format:check
- corepack pnpm check
- corepack pnpm test
- corepack pnpm build

Se a tarefa for visual, entregue evidências:
- screenshot mobile 390 px;
- screenshot desktop;
- observações sobre aderência às imagens de referência.

Relatório final obrigatório:
READY ou NOT READY
Resumo
Arquivos alterados
Como usou as imagens de referência
Validações executadas
Evidências visuais
Impacto mobile/performance
Acessibilidade
Riscos e pendências
Git status final
Mensagem de commit sugerida para o usuário

Não execute commit.
Não execute push.
```
