# Decisões pendentes

## Decisões já aplicadas na fundação de governança

- Owner planejado do GitHub: `atlas-radar`.
- Nome planejado do repositório: `rural-conecta-site`.
- Licença: projeto privado/proprietário; não adicionar licença open source sem autorização explícita.
- WhatsApp oficial confirmado: `38 9740-2599`.
- Padrão de nomes dos documentos: underscore.
- Geometria mínima de regiões para MVP: `center` + `defaultZoom`.
- Estratégia da Onda 2: chamada direta para API pública do Atlas, sem token e sem Worker/BFF. Worker/BFF permanece pendente apenas se produção exigir secrets, cache, rate limit adicional ou proteção de CORS.
- Política de privacidade: adotar mínima coleta, logs mascarados e revisão jurídica antes de produção.

## D001 — Estratégia API

- Pergunta: navegador direto ou Worker/BFF?
- Decisão da Onda 2: navegador direto para `https://atlassoftware.ia.br/api/public/*`, sem token e sem segredo no frontend.
- Recomendação futura: reavaliar Worker/BFF somente se houver secrets, necessidade de cache/rate limit no edge, normalização centralizada ou bloqueio de CORS.
- Status: resolvido para Onda 2; pendente para arquitetura final de produção.
- Bloqueia: não bloqueia a Onda 2.

## D002 — Contrato real de regiões

- Decisão da Onda 2: `GET /api/public/regioes` retorna `total` e `regioes[]` com `nome` e `fontes`.
- Uso público: exibir apenas `nome` como possível região/localidade e ignorar `fontes`/campos extras na UI.
- Status: resolvido para lista sem Maps; center/defaultZoom segue pendente para etapa de mapa.
- Bloqueia: não bloqueia a Onda 2; ainda bloqueia enquadramento futuro de mapa.

## D003 — Contrato real de viabilidade

- Decisão da Onda 2: `POST /api/public/viabilidade-basica` recebe somente `latitude` e `longitude` numéricos.
- Respostas públicas: `pre_viavel`, `sem_viabilidade_automatica` e `necessita_confirmacao` com mensagem simples.
- Erros tratados: `400`, `429`, `503` e falha de rede/CORS.
- Status: resolvido para pré-viabilidade sem Maps.
- Bloqueia: não bloqueia a Onda 2.

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
