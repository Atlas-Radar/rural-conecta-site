---
name: rural-viability-map
description: Use when implementing or reviewing the Rural Conecta region, geolocation, place search, map selection, coordinate entry, viability request, result dialog, or WhatsApp handoff flow.
version: 1.0.0
author: Rural Conecta
license: Proprietary
metadata:
  hermes:
    tags: [rural-conecta, project, workflow]
    related_skills: []
---

# Rural Viability Map

## When to use
Use for region selection, GPS, search, map, marker, coordinates, viability request, result dialog or WhatsApp handoff.

## Rules
- Do not ask name, phone, email or CPF in the web consultation.
- Public result is only atende/não atende.
- Do not show likely technology or internal infrastructure.
- Keep requestId idempotent.
- Preserve selected point on errors.
- Offer WhatsApp fallback for GPS, Maps or API failures.

## Verification
Check loading, success, unavailable, temporary error, permission denied and Maps blocked states.
