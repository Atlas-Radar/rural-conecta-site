# Rural Conecta

## Missão

Landing page mobile-first para provedora de internet rural, com consulta simples de disponibilidade e atendimento final por WhatsApp.

## Leia antes de editar

- docs/PROJECT_CONTEXT.md
- docs/ARCHITECTURE.md
- docs/DESIGN_BRIEF.md
- docs/UI_IMPLEMENTATION_WORKFLOW.md
- docs/PERFORMANCE_BUDGET.md
- docs/DECISIONS_PENDING.md
- documentos específicos da área alterada

## Decisões confirmadas

- Owner GitHub planejado: atlas-radar.
- Repositório planejado: rural-conecta-site.
- Projeto privado/proprietário; não adicionar licença aberta sem autorização.
- WhatsApp oficial: 38 9740-2599.
- Nomes de documentos usam underscore.
- Regiões devem expor center + defaultZoom para o MVP.
- Estratégia API direta versus Worker/BFF permanece pendente.

## Arquitetura

- Astro estático.
- TypeScript strict.
- CSS nativo.
- TypeScript vanilla para interatividade.
- Sem framework client-side.
- Google Maps somente sob demanda.
- Worker apenas se necessário para secrets, CORS, cache, rate limit ou proteção da API.

## Regras não negociáveis

- Mobile e rede lenta têm prioridade sobre desktop.
- Não carregar Maps na abertura.
- Não adicionar dependência sem justificar e pedir autorização.
- Não coletar nome, telefone, e-mail ou CPF na consulta de viabilidade.
- Não expor torres, CTOs, rotas, capacidade, distância a equipamentos ou tecnologia provável.
- Não registrar secrets ou coordenadas precisas em logs comuns.
- Não alterar contratos sem atualizar docs e testes.
- Não fazer push, merge, deploy, alteração remota ou commit sem autorização explícita.

## Fluxo de trabalho

1. Verificar branch, status e contexto.
2. Definir escopo e arquivos.
3. Fazer mudança pequena.
4. Atualizar testes e docs afetados.
5. Rodar validações disponíveis.
6. Revisar diff.
7. Informar riscos e próximos passos.

## Fluxo visual permanente

Para implementação visual da landing, seguir sempre:

1. Hermes gera roadmap visual/técnico.
2. Hermes faz Grill-me detalhado da etapa ou seção.
3. Hermes transforma o Grill-me aprovado em prompt para Codex UI.
4. Codex UI implementa usando imagens de referência anexadas.
5. Hermes audita resultado real, validações e evidência visual.
6. O usuário faz commit e push manualmente.

Documentos e skills do fluxo:

- docs/UI_IMPLEMENTATION_WORKFLOW.md
- docs/GRILL_ME_TEMPLATE.md
- docs/CODEX_UI_PROMPT_TEMPLATE.md
- docs/INITIAL_UI_ROADMAP.md
- .agents/skills/rural_ui_roadmap_grill/SKILL.md
- .agents/skills/rural_codex_ui_prompt/SKILL.md
- .agents/skills/rural_visual_audit/SKILL.md

Codex UI deve receber imagens de referência em tarefas visuais. As imagens orientam direção visual, mas o site deve ser reconstruído em HTML semântico, CSS nativo e Astro Components; não transformar referências em imagens grandes do site.

Hermes e Codex não fazem commit/push por padrão. O relatório final deve dizer se está pronto para commit manual do usuário.

Quando o usuário trouxer output do Codex UI, Hermes deve sempre auditar o resultado real antes de aprovar, verificar arquivos/validações/status, reportar READY ou NOT READY e, se não houver bloqueador, devolver o próximo Grill-me recomendado do roadmap visual.

## Comandos oficiais previstos

- pnpm dev
- pnpm format:check
- pnpm lint
- pnpm check
- pnpm test
- pnpm build
- pnpm test:e2e, quando existir fluxo E2E real

## Conclusão de tarefa

Informar resumo, arquivos, validações, impacto mobile/performance, riscos, documentos alterados e git status final.
