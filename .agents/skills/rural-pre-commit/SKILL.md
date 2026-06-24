---
name: rural-pre-commit
description: Use before declaring a Rural Conecta change complete or ready for commit. Verify scope, git status, diff, secrets, formatting, type checks, tests, build, performance impact, and documentation.
version: 1.0.0
author: Rural Conecta
license: Proprietary
metadata:
  hermes:
    tags: [rural-conecta, project, workflow]
    related_skills: []
---

# Rural Pre Commit

## When to use
Use before declaring a change complete or ready for commit.

## Checklist
1. Confirm scope and changed files.
2. Check git status and diff when repo exists.
3. Search for secrets and unexpected files.
4. Run available format, check, tests and build.
5. Review mobile/performance impact.
6. Confirm docs updated.
7. Report risks and suggested commit message.

## Output
READY or NOT READY, summary, files, diff stat, validations, mobile/performance impact, docs, risks and git status.

## Limit
Do not commit unless the task explicitly authorizes commit.
