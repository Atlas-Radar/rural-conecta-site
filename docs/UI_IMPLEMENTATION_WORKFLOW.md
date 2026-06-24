# Fluxo permanente de implementação visual/técnica

## Objetivo

Este documento define o fluxo permanente para transformar o conceito visual da Rural Conecta em uma landing Astro implementável, leve, mobile-first e auditável.

## Fluxo oficial

1. **Hermes gera roadmap visual/técnico**
   - Divide a landing em etapas e seções pequenas.
   - Mantém prioridade mobile-first e rede abaixo de 1 Mbps.
   - Separa design visual, HTML/CSS, componentes Astro, conteúdo, acessibilidade e performance.
   - Não autoriza implementação automática.

2. **Hermes faz Grill-me detalhado**
   - Para cada etapa ou seção, Hermes faz perguntas objetivas antes de gerar prompt de implementação.
   - O Grill-me resolve escopo, conteúdo, estados, responsividade, assets, referência visual e critérios de aceite.
   - O usuário aprova ou corrige o Grill-me.

3. **Hermes transforma o Grill-me aprovado em prompt para Codex UI**
   - O prompt deve ser pronto para colar no Codex UI.
   - O prompt deve citar AGENTS.md, docs relevantes e skills do projeto.
   - O prompt deve exigir uso das imagens anexadas como referência visual, não como assets grandes do site.

4. **Codex UI implementa**
   - Codex UI usa as imagens de referência anexadas para direção visual.
   - O site deve ser reconstruído com HTML, CSS nativo e Astro Components.
   - Codex UI não deve usar React, Tailwind, bibliotecas de UI, bibliotecas de animação, Google Maps inicial, API real ou coleta de dados pessoais sem autorização específica.

5. **Hermes audita o resultado**
   - Hermes lê o diff/arquivos e roda validações disponíveis.
   - Quando houver UI, Hermes deve pedir/usar evidência visual: screenshots, Playwright, browser local ou saída verificável do Codex UI.
   - Hermes confere mobile-first, rede lenta, acessibilidade, performance e aderência visual.
   - Se não houver bloqueador, Hermes já devolve o próximo Grill-me recomendado do roadmap visual.

6. **Usuário faz commit e push manualmente**
   - Hermes e Codex não fazem commit/push por padrão.
   - O relatório final deve dizer se está `READY` ou `NOT READY` para commit manual.
   - O usuário decide o commit e o push.

## Regras permanentes

- O projeto é mobile-first.
- A experiência precisa funcionar bem em conexões abaixo de 1 Mbps.
- O design deve manter aparência moderna, premium e rural-tech.
- Codex UI sempre recebe imagens de referência quando a tarefa for visual.
- Imagens de referência orientam direção visual; não devem virar imagens grandes no site.
- O site deve ser reconstruído em HTML, CSS nativo e Astro Components.
- Não usar React.
- Não usar Tailwind.
- Não usar biblioteca de UI.
- Não usar biblioteca de animação.
- Não carregar Google Maps no início.
- Não coletar nome/telefone na consulta de viabilidade.
- Não expor torres, CTOs, rotas ou tecnologia provável.
- Resultado da viabilidade deve ser simples: atende/não atende + WhatsApp.

## Papéis

### Hermes

- Mantém roadmap, Grill-me, prompts e auditoria.
- Atualiza docs de contexto quando uma etapa muda o plano ou estado do projeto.
- Não implementa landing visual sem autorização explícita.
- Não faz commit/push por padrão.

### Codex UI

- Implementa a etapa aprovada usando o prompt de Hermes.
- Usa imagens anexadas apenas como referência.
- Entrega relatório com arquivos alterados, validações, evidências visuais e riscos.
- Não faz commit/push por padrão.

### Usuário

- Aprova Grill-me e prompts.
- Fornece imagens de referência quando a tarefa for visual.
- Faz commit e push manualmente.

## Entrada padrão de uma etapa visual

- Etapa do roadmap.
- Seção ou fluxo em escopo.
- Imagens de referência anexadas.
- Respostas do Grill-me aprovado.
- Arquivos prováveis em escopo.
- Critérios de aceite mobile, desktop, performance e acessibilidade.

## Saída obrigatória de Codex UI

```text
READY ou NOT READY
Resumo
Arquivos alterados
Como usou as imagens de referência
Validações executadas
Evidências visuais geradas
Impacto mobile/performance
Acessibilidade
Riscos e pendências
Git status final
Commit sugerido para o usuário, sem executar commit
```

## Critérios de aceite para uma seção visual

- Funciona primeiro em 360–430 px.
- Não depende de hover.
- Tem HTML semântico.
- Usa CSS nativo e tokens do projeto.
- Mantém conteúdo legível em rede lenta.
- Não adiciona JS inicial desnecessário.
- Não adiciona assets grandes sem justificativa.
- Não carrega Maps, API real ou scripts de terceiros sem autorização específica.
- Mantém WhatsApp acessível.
- Passa em `corepack pnpm format:check`, `corepack pnpm check`, `corepack pnpm test` e `corepack pnpm build`, quando o escopo envolver código.
