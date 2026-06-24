---
name: rural-mobile-performance
description: Use for changes that can affect Rural Conecta mobile rendering, initial transfer size, images, fonts, JavaScript, Google Maps loading, Core Web Vitals, or behavior below 1 Mbps.
version: 1.0.0
author: Rural Conecta
license: Proprietary
metadata:
  hermes:
    tags: [rural-conecta, project, workflow]
    related_skills: []
---

# Rural Mobile Performance

## When to use
Use for changes touching rendering, CSS, images, fonts, JavaScript, Maps loading, Core Web Vitals or network behavior.

## Procedure
1. Prioritize 360-430 px.
2. Check critical budget in docs/PERFORMANCE_BUDGET.md.
3. Keep Google Maps at 0 KB initial.
4. Avoid third-party scripts, heavy blur, video, particles and desktop images on mobile.
5. Verify fallback with slow or blocked integrations.

## Output
Report budget impact, new assets, requests and remaining risks.
