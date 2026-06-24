# Privacidade e dados

## Status

DRAFT — requer revisão jurídica antes de produção.

## Recomendação segura inicial

Coletar e reter somente o mínimo necessário para responder à consulta e permitir atendimento humano. Não usar coordenadas para analytics comum. Evitar logs com coordenadas precisas.

## Dados técnicos possíveis

- regionId
- latitude/longitude
- precisão estimada
- método de localização
- requestId idempotente
- consultationId, se existir
- data/hora operacional

## Pendências

- Base legal.
- Prazo de retenção.
- Pessoas com acesso.
- Política de exclusão.
- Tratamento em backups.
- Procedimento de incidente.

## Regras

- Não coletar nome, telefone, e-mail ou CPF na consulta web.
- Não versionar dados reais.
- Não enviar coordenadas precisas a analytics.
- Mascarar logs sempre que possível.
