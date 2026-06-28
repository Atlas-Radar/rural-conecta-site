# Rural Conecta — Contexto Mestre do Projeto

> Documento de contexto para agentes de desenvolvimento, design, revisão e automação. Esta é a fonte de verdade inicial do projeto. Quando uma decisão mudar, atualize este arquivo e registre a mudança em um ADR ou no histórico do projeto.

## 1. Visão do produto

A **Rural Conecta** é uma provedora de internet para zona rural, com foco em fibra, rádio e soluções dedicadas para casas, fazendas, comunidades e empresas. A landing page deve transmitir três atributos principais:

1. **Tecnologia que funciona no campo**.
2. **Atendimento humano e regional**.
3. **Facilidade para verificar a disponibilidade em propriedades rurais**.

O site não será um sistema de contratação automática. Ele terá a função de:

- apresentar a marca e os serviços;
- gerar confiança;
- permitir que o visitante localize sua propriedade;
- consultar a API de viabilidade;
- mostrar um resultado simples de disponibilidade;
- encaminhar a conversa para um atendente humano pelo WhatsApp.

A maioria dos visitantes acessará pelo celular e parte relevante deles poderá estar em conexões inferiores a **1 Mbps**, com alta latência, perda de pacotes e instabilidade.

## 2. Princípios não negociáveis

- O projeto é **mobile-first** e **low-bandwidth-first**.
- O celular tem prioridade sobre desktop em design, desempenho e testes.
- A página deve continuar útil em redes inferiores a 1 Mbps.
- A landing não será uma SPA tradicional hidratada no navegador.
- O conteúdo institucional deve funcionar mesmo se o Google Maps não carregar.
- O Google Maps nunca poderá bloquear a primeira renderização ou o acesso ao WhatsApp.
- A interface deve permanecer moderna, premium e coerente com a identidade rural/tecnológica.
- A modernidade virá de composição, tipografia, fotografia, contraste e microinterações — não de bibliotecas pesadas ou efeitos permanentes.
- Não usar React, Vue, Svelte, Preact ou outro runtime de componentes no navegador.
- Não usar Tailwind, biblioteca de componentes, biblioteca de animação ou biblioteca de estado.
- Não criar autenticação, conta de cliente, checkout, painel ou banco de dados novo para o MVP.
- Não expor infraestrutura interna, torres, CTOs, rotas de fibra, portas, visada ou capacidade de rede no mapa público.
- A API é a fonte de verdade para a resposta final de disponibilidade.
- O atendimento e a negociação final ocorrerão no WhatsApp com uma pessoa.

## 3. Decisões de produto já confirmadas

### 3.1 Resposta da API

A API de viabilidade retornará apenas uma resposta comercial simples:

- **atende**;
- **não atende**.

Ela não precisa classificar para o visitante se o atendimento será por fibra, rádio ou link dedicado.

### 3.2 Regiões

A lista de regiões já existe na API própria e deverá ser consumida pelo site.

Ainda não está confirmado se cada região terá:

- centro geográfico;
- zoom padrão;
- bounds;
- polígono.

A lista de regiões resolve o filtro comercial, mas não necessariamente o enquadramento do mapa. Esta é uma decisão pendente descrita mais adiante.

### 3.3 Dados para consultar

O visitante **não precisa informar nome, telefone, e-mail ou CPF** para verificar a disponibilidade.

A consulta poderá ser salva pela API com dados técnicos mínimos, por exemplo:

- região;
- latitude;
- longitude;
- precisão estimada;
- método usado para obter a localização;
- data e hora;
- identificador idempotente da requisição.

### 3.4 Resultado

O resultado aparecerá na tela em um modal ou bottom sheet acessível.

Depois do resultado, o CTA principal levará ao WhatsApp para que um atendente humano entenda a situação subjetiva da propriedade e conduza a contratação.

### 3.5 Mapa

O Google Maps faz parte do produto porque propriedades rurais frequentemente não têm endereço formal confiável. O visitante deverá conseguir:

- usar a localização atual do celular;
- buscar fazenda, comunidade, estrada, referência ou endereço;
- tocar/clicar em um ponto do mapa;
- arrastar o marcador;
- colar coordenadas manualmente;
- recorrer ao WhatsApp quando as alternativas web não forem suficientes.

O mapa é obrigatório como recurso, mas **não será carregado na abertura inicial da landing**.

## 4. O que é estático e o que é dinâmico

### 4.1 Conteúdo estático

A maior parte da landing será gerada como HTML estático:

- header;
- hero;
- textos comerciais;
- tecnologias oferecidas;
- planos e benefícios;
- atendimento local;
- processo de contratação;
- áreas/regiões atendidas como conteúdo institucional;
- soluções para empresas e fazendas;
- depoimentos;
- perguntas frequentes;
- CTA final;
- rodapé;
- política de privacidade;
- página 404.

### 4.2 Interatividade dinâmica

Somente os pontos abaixo exigem JavaScript:

- menu mobile;
- abertura/fechamento de FAQ quando não for resolvido apenas com `<details>`;
- carregamento da lista de regiões;
- geolocalização;
- entrada e validação de coordenadas;
- carregamento sob demanda do Google Maps e Places;
- clique/toque no mapa e arraste do marcador;
- chamada da API de viabilidade;
- estados de carregamento, sucesso, indisponibilidade e erro;
- abertura do modal/bottom sheet;
- montagem do link contextual do WhatsApp.

Não haverá roteamento client-side nem estado global de aplicação.

## 5. Stack recomendada

### 5.1 Frontend

- **Astro em modo estático/SSG**.
- **TypeScript estrito**.
- **CSS nativo** com custom properties, CSS Grid, Flexbox e estilos encapsulados dos componentes Astro.
- **HTML semântico**.
- Scripts client-side em **TypeScript vanilla**.
- `fetch` nativo para HTTP.
- `<dialog>` nativo ou bottom sheet construído com HTML/CSS/TypeScript.
- SVGs locais para ícones.
- Componentes de imagem do Astro para gerar formatos e dimensões responsivas.

### 5.2 Integrações

- Google Maps JavaScript API carregado sob demanda.
- Places carregado somente quando o visitante iniciar busca por local.
- Advanced Marker carregado somente quando o mapa for aberto.
- API própria da Rural Conecta para regiões e viabilidade.
- WhatsApp por link normal `https://wa.me/...`, sem widget de chat de terceiros.

### 5.3 Backend mínimo

Preferência arquitetural:

- site Astro totalmente estático;
- um **Cloudflare Worker mínimo** apenas para fazer a ponte com a API própria, quando necessário.

Rotas previstas:

```text
GET  /api/regions
POST /api/viability
```

O Worker será usado quando houver pelo menos uma destas necessidades:

- esconder token ou credencial da API própria;
- evitar expor a API interna diretamente ao navegador;
- normalizar respostas;
- controlar CORS;
- aplicar rate limit;
- aplicar timeout;
- armazenar regiões em cache no edge;
- proteger detalhes internos;
- tratar idempotência e observabilidade.

A chamada direta do navegador para a API própria só é aceitável se a API for pública, não usar segredo, tiver CORS, rate limiting, validação e contrato público estável.

### 5.4 Dependências permitidas

Produção, quando realmente necessárias:

```text
astro
zod (preferencialmente apenas no Worker/server)
```

Desenvolvimento:

```text
typescript
@astrojs/check
@types/google.maps
vitest
@vitest/coverage-v8
@playwright/test
prettier
prettier-plugin-astro
wrangler, se houver Worker
```

### 5.5 Dependências proibidas por padrão

Não adicionar sem ADR e aprovação explícita:

```text
react
react-dom
@astrojs/react
vue
svelte
preact
tailwindcss
axios
redux
zustand
formik
react-hook-form
framer-motion
gsap
swiper
bibliotecas de modal
bibliotecas de carrossel
bibliotecas completas de ícones
bibliotecas de componentes
```

## 6. Por que usar Astro

Astro será usado como ferramenta de build e organização, não como backend robusto ou SPA.

Ele é útil porque:

- componentes `.astro` viram HTML no build;
- não envia runtime de framework por padrão;
- facilita dividir a landing em seções reutilizáveis;
- permite otimização de imagens;
- oferece roteamento de arquivos para páginas institucionais;
- mantém o HTML limpo e fácil de revisar;
- reduz a chance de o projeto virar um arquivo HTML monolítico;
- facilita trabalho incremental por agentes e pull requests.

As dependências do Astro afetam ambiente de desenvolvimento, CI e build. Elas não precisam ser transferidas ao visitante.

## 7. Arquitetura de alto nível

```text
Visitante no celular
        |
        +--> HTML/CSS/imagens estáticas no CDN
        |
        +--> GET /api/regions
        |        |
        |        +--> Worker opcional --> API própria
        |
        +--> Geolocation API do navegador
        |
        +--> Google Maps/Places somente após ação
        |
        +--> POST /api/viability
                 |
                 +--> Worker opcional --> API própria
                                           |
                                           +--> salva a consulta
                                           +--> responde atende/não atende

Resultado na tela --> CTA contextual --> WhatsApp humano
```

A falha em qualquer integração externa não pode impedir o visitante de ler a landing ou abrir o WhatsApp.

## 8. Fluxo principal no celular

### 8.1 Fluxo de conversão

```text
1. Visitante abre a landing.
2. Entende a proposta da Rural Conecta.
3. Toca em “Verificar disponibilidade”.
4. Seleciona uma região da API.
5. Escolhe como informar o local.
6. Confirma latitude/longitude.
7. Envia a consulta.
8. Recebe “há disponibilidade” ou “não identificamos disponibilidade”.
9. Abre o WhatsApp com contexto da consulta.
10. Atendimento humano conduz análise e contratação.
```

### 8.2 Métodos de localização

Ordem recomendada na interface:

1. **Usar minha localização**.
2. **Buscar fazenda ou local**.
3. **Escolher no mapa**.
4. **Informar coordenadas**.
5. **Enviar localização pelo WhatsApp**.

### 8.3 Geolocalização em duas etapas

Primeiro, obter uma posição rápida:

```ts
navigator.geolocation.getCurrentPosition(success, error, {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 60000,
});
```

Em seguida, tentar melhorar a precisão por tempo limitado:

```ts
const watchId = navigator.geolocation.watchPosition(success, error, {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
});

window.setTimeout(() => {
  navigator.geolocation.clearWatch(watchId);
}, 15000);
```

Sempre guardar a leitura com menor `accuracy` e interromper o monitoramento quando houver precisão suficiente ou quando o tempo limite terminar.

Não usar geolocalização por IP como fonte de viabilidade. Em zona rural ela pode apontar apenas a cidade, operadora ou região aproximada.

### 8.4 Fallbacks

Se a permissão for negada ou o GPS falhar:

- busca textual;
- toque/click no mapa;
- marcador arrastável;
- entrada manual de coordenadas;
- WhatsApp instruindo o cliente a compartilhar a localização pelo aplicativo.

Se o mapa estiver lento:

```text
O mapa está demorando para carregar.

[ Tentar novamente ]
[ Usar minha localização ]
[ Informar coordenadas ]
[ Enviar localização pelo WhatsApp ]
```

## 9. Comportamento do mapa

### 9.1 Carregamento

Não inserir o script do Google Maps no `<head>`.

Carregar somente após o visitante:

- tocar em “Escolher no mapa”;
- tocar em “Ajustar localização”;
- iniciar uma busca por fazenda/local.

Carregar apenas as bibliotecas necessárias:

```ts
await google.maps.importLibrary("maps");
await google.maps.importLibrary("marker");
await google.maps.importLibrary("places");
```

### 9.2 Interface do mapa

No celular, preferir mapa em tela cheia ou quase cheia, com:

- campo de busca no topo;
- botão de localização atual;
- marcador central/arrastável;
- indicador simples de precisão;
- botão fixo “Confirmar este ponto” na parte inferior;
- botão para voltar sem perder a seleção anterior;
- safe areas respeitadas.

No desktop, o mapa pode ficar ao lado do formulário.

### 9.3 O que não mostrar

Não mostrar:

- torres;
- CTOs;
- rotas de fibra;
- linhas de rádio;
- distância até equipamentos;
- sinal estimado fictício;
- tecnologia provável;
- cobertura desenhada sem contrato técnico real;
- informações de capacidade da rede.

O mapa serve para escolher um ponto. A API decide se atende.

## 10. Regiões e geometria

A API já possui a lista de regiões. Um item mínimo pode ser:

```json
{
  "id": "nolasco",
  "name": "Nolasco"
}
```

Para posicionar o mapa de forma eficiente, o ideal é incluir uma destas estruturas:

### Centro e zoom

```json
{
  "id": "nolasco",
  "name": "Nolasco",
  "center": { "lat": -17.123, "lng": -46.123 },
  "defaultZoom": 12
}
```

### Bounds

```json
{
  "id": "nolasco",
  "name": "Nolasco",
  "bounds": {
    "north": -17.01,
    "south": -17.31,
    "east": -45.98,
    "west": -46.32
  }
}
```

Recomendação para o MVP:

- não exigir polígonos inicialmente;
- usar `center + zoom` ou `bounds`;
- se a API ainda não tiver esses dados, manter temporariamente um arquivo local indexado pelo mesmo `regionId`;
- deixar a validação final para a API.

Sem bounds, a busca pode apenas ser enviesada para a região, e não rigidamente restringida.

## 11. Contrato sugerido da API

Os contratos abaixo são propostas e devem ser ajustados aos endpoints reais.

### 11.1 Regiões

```http
GET /api/regions
```

Resposta normalizada:

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

A resposta pode ser armazenada em cache no edge. Se a API de origem falhar, uma versão anterior ainda válida pode ser usada.

### 11.2 Viabilidade

```http
POST /api/viability
Content-Type: application/json
```

Payload mínimo:

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

Valores de `source`:

```ts
type LocationSource =
  | "device"
  | "place-search"
  | "map-click"
  | "marker-drag"
  | "manual-coordinates";
```

Resposta quando atende:

```json
{
  "consultationId": "RC-8F3K2",
  "available": true
}
```

Resposta quando não atende:

```json
{
  "consultationId": "RC-8F3K2",
  "available": false
}
```

Erro normalizado:

```json
{
  "available": null,
  "code": "TEMPORARILY_UNAVAILABLE",
  "message": "Não foi possível concluir a consulta agora."
}
```

### 11.3 Idempotência

Redes lentas podem causar reenvio quando a API salvou a consulta, mas a resposta não voltou ao celular. `requestId` deve ser tratado como chave idempotente para evitar registros duplicados.

Não implementar repetição automática cega de `POST`.

### 11.4 Dados salvos

A API poderá salvar os dados técnicos mínimos necessários. Não coletar dados adicionais “por garantia”.

Não registrar em logs comuns:

- coordenada completa;
- endereço textual completo;
- identificadores que permitam localizar diretamente uma propriedade.

## 12. Resultado e WhatsApp

### 12.1 Modal de disponibilidade

Quando `available: true`:

```text
Há disponibilidade para o local informado

Nossa equipe vai confirmar a melhor tecnologia e as condições
de instalação para sua propriedade.

[ Continuar pelo WhatsApp ]
[ Ajustar localização ]
```

Quando `available: false`:

```text
Não identificamos disponibilidade automática neste ponto

Fale com nossa equipe para verificar alternativas, expansão de
rede ou uma análise personalizada.

[ Solicitar análise pelo WhatsApp ]
[ Escolher outro ponto ]
```

Quando houver erro:

```text
Não foi possível verificar agora

Envie sua localização pelo WhatsApp para nossa equipe analisar.

[ Continuar pelo WhatsApp ]
[ Tentar novamente ]
```

### 12.2 Mensagem contextual

Quando houver `consultationId`:

```text
Olá! Fiz uma consulta de viabilidade no site da Rural Conecta.

Consulta: RC-8F3K2
Região: Nolasco
Localização: https://www.google.com/maps?q=-17.123456,-46.123456
Resultado: disponibilidade identificada

Gostaria de falar com um atendente.
```

Quando a consulta falhar:

```text
Olá! Quero verificar a viabilidade da Rural Conecta.

Região: Nolasco
Localização: https://www.google.com/maps?q=-17.123456,-46.123456

Não consegui concluir a consulta no site e gostaria de falar com a equipe.
```

Não instalar widget de WhatsApp. Usar link HTML normal.

## 13. Requisitos de desempenho

### 13.1 Meta de rede

O site deve ser testado em:

- 1 Mbps, latência de 300 ms;
- 512 Kbps, latência de 500 ms;
- rede instável e perda eventual de conexão.

### 13.2 Orçamento inicial para celular

| Recurso crítico | Meta comprimida |
|---|---:|
| HTML | até 25 KB |
| CSS | até 20 KB |
| JavaScript próprio inicial | até 8 KB |
| Logo + ícones críticos | até 10 KB |
| Imagem mobile do hero | ideal até 100 KB; máximo 140 KB |
| Total crítico inicial | ideal até 160 KB; máximo 190 KB |
| Requisições iniciais | até 8 |
| Scripts de terceiros iniciais | 0 |
| Google Maps inicial | 0 KB |

A landing completa, sem Google Maps e carregada progressivamente, deve buscar ficar abaixo de aproximadamente 700 KB transferidos.

### 13.3 Regras de performance

- mobile recebe um recorte próprio do hero;
- nunca enviar imagem desktop grande para celular;
- usar AVIF e WebP com fallback adequado;
- imagens abaixo da dobra com `loading="lazy"` e `decoding="async"`;
- logo e ícones em SVG local;
- nenhuma fonte externa bloqueante;
- preferir system font ou uma única fonte WOFF2 local com poucos pesos;
- sem vídeo automático;
- sem partículas em canvas;
- sem parallax;
- sem animações contínuas;
- sem scripts de chat;
- sem Google Analytics bloqueando a renderização;
- respeitar `prefers-reduced-motion`;
- efeitos de brilho e blur usados com moderação;
- `backdrop-filter` apenas em áreas pequenas e não essenciais;
- conteúdos principais visíveis antes de scripts externos.

### 13.4 Degradação graciosa

| Falha | Comportamento esperado |
|---|---|
| JavaScript desabilitado | Conteúdo institucional e links do WhatsApp continuam disponíveis |
| Maps indisponível | GPS, coordenadas e WhatsApp continuam disponíveis |
| GPS negado | Busca, mapa manual, coordenadas e WhatsApp |
| GPS impreciso | Marcador ajustável e indicação de precisão |
| API de regiões indisponível | Cache anterior, retry e WhatsApp |
| API de viabilidade indisponível | Modal de erro e WhatsApp |
| Imagem falha | Fundo sólido e texto continuam legíveis |
| Conexão cai no envio | Não perder a seleção; oferecer retry controlado e WhatsApp |

## 14. Requisitos mobile-first

### 14.1 Viewports prioritários

Testar primeiro entre 360 e 430 CSS px de largura.

Viewports mínimos de validação:

```text
360 x 800
375 x 812
390 x 844
412 x 915
430 x 932
```

Depois validar tablet e desktop.

### 14.2 Interface touch

- botões principais com aproximadamente 48 px de altura ou mais;
- fontes de campos com pelo menos 16 px para evitar zoom automático;
- nenhum recurso importante dependente de hover;
- controles com distância confortável;
- safe areas no topo e na base;
- teclado virtual não pode ocultar CTA crítico;
- foco visível;
- mapa com controles acessíveis por toque;
- resultado em bottom sheet ou `<dialog>` adequado a telas pequenas.

### 14.3 Organização mobile

- fluxo vertical contínuo;
- não transformar a landing em onboarding de 10 telas;
- não usar contadores `1/10`, barras de progresso ou setas de apresentação;
- uma coluna para conteúdo importante;
- duas colunas apenas para itens muito simples;
- CSS Scroll Snap permitido para listas secundárias, não para a página inteira;
- CTA de viabilidade deve aparecer cedo;
- menu compacto;
- WhatsApp sempre acessível, sem encobrir conteúdo.

## 15. Direção visual

### 15.1 Personalidade

- rural premium;
- tecnológica;
- humana;
- regional;
- confiável;
- moderna sem parecer uma empresa genérica de software.

### 15.2 Elementos a manter

- fundo predominantemente escuro;
- verde vivo usado como destaque;
- fotografias rurais com luz quente;
- técnicos e moradores em contexto real;
- tipografia grande;
- cards com bordas verdes discretas;
- gradientes e linhas de conexão em SVG/CSS;
- seções claras estratégicas para ritmo visual;
- ícones lineares consistentes;
- microinterações curtas.

### 15.3 Elementos a evitar

- múltiplas versões diferentes do logotipo;
- neon em todos os elementos;
- textos dentro das imagens;
- telas inteiras rasterizadas;
- mapa com infraestrutura fictícia;
- excesso de glassmorphism;
- alternância clara/escura a cada pequena seção;
- cards demais na mesma tela;
- layout de desktop comprimido no celular;
- depoimentos, preços, velocidades ou benefícios fictícios publicados como reais.

### 15.4 Marca

Ainda é necessário confirmar:

- logotipo oficial;
- símbolo reduzido oficial;
- versões clara/escura;
- verde principal;
- tipografia oficial;
- estilo oficial de ícones.

Até a marca ser fechada, agentes devem usar apenas uma versão provisória consistente e identificá-la como placeholder.

## 16. Estrutura recomendada da landing

Ordem mobile prioritária:

1. Header compacto.
2. Hero simplificado.
3. Consulta de viabilidade.
4. Como funciona em três passos.
5. Tecnologias: fibra, rádio e dedicado.
6. Planos.
7. Atendimento local.
8. Benefícios de streaming e TV.
9. Regiões atendidas.
10. Soluções para empresas e fazendas.
11. Depoimentos reais.
12. FAQ.
13. CTA final.
14. Rodapé.

### 16.1 Conteúdo fora da landing de aquisição

Conteúdos como:

- cuidados com equipamentos em época de chuva;
- avisos de pagamento;
- bloqueio por inadimplência;
- cobrança por dano;

são mais adequados para Área do Cliente, central de ajuda ou campanhas específicas. Não ocupar a parte central da landing comercial.

## 17. Estrutura sugerida do repositório

```text
rural-conecta-site/
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API-CONTRACT.md
│   ├── DESIGN-SYSTEM.md
│   ├── LOCATION-STRATEGY.md
│   ├── PERFORMANCE-BUDGET.md
│   ├── ROADMAP.md
│   └── adr/
├── public/
│   ├── favicon.svg
│   ├── manifest.webmanifest
│   └── og/
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   │   ├── layout/
│   │   ├── sections/
│   │   ├── ui/
│   │   └── viability/
│   ├── data/
│   ├── layouts/
│   ├── lib/
│   │   ├── contracts/
│   │   ├── server/
│   │   └── shared/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── politica-de-privacidade.astro
│   │   └── 404.astro
│   ├── scripts/
│   │   └── viability/
│   └── styles/
│       ├── tokens.css
│       ├── reset.css
│       └── global.css
├── worker/
│   ├── index.ts
│   ├── routes/
│   │   ├── regions.ts
│   │   └── viability.ts
│   └── lib/
├── tests/
│   ├── unit/
│   └── e2e/
├── AGENTS.md
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── wrangler.jsonc
```

A pasta `worker/` só deve existir se o gateway for necessário.

## 18. Variáveis de ambiente sugeridas

```dotenv
PUBLIC_SITE_URL=
PUBLIC_GOOGLE_MAPS_API_KEY=
PUBLIC_GOOGLE_MAP_ID=
PUBLIC_WHATSAPP_NUMBER=

VIABILITY_API_BASE_URL=
VIABILITY_API_TOKEN=
```

Regras:

- somente variáveis `PUBLIC_` podem chegar ao navegador;
- nenhum token da API própria pode ter prefixo `PUBLIC_`;
- `.env` e `.dev.vars` nunca devem ser commitados;
- manter `.env.example` sem valores reais;
- restringir a chave do Google Maps por domínio e APIs permitidas.

## 19. Testes obrigatórios

### 19.1 Unitários

- parser de coordenadas;
- validação de latitude/longitude;
- normalização de regiões;
- mapeamento de respostas da API;
- montagem segura da mensagem do WhatsApp;
- seleção da melhor leitura de GPS;
- idempotency/request ID;
- estados do fluxo de viabilidade.

### 19.2 E2E

- landing abre e CTA funciona sem Maps;
- menu mobile;
- região carregada;
- GPS autorizado;
- GPS negado;
- entrada manual de coordenadas;
- mapa aberto sob demanda;
- seleção e arraste de marcador;
- resposta disponível;
- resposta indisponível;
- timeout da API;
- Maps bloqueado;
- CTA do WhatsApp contém contexto correto;
- navegação por teclado;
- modal fecha e devolve foco corretamente.

### 19.3 Performance

Testar com perfis personalizados de rede e aparelhos reais sempre que possível:

- 1 Mbps / 300 ms;
- 512 Kbps / 500 ms;
- CPU limitada;
- cache frio;
- cache quente;
- imagem bloqueada;
- Maps bloqueado.

## 20. Roadmap inicial

### Fase 0 — Contratos e decisões

- obter documentação real da API;
- registrar endpoints e autenticação;
- obter exemplos reais de regiões e viabilidade;
- decidir gateway direto ou Worker;
- decidir centro/bounds das regiões;
- confirmar logotipo e tokens visuais;
- confirmar textos e ofertas reais.

### Fase 1 — Fundação

- criar repositório GitHub privado;
- inicializar Astro estático;
- configurar TypeScript estrito;
- criar CSS nativo e tokens;
- configurar format/check/test/build;
- configurar CI;
- criar preview deploy;
- adicionar `AGENTS.md` e documentação.

### Fase 2 — Landing estática mobile-first

- header;
- hero;
- seções institucionais;
- planos;
- atendimento;
- regiões;
- depoimentos;
- FAQ;
- rodapé;
- responsividade;
- imagens otimizadas.

### Fase 3 — Viabilidade sem Maps

- regiões com mock/fixture;
- geolocalização;
- coordenadas manuais;
- estados de interface;
- modal de resultado;
- WhatsApp contextual;
- testes de falha.

### Fase 4 — Google Maps sob demanda

- loader dinâmico;
- busca por local;
- mapa mobile em tela cheia;
- clique/toque;
- marcador arrastável;
- bounds/centro da região;
- fallback quando Maps falha.

### Fase 5 — API real

- endpoints reais;
- gateway Worker, se necessário;
- idempotência;
- cache de regiões;
- timeout;
- rate limiting;
- logs sem dados sensíveis;
- staging.

### Fase 6 — Qualidade e produção

- acessibilidade;
- SEO;
- política de privacidade;
- performance em redes lentas;
- domínio e DNS;
- monitoramento;
- analytics não bloqueante, se aprovado;
- runbook e rollback.

## 21. Regras para agentes de desenvolvimento

Antes de alterar código:

1. Leia este documento e todos os arquivos em `docs/`.
2. Identifique quais decisões são confirmadas e quais ainda estão pendentes.
3. Não invente contrato de API definitivo.
4. Não adicione dependência sem justificar o custo e obter aprovação.
5. Não converta o projeto em SPA.
6. Não carregue Google Maps na primeira renderização.
7. Não implemente duas árvores completas de DOM para mobile e desktop.
8. Não use texto dentro de imagens.
9. Não crie dados comerciais fictícios como conteúdo final.
10. Não exponha segredos no cliente.

Durante a implementação:

- faça mudanças pequenas e revisáveis;
- mantenha mobile como viewport principal;
- preserve progressive enhancement;
- escreva testes para lógica crítica;
- atualize documentação quando o contrato mudar;
- registre decisões arquiteturais significativas em ADR;
- informe impacto de performance de qualquer nova dependência ou asset.

Antes de concluir uma tarefa:

```text
pnpm format:check
pnpm check
pnpm test
pnpm build
```

Quando houver E2E relevante:

```text
pnpm test:e2e
```

O relatório final deve informar:

- arquivos alterados;
- testes executados;
- orçamento de performance afetado;
- limitações;
- decisões pendentes;
- screenshots mobile e desktop, quando houver UI.

## 22. Definition of Done

Uma entrega só é concluída quando:

- funciona primeiro em 360–430 px;
- não depende de hover;
- possui estados de loading, sucesso, vazio e erro quando aplicável;
- funciona por teclado;
- mantém foco corretamente em modal;
- não adiciona Maps ou terceiros à carga inicial;
- não ultrapassa orçamento de performance sem aprovação;
- passa em format, check, testes e build;
- possui documentação atualizada;
- usa conteúdo real ou claramente marcado como placeholder;
- foi testada em conexão limitada;
- mantém WhatsApp acessível mesmo quando integrações falham.

## 23. Decisões ainda pendentes

Não assumir respostas sem validação do responsável pelo produto:

1. Contrato real da API de regiões.
2. Contrato real da API de viabilidade.
3. Autenticação e CORS da API própria.
4. Uso direto da API ou Cloudflare Worker.
5. Campos efetivamente salvos em cada consulta.
6. Retenção e política de privacidade dos dados de localização.
7. Existência de `consultationId`.
8. Centro, zoom, bounds ou polígonos das regiões.
9. Logotipo e manual de marca oficiais.
10. Cores e tipografia definitivas.
11. Planos, velocidades, benefícios e parceiros que podem ser publicados.
12. Depoimentos e fotografias reais autorizados.
13. Número oficial do WhatsApp.
14. Domínio e infraestrutura final de deploy.
15. Analytics e eventos de conversão.

## 24. Resumo executivo para agentes

Construa uma landing page **estática, moderna, mobile-first e extremamente leve** para uma provedora de internet rural. O conteúdo deve abrir rapidamente em conexões inferiores a 1 Mbps. A única parte de aplicação é a consulta de viabilidade: escolher uma região, obter ou marcar uma coordenada, consultar uma API que responde atende/não atende, exibir o resultado e encaminhar ao WhatsApp humano. Google Maps é obrigatório como ferramenta, mas sempre carregado sob demanda. Astro é ferramenta de build; TypeScript e CSS são nativos; não use framework client-side.
