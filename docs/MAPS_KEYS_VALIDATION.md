# Validação e configuração segura do Google Maps

## Status

Este documento bloqueia a passagem para a Onda 6 enquanto a validação manual com chave real do Google Maps não estiver concluída em ambiente local e depois em produção.

A chave usada pelo navegador em `PUBLIC_GOOGLE_MAPS_API_KEY` é pública por definição: ela será embutida no bundle estático quando existir no build. A segurança vem de restrição no Google Cloud, não de segredo no frontend.

## Variáveis usadas pela landing

Arquivo local não versionado recomendado para desenvolvimento:

```dotenv
# .env.local ou .env local, nunca commitado
PUBLIC_GOOGLE_MAPS_API_KEY=
PUBLIC_GOOGLE_MAP_ID=
```

Regras:

- `PUBLIC_GOOGLE_MAPS_API_KEY` pode chegar ao navegador e deve ser tratada como chave pública restrita.
- Não colocar token privado, service account, chave backend ou credencial de faturamento em variável `PUBLIC_`.
- Usar chave separada para local/staging e produção sempre que possível.
- `PUBLIC_GOOGLE_MAP_ID` é opcional; se usado, também é identificador público, não segredo.
- `.env`, `.env.local` e arquivos equivalentes com valores reais não devem ser commitados.

## Formatação recomendada por ambiente

### Local

```dotenv
PUBLIC_GOOGLE_MAPS_API_KEY=COLE_A_CHAVE_PUBLICA_LOCAL_RESTRITA_AQUI
PUBLIC_GOOGLE_MAP_ID=COLE_O_MAP_ID_PUBLICO_SE_EXISTIR
PUBLIC_ATLAS_API_BASE_URL=http://localhost:3001
```

Validar a landing local sempre na mesma porta permitida pela API/CORS local:

```text
http://localhost:4321
http://127.0.0.1:4321
```

### Produção

Configurar no provedor de build/deploy, por exemplo Cloudflare Pages, como variável de ambiente de produção:

```dotenv
PUBLIC_GOOGLE_MAPS_API_KEY=CHAVE_PUBLICA_PROD_RESTRITA_A_DOMINIO
PUBLIC_GOOGLE_MAP_ID=MAP_ID_PUBLICO_SE_EXISTIR
PUBLIC_SITE_URL=https://ruralconectamg.com.br
```

Não salvar valores reais em docs, README, prompts, issues ou logs.

## Restrições obrigatórias no Google Cloud

### Chave local/staging

Application restrictions: HTTP referrers.

Referers permitidos para validação local:

```text
http://localhost:4321/*
http://127.0.0.1:4321/*
```

Não usar outra porta local para a landing enquanto a API/CORS local estiver apontando para 4321.

### Chave de produção

Application restrictions: HTTP referrers.

Referers mínimos de produção:

```text
https://ruralconectamg.com.br/*
https://www.ruralconectamg.com.br/*
```

Se houver ambiente de preview/staging, criar chave própria para ele ou adicionar somente o domínio exato do preview aprovado.

### API restrictions

Restringir a chave somente às APIs necessárias:

```text
Maps JavaScript API
Places API
```

Não liberar todas as APIs do projeto Google Cloud.

## Checklist de validação local

1. Criar `.env.local` ou `.env` local com `PUBLIC_GOOGLE_MAPS_API_KEY` real restrita a localhost.
2. Subir a landing em porta validada:

```bash
corepack pnpm dev
```

3. Abrir:

```text
http://127.0.0.1:4321/
```

4. Antes de abrir a pré-análise, confirmar no DevTools/Network que não houve request para:

```text
maps.googleapis.com
maps.gstatic.com
```

5. Abrir a pré-análise por um CTA. A abertura do modal não deve carregar Maps/Places.
6. Dentro do modal, antes de acionar busca/mapa, confirmar que ainda não houve request para Maps.
7. Acionar explicitamente `Busca ou mapa` ou `Escolher no mapa`.
8. Confirmar que o Maps/Places carrega somente depois dessa ação explícita.
9. Testar:
   - busca por local com Places;
   - clique/toque no mapa;
   - arraste do marcador;
   - confirmar ponto;
   - consultar pré-análise;
   - fallback removendo temporariamente a chave.
10. Console não pode mostrar:

```text
RefererNotAllowedMapError
ApiNotActivatedMapError
InvalidKeyMapError
BillingNotEnabledMapError
```

11. Rodar validações:

```bash
corepack pnpm format:check
corepack pnpm lint
corepack pnpm check
corepack pnpm test
corepack pnpm test:e2e
corepack pnpm build
```

12. Auditar build:

```bash
grep -R "maps.googleapis.com" dist/index.html dist/_astro || true
grep -R "googletagmanager\|react\|tailwind" dist/index.html dist/_astro || true
```

Aceite esperado:

- `dist/index.html` não contém `maps.googleapis.com`.
- `maps.googleapis.com` pode aparecer somente no bundle do fluxo sob demanda.
- Nenhum script de Maps é carregado na abertura inicial da landing.
- Nenhum script de Maps é carregado apenas por abrir o modal.
- O script de Maps aparece somente depois de ação explícita de busca/mapa dentro do modal.

## Checklist de validação em produção

1. Configurar variável de produção no provedor de build/deploy.
2. Usar chave de produção restrita aos domínios oficiais.
3. Fazer deploy/preview somente quando autorizado.
4. Abrir o domínio final em janela anônima ou perfil limpo.
5. Repetir os testes do checklist local.
6. Verificar no console que não há erro de referrer, API desativada, chave inválida ou billing.
7. Confirmar no Google Cloud que a chave usada tem somente:
   - HTTP referrers dos domínios aprovados;
   - Maps JavaScript API;
   - Places API.

## Critérios para desbloquear a Onda 6

A Onda 6 só deve começar quando:

- a chave local restrita funcionar na landing local;
- a estratégia de produção estiver definida com chave própria ou restrição de domínio final;
- o Maps continuar 0 KB na carga inicial;
- o fallback sem chave continuar funcional;
- não houver erro de console relacionado à chave;
- o modal de pré-análise estiver visualmente simplificado e aprovado para seguir.

