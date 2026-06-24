# Decisões pendentes

## Decisões já aplicadas na fundação de governança

- Owner planejado do GitHub: `atlas-radar`.
- Nome planejado do repositório: `rural-conecta-site`.
- Licença: projeto privado/proprietário; não adicionar licença open source sem autorização explícita.
- WhatsApp oficial confirmado: `38 9740-2599`.
- Padrão de nomes dos documentos: underscore.
- Geometria mínima de regiões para MVP: `center` + `defaultZoom`.
- Estratégia API direta versus Worker/BFF: permanece pendente até contrato real.
- Política de privacidade: adotar mínima coleta, logs mascarados e revisão jurídica antes de produção.

## D001 — Estratégia API

- Pergunta: navegador direto ou Worker/BFF?
- Opções: direto; Worker/BFF.
- Recomendação: decidir após conhecer autenticação, CORS e contrato real.
- Status: pendente.
- Bloqueia: integração real da API.

## D002 — Contrato real de regiões

- Pergunta: quais campos a API retorna?
- Recomendação: exigir id, name, center e defaultZoom para MVP.
- Status: pendente.
- Bloqueia: mapa e enquadramento de região.

## D003 — Contrato real de viabilidade

- Pergunta: payload, resposta, erros, timeout e consultationId?
- Status: pendente.
- Bloqueia: integração real.

## D004 — Privacidade e retenção

- Pergunta: prazo de retenção, base legal, exclusão e acesso?
- Recomendação: mínimo necessário, logs mascarados e revisão jurídica antes de produção.
- Status: pendente.
- Bloqueia: produção.

## D005 — Marca final

- Pergunta: logo, cores, tipografia e imagens oficiais?
- Status: pendente.
- Bloqueia: publicação visual final.

## D006 — Deploy e domínio

- Pergunta: Cloudflare Pages/Workers, domínio e ambientes?
- Status: pendente.
- Bloqueia: produção e GitHub settings finais.
