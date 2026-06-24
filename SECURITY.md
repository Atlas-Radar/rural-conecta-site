# Segurança

## Secrets
Nunca versionar tokens, chaves, cookies, credenciais, `.env` real ou `.dev.vars`.

## Dados sensíveis
Coordenadas, endereço textual completo e identificadores de consulta devem ser tratados como dados sensíveis operacionais.

## Logs
Não registrar em logs comuns:
- tokens ou chaves privadas;
- telefone;
- endereço pesquisado integral;
- coordenada completa quando não for indispensável;
- payload completo da API;
- detalhes internos de infraestrutura.

## Relato de incidente
Registrar incidente com data, impacto, dados afetados, contenção, correção e decisão de comunicação ao responsável jurídico/produto.
