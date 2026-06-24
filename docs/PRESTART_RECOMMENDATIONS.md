# Rural Conecta — Recomendações antes de iniciar o projeto

> Documento de preparação do repositório, governança, contexto para agentes, skills, GitHub, segurança, qualidade e decisões pendentes.
>
> Este arquivo complementa:
>
> - `01_PROJECT_CONTEXT_RURAL_CONECTA.md`
> - `02_DESIGN_IMAGE_AGENT_BRIEF_RURAL_CONECTA.md`

## 1. Recomendação executiva

Antes de escrever a primeira seção da landing page, preparar uma base pequena, previsível e compartilhada entre humanos, Codex e Hermes.

A configuração recomendada é:

- um repositório privado no GitHub;
- um único `AGENTS.md` na raiz como contexto canônico para Codex e Hermes;
- documentação detalhada em `docs/`, sem transformar `AGENTS.md` em um documento gigante;
- skills do projeto em `.agents/skills/`;
- Astro estático, TypeScript estrito e CSS nativo;
- Google Maps carregado somente após interação;
- nenhuma dependência de framework de UI;
- CI obrigatória antes de merge;
- nenhuma credencial em arquivo versionado;
- Superpowers opcional como metodologia global do Codex, não como dependência do projeto;
- skills próprias da Rural Conecta mantidas no repositório e revisadas por pull request.

### Decisão central sobre arquivos de contexto

Usar:

```text
AGENTS.md
```

Não criar inicialmente:

```text
HERMES.md
.hermes.md
CLAUDE.md
AGENTS.override.md
```

O motivo é evitar fontes de verdade concorrentes. O mesmo `AGENTS.md` deve orientar Codex e Hermes. Instruções específicas de operação do Hermes ficam em `docs/AI_WORKFLOW.md` ou em um documento de bootstrap, não em `HERMES.md`.

O nome correto para o arquivo reconhecido pelo Codex é **`AGENTS.md`**, no plural e em letras maiúsculas.

---

## 2. O que precisa ser decidido ou verificado

Nem tudo precisa estar resolvido para criar o repositório. Entretanto, cada item precisa estar registrado como confirmado, pendente ou bloqueador.

### 2.1 Antes de criar o repositório remoto

| Item         | Pergunta                                                     | Status necessário             |
| ------------ | ------------------------------------------------------------ | ----------------------------- |
| Proprietário | Repositório ficará em conta pessoal ou organização?          | Obrigatório                   |
| Nome         | Usar `rural-conecta-site`?                                   | Obrigatório                   |
| Visibilidade | Privado inicialmente?                                        | Recomendado                   |
| Responsáveis | Quem poderá aprovar PRs e acessar secrets?                   | Obrigatório                   |
| Domínio      | Qual domínio e subdomínios serão usados?                     | Pode ficar pendente           |
| Deploy       | Cloudflare Workers/Pages continuará sendo a preferência?     | Pode ficar pendente           |
| Licença      | Projeto será proprietário/privado ou terá licença explícita? | Obrigatório antes de publicar |

### 2.2 Antes da integração da API

Obter exemplos reais e documentar:

- URL de homologação;
- endpoint de regiões;
- endpoint de viabilidade;
- método HTTP;
- autenticação;
- CORS;
- rate limit;
- timeout esperado;
- formato de erro;
- identificador estável de cada região;
- quantidade máxima de regiões;
- payload exato da consulta;
- resposta exata de `atende` e `não atende`;
- existência de `consultationId`;
- política de idempotência;
- quais dados são salvos;
- por quanto tempo são salvos;
- se a API valida que a coordenada pertence à região;
- comportamento quando a API está fora do ar.

Contrato público sugerido:

```json
{
  "requestId": "01JXYZ...",
  "regionId": "nolasco",
  "latitude": -17.123456,
  "longitude": -46.123456,
  "accuracyMeters": 28,
  "locationSource": "device"
}
```

Resposta sugerida:

```json
{
  "consultationId": "RC-8F3K2",
  "available": true
}
```

### 2.3 Antes da integração do Google Maps

Confirmar:

- conta Google Cloud responsável;
- projeto separado para a Rural Conecta;
- faturamento habilitado;
- APIs realmente necessárias;
- chave de desenvolvimento;
- chave de produção;
- restrições por domínio;
- restrições por API;
- quotas e alertas de custo;
- Map ID para o tema visual;
- política para staging e previews;
- responsável por rotação e incidentes.

A chave usada no navegador não deve ser tratada como segredo ocultável. Ela deve ser protegida por restrições de domínio e de APIs.

### 2.4 Metadados geográficos das regiões

A existência de regiões na API não informa necessariamente ao mapa onde enquadrar cada região.

Para o MVP, cada região deveria ter ao menos:

```ts
{
  id: "nolasco",
  name: "Nolasco",
  center: { lat: -17.123, lng: -46.123 },
  defaultZoom: 12
}
```

`bounds` é preferível quando disponível:

```ts
{
  north: -17.01,
  south: -17.31,
  east: -45.98,
  west: -46.32
}
```

Polígonos só serão necessários se houver uma necessidade real de:

- desenhar limites precisos;
- impedir seleção fora da área;
- validar geometricamente o ponto no frontend.

A API continuará sendo a fonte de verdade para `atende/não atende`.

### 2.5 Privacidade e retenção

Embora não sejam solicitados nome ou telefone, latitude, longitude, precisão, horário e identificador da consulta podem se relacionar a uma pessoa ou propriedade.

Definir antes de produção:

- finalidade do armazenamento;
- base legal aplicável;
- aviso apresentado ao usuário;
- prazo de retenção;
- pessoas com acesso;
- política de exclusão;
- mascaramento em logs;
- proibição de enviar coordenadas para analytics;
- tratamento de backups;
- procedimento de incidente.

Esse ponto deve receber revisão jurídica apropriada antes do lançamento.

### 2.6 Conteúdo e marca

Validar:

- logotipo oficial;
- símbolo reduzido;
- versões clara e escura;
- cores oficiais;
- família tipográfica;
- fotografias autorizadas;
- depoimentos reais e autorizações;
- velocidades e condições comerciais reais;
- regiões atendidas reais;
- serviços de streaming que podem ser divulgados;
- telefone oficial do WhatsApp;
- endereço e redes sociais;
- texto da política de privacidade;
- URL da Área do Cliente.

Não publicar dados ilustrativos dos mockups como se fossem comerciais ou técnicos.

---

## 3. Estrutura inicial recomendada

```text
rural-conecta-site/
├── .agents/
│   └── skills/
│       ├── rural-architecture-change/
│       │   └── SKILL.md
│       ├── rural-mobile-performance/
│       │   └── SKILL.md
│       ├── rural-viability-map/
│       │   └── SKILL.md
│       ├── rural-ui-quality/
│       │   └── SKILL.md
│       ├── rural-security-env/
│       │   └── SKILL.md
│       └── rural-pre-commit/
│           └── SKILL.md
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug.yml
│   │   ├── feature.yml
│   │   └── decision.yml
│   ├── workflows/
│   │   └── ci.yml
│   ├── CODEOWNERS
│   └── pull_request_template.md
├── docs/
│   ├── README.md
│   ├── PROJECT_CONTEXT.md
│   ├── DESIGN_BRIEF.md
│   ├── ARCHITECTURE.md
│   ├── API_CONTRACT.md
│   ├── DESIGN_SYSTEM.md
│   ├── LOCATION_STRATEGY.md
│   ├── PERFORMANCE_BUDGET.md
│   ├── ACCESSIBILITY.md
│   ├── PRIVACY_DATA.md
│   ├── TEST_STRATEGY.md
│   ├── ROADMAP.md
│   ├── DECISIONS_PENDING.md
│   ├── AI_WORKFLOW.md
│   ├── AI_SKILLS_CATALOG.md
│   └── adr/
│       ├── README.md
│       └── 0001-static-first-astro.md
├── public/
├── src/
├── tests/
├── .editorconfig
├── .env.example
├── .gitattributes
├── .gitignore
├── .node-version
├── AGENTS.md
├── CONTRIBUTING.md
├── README.md
├── SECURITY.md
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

Essa estrutura é a meta; diretórios vazios não precisam ser criados artificialmente. Criar cada pasta quando houver pelo menos um arquivo real.

---

## 4. Estratégia de documentação

### 4.1 `AGENTS.md`

O `AGENTS.md` deve ser curto e operacional. Meta: entre 3 KB e 10 KB.

Ele deve conter:

- missão do produto;
- decisões arquiteturais não negociáveis;
- caminhos dos documentos;
- comandos oficiais;
- limites de escopo;
- regras de segurança;
- critérios para concluir tarefas.

Ele não deve conter:

- todo o roadmap;
- contrato completo da API;
- todos os tokens de design;
- histórias longas do projeto;
- grandes exemplos de código;
- instruções específicas de uma única tarefa.

### 4.2 Documentos fonte de verdade

| Documento               | Responsabilidade                                      |
| ----------------------- | ----------------------------------------------------- |
| `PROJECT_CONTEXT.md`    | Produto, usuários, decisões e não objetivos           |
| `DESIGN_BRIEF.md`       | Direção visual mobile e desktop                       |
| `ARCHITECTURE.md`       | Componentes, dependências, fluxos e decisões técnicas |
| `API_CONTRACT.md`       | Requests, responses, erros, timeout e idempotência    |
| `LOCATION_STRATEGY.md`  | GPS, busca, mapa, coordenadas e fallbacks             |
| `PERFORMANCE_BUDGET.md` | Orçamentos e perfis de rede                           |
| `ACCESSIBILITY.md`      | WCAG, teclado, toque, dialog e redução de movimento   |
| `PRIVACY_DATA.md`       | Dados coletados, retenção, logs e analytics           |
| `TEST_STRATEGY.md`      | Unitários, integração, E2E e testes de rede           |
| `DECISIONS_PENDING.md`  | Perguntas ainda não fechadas                          |
| `ROADMAP.md`            | Marcos, não tarefas detalhadas                        |
| `AI_WORKFLOW.md`        | Como Hermes e Codex trabalham no repositório          |
| `AI_SKILLS_CATALOG.md`  | Skills, origem, versão, responsável e atualização     |
| `adr/`                  | Decisões arquiteturais que precisam de histórico      |

### 4.3 Regra de sincronização

Quando uma mudança alterar comportamento:

1. alterar código;
2. alterar testes;
3. atualizar somente os documentos afetados;
4. registrar ADR se houver decisão estrutural;
5. manter `AGENTS.md` inalterado, salvo quando a regra permanente do projeto mudou.

---

## 5. Revisão das skills enviadas

Os arquivos anexados mostram uma boa disciplina de agentes, mas não devem ser copiados integralmente.

### 5.1 Pontos fortes a preservar

- confirmação de branch, status e escopo;
- leitura de contexto antes de editar;
- mudanças pequenas;
- proteção de secrets;
- validação antes de encerrar;
- separação entre planejamento, implementação e revisão;
- auditoria de worktrees;
- atualização da documentação;
- formato de retorno previsível;
- registro explícito de riscos e pendências.

### 5.2 Problemas a evitar

- nomes e caminhos específicos do projeto Atlas;
- regras antigas que não se aplicam à Rural Conecta;
- skills excessivamente longas;
- numeração duplicada;
- referências a contratos inexistentes;
- muitas skills com responsabilidades sobrepostas;
- contradição entre “nunca faça commit” e skills que fazem commit/merge;
- gatilhos amplos demais;
- processos de múltiplos worktrees antes de existir necessidade real;
- automatização de merge e push sem autorização explícita.

### 5.3 Mapa de migração

| Skill de referência         | Decisão para Rural Conecta                                    |
| --------------------------- | ------------------------------------------------------------- |
| `backend-api-segura`        | Adaptar para `rural-security-env` e regras de API             |
| `documentacao-tecnica`      | Incorporar em `rural-architecture-change` e pre-commit        |
| `frontend-design-system`    | Adaptar para `rural-ui-quality`                               |
| `implementacao-segura`      | Fundir com `rural-pre-commit`                                 |
| `revisao-pre-commit`        | Manter como base de `rural-pre-commit`                        |
| `seguranca-env`             | Adaptar para Maps, coordenadas e Worker                       |
| `testes-smoke`              | Criar somente depois que os fluxos existirem                  |
| `atlas-feature-grill`       | Preservar a ideia de questionar escopo; não copiar o conteúdo |
| `atlas-codex-dispatch`      | Adiar até haver uso real de delegação paralela                |
| `atlas-codex-output-ingest` | Adiar até haver handoffs recorrentes                          |
| `atlas-context-maintainer`  | Simplificar para regra de docs/ADR                            |
| `atlas-skill-curator`       | Usar como inspiração para governança de skills                |
| `atlas-worktree-audit`      | Adicionar mais tarde, quando worktrees forem rotina           |

### 5.4 Skills iniciais do projeto

#### `rural-architecture-change`

Usar apenas quando uma tarefa alterar:

- stack;
- contrato da API;
- fluxo de dados;
- armazenamento;
- deploy;
- mapa;
- orçamento de performance;
- privacidade.

Deve produzir escopo, opções, riscos e decisão antes de implementar.

#### `rural-mobile-performance`

Usar em qualquer alteração que possa afetar:

- carga inicial;
- imagens;
- fontes;
- JavaScript;
- Google Maps;
- layout mobile;
- rede abaixo de 1 Mbps.

Deve verificar orçamento, carregamento progressivo e perfis de rede.

#### `rural-viability-map`

Usar para o fluxo:

- região;
- GPS;
- busca;
- mapa;
- marcador;
- coordenadas;
- consulta;
- resultado;
- WhatsApp.

Deve impedir campos pessoais desnecessários e classificação pública de tecnologia.

#### `rural-ui-quality`

Usar em design, CSS, componentes e interação.

Deve exigir:

- mobile primeiro;
- toque;
- teclado;
- HTML real;
- visual premium;
- contraste;
- responsividade;
- sem efeitos pesados.

#### `rural-security-env`

Usar para:

- `.env`;
- Google Maps;
- CORS;
- Worker;
- API;
- logs;
- coordenadas;
- secrets;
- headers;
- rate limit;
- idempotência.

#### `rural-pre-commit`

Usar no encerramento de mudanças.

Deve verificar:

- `git status`;
- diff;
- arquivos inesperados;
- secrets;
- formato;
- tipos;
- testes;
- build;
- orçamento de performance quando aplicável;
- documentação afetada.

Nenhuma skill deve fazer push, merge, deploy ou alterar produção por padrão.

---

## 6. Como compartilhar skills entre Codex e Hermes

### 6.1 Pasta canônica do projeto

Usar:

```text
.agents/skills/
```

Não usar `.skills/` como pasta principal neste projeto.

O Codex descobre essa pasta no repositório. Para Hermes, configurar a mesma pasta como diretório externo.

### 6.2 Configuração recomendada do Hermes

Preferir um perfil dedicado ao projeto.

No perfil do Hermes, preservar a configuração existente e adicionar:

```yaml
skills:
  external_dirs:
    - /caminho/absoluto/rural-conecta-site/.agents/skills
  write_approval: true
```

Cuidados:

- não sobrescrever o arquivo inteiro;
- não gravar caminho absoluto no repositório;
- exigir aprovação para alterações de skills;
- revisar diffs de skills como código;
- manter skills do projeto versionadas por pull request;
- não permitir que autoaprendizado altere silenciosamente as skills do projeto.

### 6.3 Configuração recomendada do Codex

Não é necessária configuração extra para as skills versionadas em `.agents/skills/`.

Verificações:

```bash
codex --ask-for-approval never "Summarize the current instructions."
```

Dentro do Codex:

```text
/skills
```

Confirmar:

- root `AGENTS.md` carregado;
- skills da Rural Conecta visíveis;
- nenhuma skill duplicada com o mesmo nome;
- nenhuma regra global contradiz o projeto.

---

## 7. Superpowers: usar ou não usar?

## Recomendação

**Usar opcionalmente no Codex como plugin global de metodologia. Não copiar o repositório inteiro para dentro da Rural Conecta.**

Para Hermes, não instalar o pacote completo de forma automática. Avaliar e instalar skills individuais somente quando trouxerem valor claro.

### 7.1 Onde Superpowers ajuda

O projeto oferece workflows genéricos para:

- brainstorming;
- escrita de planos;
- TDD;
- debugging sistemático;
- verificação antes de concluir;
- code review;
- worktrees;
- desenvolvimento com subagentes.

Isso pode reduzir improvisação em tarefas complexas.

### 7.2 Onde pode atrapalhar

O conjunto completo é bastante prescritivo:

- obriga ativação de skills com frequência;
- coloca gates formais antes de implementação;
- pode exigir TDD em tarefas onde o principal é revisão visual;
- pode duplicar o `/plan` e outras capacidades do Hermes;
- pode conflitar com regras locais de commit;
- pode gerar documentação e commits em caminhos próprios;
- pode tornar mudanças pequenas mais lentas.

Para este projeto, a velocidade não deve vir de pular validação, mas também não devemos transformar cada ajuste de CSS em um processo burocrático.

### 7.3 Estratégia recomendada

#### Codex

- instalar o plugin pela interface oficial de plugins;
- testar em uma branch descartável;
- mantê-lo como ferramenta do ambiente do desenvolvedor;
- não assumir no `AGENTS.md` que todo colaborador possui o plugin;
- desativá-lo quando uma tarefa simples estiver sofrendo conflito de processo;
- continuar mantendo as regras permanentes da Rural Conecta no repositório.

#### Hermes

Não instalar inicialmente:

```text
using-superpowers
```

Essa skill tenta governar toda conversa e pode conflitar com o mecanismo nativo do Hermes.

Candidatas para avaliação individual:

```text
systematic-debugging
verification-before-completion
requesting-code-review
using-git-worktrees
```

Avaliar depois, e apenas quando necessário:

```text
brainstorming
writing-plans
test-driven-development
```

O Hermes já possui planejamento e sistema próprio de skills. Evitar duas metodologias obrigatórias para a mesma função.

### 7.4 Processo seguro para skill de terceiros

1. inspecionar antes de instalar;
2. verificar licença e origem;
3. ler `SKILL.md`, scripts e referências;
4. procurar comandos destrutivos, exfiltração e escrita em config;
5. registrar origem e commit em `AI_SKILLS_CATALOG.md`;
6. testar em ambiente descartável;
7. instalar uma skill por vez;
8. não atualizar automaticamente sem revisão;
9. remover ou desativar skills duplicadas;
10. nunca tornar o projeto dependente de uma skill global para compilar ou testar.

### 7.5 Decisão final

| Uso                                                | Recomendação                          |
| -------------------------------------------------- | ------------------------------------- |
| Superpowers completo no Codex                      | Opcional, útil para tarefas complexas |
| Superpowers dentro do repositório                  | Não                                   |
| Superpowers completo no Hermes                     | Não inicialmente                      |
| Skills individuais do Superpowers no Hermes        | Sim, após inspeção                    |
| Skills específicas da Rural Conecta                | Sempre versionadas no projeto         |
| Substituir todas as skills manuais por Superpowers | Não                                   |

Superpowers reduz o trabalho de criar workflows genéricos. Ele não conhece os requisitos de mapa, viabilidade, mobile, privacidade e performance da Rural Conecta. Essas skills continuam sendo específicas.

---

## 8. Configuração do GitHub

### 8.1 Repositório

- nome sugerido: `rural-conecta-site`;
- visibilidade: privada;
- branch padrão: `main`;
- merge padrão: squash;
- excluir branch após merge;
- bloquear force push;
- bloquear exclusão de `main`.

### 8.2 Ruleset

Criar o ruleset depois que o primeiro workflow de CI existir.

Para equipe:

- pull request obrigatório;
- uma aprovação;
- conversas resolvidas;
- checks obrigatórios;
- branch atualizada antes do merge.

Para uma única pessoa:

- pull request obrigatório;
- checks obrigatórios;
- zero aprovação obrigatória inicialmente, porque o autor não consegue aprovar o próprio PR;
- ativar uma aprovação quando existir segundo revisor.

### 8.3 Segurança

Ativar quando disponível:

- secret scanning;
- push protection;
- Dependabot alerts;
- revisão de dependências em PR;
- permissões mínimas do GitHub Actions;
- ambientes separados para preview e produção;
- aprovação manual para produção;
- secrets somente em GitHub/Cloudflare, nunca no repositório.

### 8.4 GitHub Actions

Workflow inicial:

- checkout;
- Node fixado;
- Corepack/pnpm fixado;
- `pnpm install --frozen-lockfile`;
- `pnpm format:check`;
- `pnpm check`;
- `pnpm test`;
- `pnpm build`;
- verificação de orçamento do `dist`.

Configurar:

```yaml
permissions:
  contents: read
```

Adicionar E2E e Lighthouse somente quando houver uma interface funcional.

### 8.5 Templates

O PR template deve perguntar:

- qual problema foi resolvido;
- quais arquivos foram alterados;
- houve impacto mobile;
- houve impacto em rede lenta;
- o Maps continua sob demanda;
- houve mudança de API ou dados;
- foram adicionadas dependências;
- houve screenshot mobile e desktop;
- quais testes passaram;
- quais docs foram atualizadas;
- quais riscos permanecem.

---

## 9. Toolchain local

### Recomendação

- Node.js 24 LTS;
- pnpm 11;
- Corepack atualizado;
- versão exata registrada no `packageManager`;
- `.node-version` com a major/minor adotada;
- Astro estável atual, fixado pelo lockfile;
- TypeScript em modo estrito.

Comandos de preflight:

```bash
git --version
gh --version
gh auth status
node --version
npm --version
corepack --version
pnpm --version
hermes --version
hermes doctor
codex --version
```

Instalação do pnpm de forma reproduzível:

```bash
npm install --global corepack@latest
corepack enable pnpm
corepack use pnpm@latest-11
```

Não atualizar dependências durante uma tarefa funcional sem issue ou autorização explícita.

---

## 10. Arquivos básicos de segurança

### `.env.example`

Somente nomes e comentários, nunca valores reais:

```dotenv
PUBLIC_SITE_URL=
PUBLIC_GOOGLE_MAPS_API_KEY=
PUBLIC_GOOGLE_MAP_ID=
PUBLIC_WHATSAPP_NUMBER=

VIABILITY_API_BASE_URL=
VIABILITY_API_TOKEN=
```

Se a chamada for direta e não houver token privado, remover variáveis server-side desnecessárias.

### `.gitignore`

Cobrir ao menos:

```gitignore
node_modules/
dist/
.astro/
.env
.env.*
!.env.example
.dev.vars
.wrangler/
playwright-report/
test-results/
coverage/
.DS_Store
Thumbs.db
```

### Regras de logging

Nunca registrar em logs comuns:

- token;
- chave privada;
- telefone;
- endereço pesquisado integral;
- coordenada com precisão desnecessária;
- payload completo da API;
- resposta interna da infraestrutura.

---

## 11. Qualidade obrigatória

### Performance

Testar pelo menos:

- 360 × 800;
- 390 × 844;
- 430 × 932;
- 768 px;
- desktop.

Perfis:

- 1 Mbps / 300 ms;
- 512 Kbps / 500 ms;
- offline depois da primeira carga;
- Google Maps bloqueado;
- API lenta;
- API indisponível.

Orçamento inicial:

| Recurso                       |                            Meta |
| ----------------------------- | ------------------------------: |
| HTML gzip                     |                       até 25 KB |
| CSS gzip                      |                       até 20 KB |
| JavaScript próprio inicial    |                        até 8 KB |
| Hero mobile                   | ideal até 100 KB, máximo 140 KB |
| Total crítico inicial         |     ideal 160 KB, máximo 190 KB |
| Requisições iniciais          |                           até 8 |
| Scripts de terceiros iniciais |                               0 |
| Google Maps inicial           |                            0 KB |

### Acessibilidade

Meta: WCAG 2.2 AA.

Verificar:

- foco visível;
- ordem de teclado;
- `<dialog>` acessível;
- fechamento com Escape;
- restauração de foco;
- labels;
- mensagens de erro;
- contraste;
- touch targets confortáveis;
- `prefers-reduced-motion`;
- conteúdo não dependente de hover;
- mapa com alternativa textual.

### Testes

Começar com:

- unitários para coordenadas, payloads, resultado e WhatsApp;
- integração para endpoints internos;
- E2E para geolocalização simulada, mapa manual e modal;
- teste de timeout;
- teste de requisição idempotente;
- teste de fallback para WhatsApp;
- teste sem Maps.

---

## 12. Sequência recomendada

### Etapa 0 — Auditoria

- verificar ferramentas;
- verificar credenciais sem exibi-las;
- confirmar owner/nome/visibilidade;
- ler os dois documentos de contexto;
- gerar relatório de bloqueios;
- não criar remoto ainda.

### Etapa 1 — Fundação local

- criar pasta;
- inicializar Git;
- criar `AGENTS.md`;
- criar documentação;
- criar skills;
- criar templates do GitHub;
- criar arquivos de segurança;
- revisar diff.

### Etapa 2 — Scaffold técnico

- criar Astro minimal;
- TypeScript strict;
- CSS nativo;
- nenhum framework client-side;
- nenhum Maps ainda;
- scripts de qualidade;
- primeiro build.

### Etapa 3 — GitHub

- criar repositório privado;
- fazer primeiro commit;
- push;
- ativar CI;
- somente depois ativar ruleset.

### Etapa 4 — Design system e landing estática

- mobile primeiro;
- imagens separadas;
- sem API e sem Maps inicialmente;
- validar orçamento.

### Etapa 5 — Viabilidade com mock

- regiões mockadas;
- GPS;
- coordenadas;
- resultado;
- WhatsApp;
- sem Google Maps primeiro dentro da implementação do fluxo.

### Etapa 6 — Maps sob demanda

- busca;
- toque;
- arraste;
- enquadramento de região;
- timeout e fallback.

### Etapa 7 — API real e produção

- contrato;
- Worker se necessário;
- privacidade;
- logs;
- idempotência;
- CI/E2E;
- domínio;
- produção.

---

## 13. Definition of Ready

A implementação visual pode começar quando:

- [ ] repositório e responsáveis estão definidos;
- [ ] `AGENTS.md` existe e foi validado no Codex e Hermes;
- [ ] docs de contexto e design estão versionadas;
- [ ] decisões pendentes estão registradas;
- [ ] skills iniciais foram revisadas;
- [ ] Node/pnpm estão fixados;
- [ ] CI básica passa;
- [ ] `.env.example` e `.gitignore` estão corretos;
- [ ] nenhum secret foi versionado;
- [ ] primeira página mínima compila;
- [ ] GitHub ruleset não bloqueia o próprio fluxo.

A integração real pode começar quando:

- [ ] exemplos da API foram recebidos;
- [ ] autenticação/CORS foram definidos;
- [ ] estratégia Worker/direta foi decidida;
- [ ] regiões possuem centro/zoom ou bounds;
- [ ] Google Cloud foi configurado;
- [ ] retenção de coordenadas foi definida;
- [ ] WhatsApp e mensagem foram aprovados.

---

## 14. Recomendação final

Não copiar o ecossistema do projeto anterior de forma integral.

Usar como princípios:

- disciplina de escopo;
- segurança;
- revisão;
- documentação;
- verificação.

Criar uma base menor para a Rural Conecta:

```text
1 AGENTS.md
14 documentos curtos
6 skills específicas
1 workflow de CI
0 dependências desnecessárias
0 automação de push/deploy sem aprovação
```

Essa base dá contexto suficiente aos agentes sem transformar o repositório em um sistema de governança maior que o próprio site.
