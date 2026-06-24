# Estratégia de localização

## Status

DRAFT inicial.

## Métodos

1. Usar minha localização.
2. Buscar fazenda ou local.
3. Escolher no mapa.
4. Informar coordenadas.
5. Enviar localização pelo WhatsApp.

## Regiões

MVP usa `center` + `defaultZoom` por região. Bounds ou polígonos podem ser avaliados depois.

## GPS

Usar leitura rápida primeiro e refinamento limitado em seguida. Guardar a leitura com menor accuracy.

## Google Maps

Carregar somente após ação do usuário. Não inserir script no head.

## Fallbacks

Se GPS, Maps ou API falharem, preservar a seleção e oferecer coordenadas manuais e WhatsApp.
