---
name: rural_codex_ui_prompt
description: Use when converting an approved Rural Conecta Grill-me into a detailed Codex UI implementation prompt with scope, constraints, references, validations, and reporting.
version: 1.0.0
author: Rural Conecta
license: Proprietary
metadata:
  hermes:
    tags: [rural-conecta, codex-ui, prompt, implementation-handoff]
    related_skills: [rural_ui_roadmap_grill, rural_visual_audit]
---

# Rural Codex UI Prompt

## Overview

Use this skill after the user approves a Grill-me. It turns the approved answers into a paste-ready Codex UI prompt that implements exactly one visual or technical slice.

## When to Use

- A Grill-me has been approved.
- The user asks for a Codex UI prompt.
- A visual section needs image references passed into Codex UI.
- Hermes needs to hand off implementation while preserving project constraints.

## Do Not Use For

- Creating broad multi-section implementation prompts.
- Authorizing commit/push.
- Installing dependencies or changing stack.
- Adding Google Maps, API real, CI, GitHub workflows, Cloudflare or deploy unless the user explicitly changes scope.

## Prompt Construction

1. Start with repo context and docs to read.
2. State the task in one paragraph.
3. Paste the approved Grill-me summary.
4. List image reference instructions.
5. List exact in-scope files or areas.
6. List explicit non-goals.
7. Repeat project constraints.
8. Define acceptance criteria.
9. Define validations, always including unit tests.
10. Require final report for manual user commit.

Use `docs/CODEX_UI_PROMPT_TEMPLATE.md` as the canonical base.

## Mandatory Image Reference Language

For visual tasks, include:

- Use the attached images as visual direction.
- Do not use the attached images as large site assets.
- Recreate the design with semantic HTML, native CSS and Astro Components.
- Preserve performance for sub-1 Mbps connections.

## Mandatory Non-goals

Every Codex UI prompt must say:

- Do not use React.
- Do not use Tailwind.
- Do not use UI libraries.
- Do not use animation libraries.
- Do not install dependencies unless explicitly authorized.
- Do not create CI or GitHub workflows.
- Do not commit.
- Do not push.
- Do not load Google Maps initially.
- Do not integrate API real unless explicitly scoped.
- Do not collect name, phone, email or CPF in viability.
- Do not expose towers, CTOs, routes, capacity or likely technology.

## Final Report Required From Codex UI

```text
READY or NOT READY
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
```

## Mandatory Validation Commands

Every Codex UI prompt must include these commands in the validation section:

- `corepack pnpm format:check`
- `corepack pnpm lint`
- `corepack pnpm check`
- `corepack pnpm test` — mandatory unit tests; never omit, even for visual slices.
- `corepack pnpm build`

When the slice changes navigation, menu, CTA, responsiveness or visual interaction, also require:

- `corepack pnpm test:e2e`

## Verification Checklist

- [ ] Prompt is one slice only.
- [ ] Prompt mentions the reference images.
- [ ] Prompt includes forbidden dependencies and integrations.
- [ ] Prompt requires validation commands, including `corepack pnpm test` for unit tests.
- [ ] Prompt forbids commit/push.
- [ ] Prompt asks Codex UI for evidence Hermes can audit.
