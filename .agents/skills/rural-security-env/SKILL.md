---
name: rural-security-env
description: Use when reviewing Rural Conecta environment variables, API credentials, Google Maps keys, CORS, Workers, logging, coordinates, headers, rate limits, idempotency, or sensitive data handling.
version: 1.0.0
author: Rural Conecta
license: Proprietary
metadata:
  hermes:
    tags: [rural-conecta, project, workflow]
    related_skills: []
---

# Rural Security Env

## When to use
Use for env vars, Google Maps keys, API credentials, CORS, Workers, logging, coordinates, headers, rate limits and idempotency.

## Blockers
- Secrets in files or logs.
- Real values in .env.example.
- PUBLIC_ prefix for private API tokens.
- CORS open without justification.
- Unrestricted Maps key in production.
- Logs with full payload or precise coordinates.
- npm audit fix, deploy or migration without approval.

## Verification
Check .env.example, .gitignore, logs, API exposure, Maps restrictions and privacy docs.
