# Landing API - Guia de integração

## 1. Escopo

Este documento orienta a integração do site externo `https://ruralconectamg.com.br` com a API pública de pré-viabilidade do Atlas.

O Atlas não cria, hospeda nem versiona a landing page. O site externo apenas consome a API pública já publicada.

## 2. Base URL configurável

A landing usa produção por padrão:

```text
https://atlassoftware.ia.br
```

Para desenvolvimento local, é possível configurar a variável pública opcional:

```dotenv
PUBLIC_ATLAS_API_BASE_URL=http://localhost:3001
```

ou, quando o Atlas estiver via compose:

```dotenv
PUBLIC_ATLAS_API_BASE_URL=http://localhost:3101
```

Essa variável não é segredo e não deve conter token. Se não for definida, os endpoints continuam apontando para produção.

## 3. Endpoints

### Pré-viabilidade

```http
POST https://atlassoftware.ia.br/api/public/viabilidade-basica
Content-Type: application/json
```

### Regiões/localidades

```http
GET https://atlassoftware.ia.br/api/public/regioes
Accept: application/json
```

Este endpoint lista nomes públicos que a landing pode usar como possível localidade/região do cliente. A lista agrega:

- Fibra: `regiao_olt` das CTOs.
- Rádio: nome das torres.

Nomes iguais entre Fibra e Rádio não são duplicados. Quando o mesmo nome existir nas duas bases, o item retorna as duas fontes.

## 4. Payload por coordenadas

```json
{
  "latitude": -16.448694,
  "longitude": -46.906306
}
```

Nesta versão, a consulta por endereço digitado não faz geocoding server-side. Envie coordenadas válidas.

## 5. Resposta positiva

```json
{
  "viavel": true,
  "status": "pre_viavel",
  "mensagem": "Encontramos indício de viabilidade para este endereço."
}
```

## 6. Resposta negativa

```json
{
  "viavel": false,
  "status": "sem_viabilidade_automatica",
  "mensagem": "Não identificamos viabilidade automática para este ponto. Nossa equipe pode avaliar manualmente."
}
```

## 7. Erros esperados

- `400 entrada_invalida`: coordenadas ausentes, inválidas ou endereço sem suporte nesta versão.
- `429`: limite de consultas excedido.
- `503 erro_temporario`: falha temporária ao consultar a pré-viabilidade.
- `503 erro_temporario` em `GET /api/public/regioes`: falha temporária ao listar regiões.
- Erro de CORS no navegador: a origem do site não está permitida.

Mesmo em erro, a API não retorna torres completas, CTOs completas, IDs, coordenadas, perfil de elevação, obstruções, portas, distâncias técnicas, stack trace, lead ou histórico.

## 8. CORS

Produção permite:

```text
https://ruralconectamg.com.br
```

Desenvolvimento local com a landing permite:

```text
http://localhost:4321
http://127.0.0.1:4321
```

Não usar wildcard (`*`). Para desenvolvimento local, preferir `PUBLIC_ATLAS_API_BASE_URL` apontando para o Atlas local ou mocks nos testes E2E.

## 9. Exemplo de fetch ultraleve

Exemplo em JavaScript puro, sem framework, sem Google Maps JS, sem token e sem salvar lead.

```js
const API_URL = "https://atlassoftware.ia.br/api/public/viabilidade-basica";

const botao = document.querySelector("#consultar-viabilidade");
const resultado = document.querySelector("#resultado-viabilidade");

function mostrarMensagem(texto) {
  resultado.textContent = texto;
}

async function consultarPreViabilidade(latitude, longitude) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ latitude, longitude }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        "Muitas consultas em sequência. Tente novamente em alguns minutos.",
      );
    }
    throw new Error(
      data?.mensagem || "Não foi possível consultar a pré-análise agora.",
    );
  }

  return data;
}

botao.addEventListener("click", () => {
  if (!navigator.geolocation) {
    mostrarMensagem(
      "Seu navegador não informou a localização. Nossa equipe pode avaliar manualmente.",
    );
    return;
  }

  botao.disabled = true;
  mostrarMensagem("Consultando pré-análise...");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const data = await consultarPreViabilidade(latitude, longitude);
        mostrarMensagem(data.mensagem);
      } catch (error) {
        mostrarMensagem(
          error.message || "Não foi possível consultar a pré-análise agora.",
        );
      } finally {
        botao.disabled = false;
      }
    },
    () => {
      mostrarMensagem(
        "Não foi possível acessar sua localização. Nossa equipe pode avaliar manualmente.",
      );
      botao.disabled = false;
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    },
  );
});
```

## 10. Exemplo de fetch para regiões

```js
const REGIOES_URL = "https://atlassoftware.ia.br/api/public/regioes";

async function carregarRegioes() {
  const response = await fetch(REGIOES_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data?.mensagem || "Não foi possível carregar as regiões agora.",
    );
  }

  return data.regioes;
}
```

Resposta esperada:

```json
{
  "total": 3,
  "regioes": [
    {
      "nome": "15 DE NOVEMBRO",
      "fontes": ["fibra"]
    },
    {
      "nome": "ROMILDA",
      "fontes": ["fibra", "radio"]
    },
    {
      "nome": "TORRE CENTRO",
      "fontes": ["radio"]
    }
  ]
}
```

Use `nome` como texto exibido na landing. `fontes` indica se a localidade veio de Fibra, Rádio ou ambas. A API não retorna coordenadas, IDs, torres completas, CTOs completas, portas ou distância técnica.

## 11. Guia simples para Postman ou Insomnia

### Pré-viabilidade

1. Crie uma requisição `POST`.
2. URL: `https://atlassoftware.ia.br/api/public/viabilidade-basica`.
3. Header: `Content-Type: application/json`.
4. Body JSON:

```json
{
  "latitude": -16.448694,
  "longitude": -46.906306
}
```

5. Envie e confira:
   - HTTP `200` para consulta processada.
   - `viavel` booleano.
   - `status` em `pre_viavel`, `sem_viabilidade_automatica` ou `necessita_confirmacao`.
   - `mensagem` pronta para UX.
   - Ausência de torres, CTOs, coordenadas internas, perfil, obstruções e distâncias técnicas.

### Regiões/localidades

1. Crie uma requisição `GET`.
2. URL: `https://atlassoftware.ia.br/api/public/regioes`.
3. Header: `Accept: application/json`.
4. Envie e confira:
   - HTTP `200`.
   - `total` numérico.
   - `regioes` como array.
   - Cada item com somente `nome` e `fontes`.
   - Nenhum `nome` duplicado.
   - `fontes` contendo apenas `fibra`, `radio` ou ambas.

Observação: Postman e Insomnia não aplicam CORS como o navegador. Para validar CORS de verdade, teste também a chamada pela landing no domínio permitido.

## 12. Textos recomendados para UX

- Use "pré-análise".
- Use "indício de viabilidade".
- Não prometa garantia final de atendimento.
- Para resultado positivo, trate como sinal inicial para contato ou confirmação manual.
- Para resultado negativo, ofereça avaliação manual pela equipe.
- Ao mostrar região/localidade, use linguagem aproximada como "possível região/localidade".

## 13. Não-objetivos

- Não criar landing page.
- Não criar arquivos HTML/CSS do site externo.
- Não alterar a API interna autenticada.
- Não alterar CORS de produção.
- Não alterar banco.
- Não rodar migrations.
- Não fazer deploy.
- Não fazer push.
- Não commitar.
