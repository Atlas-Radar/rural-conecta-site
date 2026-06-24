---
name: rural-architecture-change
description: Use when a Rural Conecta task changes architecture, API contracts, data flow, deployment, privacy, Google Maps strategy, or performance budgets. Do not use for routine copy or isolated CSS edits.
version: 1.0.0
author: Rural Conecta
license: Proprietary
metadata:
  hermes:
    tags: [rural-conecta, project, workflow]
    related_skills: []
---

# Rural Architecture Change

## When to use
Use for changes to stack, API contract, data flow, storage, deploy, map strategy, performance budget or privacy.

## Procedure
1. Read AGENTS.md and relevant docs.
2. List the decision, options and risks.
3. Identify impact on mobile, API, data, privacy and performance.
4. Ask approval before implementing structural changes.
5. Update docs/ADR and tests when the decision changes behavior.
6. Verify with available checks.

## Limits
Do not add dependencies, Worker, database, auth, deploy or remote changes without explicit approval.
