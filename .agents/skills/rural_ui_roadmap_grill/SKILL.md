---
name: rural_ui_roadmap_grill
description: Use when planning Rural Conecta UI work, generating the visual/technical roadmap, or grilling a section before Codex UI implementation.
version: 1.0.0
author: Rural Conecta
license: Proprietary
metadata:
  hermes:
    tags: [rural-conecta, ui, roadmap, grill-me, planning]
    related_skills: [rural_codex_ui_prompt, rural_visual_audit]
---

# Rural UI Roadmap Grill

## Overview

Use this skill to plan the Rural Conecta landing visually and technically before implementation. It keeps Hermes in the planning role: roadmap first, Grill-me second, implementation prompt only after the user approves the answers. The current preferred mode is accelerated: build a complete visual mock of the landing first, then refine sections, copy, data, animation, iconography and integrations.

## When to Use

- Generating the initial UI roadmap.
- Breaking the landing into visual sections.
- Preparing a Grill-me for a section or flow.
- Deciding whether a section is ready for Codex UI.
- Updating roadmap context after a visual decision changes.

## Do Not Use For

- Direct implementation.
- Commit or push.
- GitHub settings, CI, Cloudflare or deployment.
- Google Maps/API work unless explicitly scoped as future planning only.

## Roadmap Procedure

1. Read `AGENTS.md` and all relevant docs.
2. Prioritize mobile 360-430 px.
3. Keep the first implementation wave focused on a complete visual/static mock of the whole landing, not on excessive micro-slices.
4. Merge related sections when the goal is speed: header/hero, viability placeholder, how it works, technologies, plans, local service, regions, enterprise/farms, testimonials/FAQ/CTA can be implemented together as a bounded mock wave.
5. Keep Google Maps, Worker/BFF and deploy out of visual slices unless explicitly authorized. API real can be moved into its own larger functional wave when the user confirms endpoints/data are available.
6. For each wave, list objective, files, reference images needed, risks, acceptance criteria and which subagents/parallel checks are useful.

## Grill-me Procedure

For each section, ask about:

- objective and primary CTA;
- mobile first viewport behavior;
- content and placeholders;
- reference images and what they should influence;
- what must not be copied from the references;
- performance budget and asset limits;
- accessibility requirements;
- product restrictions: no personal data, no infrastructure exposure, no technology result;
- validation expectations;
- whether the result is approved for Codex UI prompt generation.

Use `docs/GRILL_ME_TEMPLATE.md` as the canonical structure.

## Mandatory Constraints

- Mobile-first.
- Below 1 Mbps must remain usable.
- Modern, premium rural-tech visual direction.
- Images are references, not heavy site assets by default.
- Rebuild with HTML, native CSS and Astro Components.
- No React.
- No Tailwind.
- No UI library.
- No animation library.
- No initial Google Maps.
- No name/phone collection in viability.
- No towers, CTOs, routes, capacity or likely technology.
- Viability result remains atende/não atende + WhatsApp.

## Output Format

```text
ROADMAP or GRILL-ME
Etapa:
Objetivo:
Escopo:
Fora de escopo:
Perguntas:
Critérios de aceite:
Riscos:
Pronto para prompt Codex UI: sim/não
```

## Verification Checklist

- [ ] Roadmap or Grill-me references the correct docs.
- [ ] Scope is bounded enough for Codex UI and Hermes audit, even when a larger accelerated wave is intentional.
- [ ] Visual references are required for visual work.
- [ ] No implementation is performed by this skill.
- [ ] No commit/push is requested from Codex UI.
