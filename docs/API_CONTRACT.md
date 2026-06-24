# Contrato da API

## Status

DRAFT — exemplos propostos, não contrato real.

## Decisões pendentes

- URL de homologação.
- Endpoint real de regiões.
- Endpoint real de viabilidade.
- Autenticação.
- CORS.
- Rate limit.
- Timeout.
- Formato real de erro.
- Existência de consultationId.
- Política de idempotência.
- Campos salvos e retenção.

## Regiões

```http
GET /api/regions
```

Resposta normalizada proposta:

```json
{
  "regions": [
    {
      "id": "nolasco",
      "name": "Nolasco",
      "center": { "lat": -17.123, "lng": -46.123 },
      "defaultZoom": 12
    }
  ]
}
```

## Viabilidade

```http
POST /api/viability
Content-Type: application/json
```

Payload proposto:

```json
{
  "requestId": "01JXYZ123ABC",
  "regionId": "nolasco",
  "location": {
    "lat": -17.123456,
    "lng": -46.123456,
    "accuracyMeters": 28
  },
  "source": "device"
}
```

Resposta proposta:

```json
{
  "consultationId": "RC-8F3K2",
  "available": true
}
```

## Regras

- A resposta pública deve indicar somente atende/não atende.
- Não revelar tecnologia provável.
- requestId deve ser idempotente.
- Não fazer retry cego de POST.
