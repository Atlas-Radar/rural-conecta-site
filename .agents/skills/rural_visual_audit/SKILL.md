---
name: rural_visual_audit
description: Use when auditing Codex UI output for Rural Conecta visual implementation, screenshots, mobile-first behavior, performance, accessibility, and scope compliance.
version: 1.0.0
author: Rural Conecta
license: Proprietary
metadata:
  hermes:
    tags: [rural-conecta, visual-audit, qa, mobile, performance]
    related_skills: [rural_ui_roadmap_grill, rural_codex_ui_prompt]
---

# Rural Visual Audit

## Overview

Use this skill after Codex UI returns implementation output. Hermes must verify the actual files, validations and visual evidence before the user commits manually.

## When to Use

- Codex UI returns a visual implementation.
- The user asks whether the result is ready.
- Screenshots or browser evidence need review.
- A change may affect mobile, performance, accessibility or product constraints.

## Do Not Use For

- Blindly trusting Codex UI's summary.
- Committing or pushing.
- Expanding implementation scope during audit.
- Adding missing features without a new approved prompt.

## Audit Procedure

1. Read the original prompt and approved Grill-me if available.
2. Check `git status -sb` and identify all changed files.
3. Confirm only expected files changed.
4. Read changed source files.
5. Search for forbidden dependencies or patterns: React, Tailwind, UI libs, animation libs, Maps initial scripts, API real, personal-data fields.
6. Run validations with `corepack pnpm` when dependencies are present:
   - `corepack pnpm format:check`
   - `corepack pnpm check`
   - `corepack pnpm test`
   - `corepack pnpm build`
7. Inspect `dist/` when build runs: JS count, Maps scripts, third-party scripts and asset sizes.
8. Review screenshots or use browser/Playwright when available.
9. Report `READY` or `NOT READY` for manual user commit.
10. If there is no blocker, immediately return the next recommended Grill-me from the visual roadmap.

## Visual Criteria

- Mobile 360-430 px is primary.
- Desktop expands the mobile design without becoming another product.
- CTA hierarchy is clear.
- Layout is not overcrowded.
- Rural-tech premium identity is preserved.
- Reference images influenced composition, atmosphere and visual language without becoming heavy assets.

## Product Constraints

- No name/phone/email/CPF collection in viability.
- No towers, CTOs, routes, network capacity or likely technology exposed.
- Viability result remains atende/não atende + WhatsApp.
- WhatsApp remains accessible when integrations fail.
- Google Maps remains lazy and absent from initial load unless the audited task explicitly authorizes map work.

## Performance Criteria

- No unnecessary initial JavaScript.
- No third-party scripts in initial load.
- No large images without optimization and justification.
- CSS/HTML remain within the budget in `docs/PERFORMANCE_BUDGET.md`.
- Generated `dist/` should be inspected for JS, Maps and asset size regressions.

## Output Format

```text
READY or NOT READY
Resumo
Arquivos em escopo
Arquivos fora de escopo, se houver
Validações executadas
Evidência visual revisada
Mobile/performance
Acessibilidade
Riscos
Git status
Ação recomendada para o usuário
```

## Verification Checklist

- [ ] Actual files were inspected.
- [ ] Validation output was verified, not assumed.
- [ ] Dist output was checked when build ran.
- [ ] Visual evidence was reviewed or requested.
- [ ] No commit/push was performed.
- [ ] Final answer clearly tells the user whether to commit manually.
- [ ] If READY, the next Grill-me is included unless the user explicitly asked to stop.
