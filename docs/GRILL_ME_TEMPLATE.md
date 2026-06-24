# Template de Grill-me para etapa visual/técnica

Use este template antes de gerar qualquer prompt de implementação para Codex UI.

## 1. Identificação

- Etapa do roadmap:
- Nome da seção/fluxo:
- Tipo: visual | técnico | híbrido
- Prioridade: alta | média | baixa
- Deve usar imagens de referência? sim | não

## 2. Objetivo

- Qual problema esta etapa resolve?
- O que precisa ficar visível para o usuário no mobile?
- Qual ação principal a seção deve incentivar?

## 3. Escopo

### Em escopo

- Arquivos ou áreas:
- Componentes prováveis:
- Estados necessários:
- Conteúdo provisório permitido:

### Fora de escopo

- O que não pode ser implementado nesta etapa:
- Integrações proibidas nesta etapa:
- Dependências proibidas:

## 4. Referência visual

- Quais imagens serão anexadas ao Codex UI?
- O que deve ser aproveitado da referência?
  - layout
  - atmosfera
  - cores
  - hierarquia
  - espaçamento
  - cards
  - fotografia
  - microinterações sugeridas
- O que NÃO deve ser copiado?
- Algum elemento da referência é apenas inspiração e não deve virar asset?

## 5. Mobile-first

- Viewports prioritários: 360, 375, 390, 412, 430 px.
- O CTA principal aparece sem rolagem excessiva?
- Há risco de densidade excessiva?
- O teclado virtual afeta algum campo?
- Algum item depende de hover?

## 6. Rede lenta e performance

- Há novas imagens? Quais limites de peso?
- Há novo JavaScript? Por quê?
- Há script de terceiro? Deve ser proibido por padrão.
- O Google Maps continua 0 KB inicial?
- O conteúdo continua útil sem JS?

## 7. Produto e segurança

- A consulta pede nome, telefone, e-mail ou CPF? Deve ser não.
- O resultado mostra apenas atende/não atende?
- Há exposição de torres, CTOs, rotas, tecnologia provável ou capacidade? Deve ser não.
- O WhatsApp continua como saída humana?
- Há risco de dado sensível em log, URL ou analytics?

## 8. Acessibilidade

- Títulos e landmarks necessários:
- Foco visível:
- Contraste:
- Área de toque:
- `prefers-reduced-motion`:
- Dialog/bottom sheet, se houver:

## 9. Validações esperadas

- `corepack pnpm format:check`
- `corepack pnpm check`
- `corepack pnpm test`
- `corepack pnpm build`
- Screenshot mobile:
- Screenshot desktop:
- Auditoria de dist sem JS/Maps inicial, quando aplicável:

## 10. Perguntas para o usuário

1.
2.
3.
4.
5.

## 11. Decisão final antes do prompt

- Aprovado para prompt Codex UI? sim | não
- Ajustes solicitados:
- Riscos aceitos:
