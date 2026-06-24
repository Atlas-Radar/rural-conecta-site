# Rural Conecta

## Missão
Landing page mobile-first para provedora de internet rural, com consulta simples de disponibilidade e atendimento final por WhatsApp.

## Leia antes de editar
- docs/PROJECT_CONTEXT.md
- docs/ARCHITECTURE.md
- docs/DESIGN_BRIEF.md
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

## Comandos oficiais previstos
- pnpm dev
- pnpm format:check
- pnpm check
- pnpm test
- pnpm build
- pnpm test:e2e, quando existir fluxo E2E real

## Conclusão de tarefa
Informar resumo, arquivos, validações, impacto mobile/performance, riscos, documentos alterados e git status final.
