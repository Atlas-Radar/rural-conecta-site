# Rural Conecta — Prompt operacional para o Hermes preparar o projeto

> Entregue este arquivo ao Hermes junto com:
>
> - `01_PROJECT_CONTEXT_RURAL_CONECTA.md`
> - `02_DESIGN_IMAGE_AGENT_BRIEF_RURAL_CONECTA.md`
> - `03_PRESTART_RECOMMENDATIONS_RURAL_CONECTA.md`
>
> O objetivo deste documento é preparar a fundação local, os contextos de agente, as skills, a documentação, o scaffold técnico e, quando autorizado, o repositório GitHub.

---

# 1. Papel do agente

Você é o agente responsável por preparar a fundação do projeto **Rural Conecta**.

Não implemente a landing completa, Google Maps, integração real da API, deploy ou conteúdo comercial definitivo nesta execução.

Sua responsabilidade é:

1. auditar o ambiente;
2. identificar bloqueios;
3. criar uma fundação local reproduzível;
4. criar contexto compartilhado para Codex e Hermes;
5. criar skills específicas e pequenas;
6. inicializar o projeto Astro minimalista;
7. configurar qualidade e CI;
8. criar o repositório remoto somente se houver autorização explícita;
9. deixar um relatório verificável.

---

# 2. Variáveis que devem ser confirmadas

Antes de alterar arquivos, determine estes valores. Pergunte uma única vez pelos que estiverem faltando.

```text
PROJECT_NAME=rural-conecta-site
PROJECT_TITLE=Rural Conecta
TARGET_DIR=<caminho absoluto>
GITHUB_OWNER=<conta ou organização>
GITHUB_REPO=rural-conecta-site
GITHUB_VISIBILITY=private

ALLOW_LOCAL_WRITES=true
ALLOW_DEPENDENCY_INSTALL=<true|false>
ALLOW_COMMIT=<true|false>
ALLOW_REMOTE_WRITES=<true|false>
ALLOW_GITHUB_SETTINGS=<true|false>

INSTALL_SUPERPOWERS_CODEX=ask
INSTALL_SUPERPOWERS_HERMES=false
```

Regras:

- `ALLOW_LOCAL_WRITES=true` permite criar arquivos no diretório confirmado.
- `ALLOW_DEPENDENCY_INSTALL=true` permite instalar somente dependências aprovadas neste documento.
- `ALLOW_COMMIT=true` permite criar o commit inicial.
- `ALLOW_REMOTE_WRITES=true` permite criar repositório e fazer push.
- `ALLOW_GITHUB_SETTINGS=true` permite alterar settings/rulesets.
- nenhum valor ausente deve ser presumido para uma ação remota;
- defaults de ações remotas são sempre `false`.

---

# 3. Fontes de verdade

Leia integralmente, nesta ordem:

1. este arquivo;
2. `01_PROJECT_CONTEXT_RURAL_CONECTA.md`;
3. `02_DESIGN_IMAGE_AGENT_BRIEF_RURAL_CONECTA.md`;
4. `03_PRESTART_RECOMMENDATIONS_RURAL_CONECTA.md`;
5. arquivos existentes no diretório alvo, se houver;
6. `AGENTS.md` existente, se houver;
7. `git status`, histórico e configuração existente, se o diretório já for um repositório.

Se documentos se contradisserem:

1. não escolha silenciosamente;
2. registre a contradição;
3. proponha a opção mais segura;
4. peça decisão antes de implementar a parte afetada.

---

# 4. Regras obrigatórias

## 4.1 Segurança

- Nunca imprimir secrets, tokens, cookies ou conteúdo de `.env`.
- Nunca adicionar valores reais ao `.env.example`.
- Nunca fazer deploy.
- Nunca alterar Google Cloud, Cloudflare ou produção.
- Nunca executar migration.
- Nunca usar `npm audit fix`, atualização ampla ou `--force`.
- Nunca instalar dependência não prevista sem aprovação.
- Nunca modificar configuração global do Hermes ou Codex sem mostrar o patch e obter aprovação.
- Nunca criar, remover ou sobrescrever repositório remoto sem autorização.
- Nunca fazer force push.
- Nunca tornar o repositório público por padrão.

## 4.2 Arquivos existentes

Se `TARGET_DIR` não estiver vazio:

- interrompa antes de scaffold;
- liste somente nomes e status relevantes;
- não sobrescreva arquivos;
- proponha estratégia de merge;
- continue apenas após aprovação.

## 4.3 Stack

A stack obrigatória é:

```text
Astro static-first
TypeScript strict
CSS nativo
TypeScript vanilla no navegador
HTML semântico
pnpm
Vitest
Playwright somente quando houver fluxo E2E real
```

Não adicionar:

```text
React
React DOM
Preact
Vue
Svelte
Tailwind
Axios
biblioteca de componentes
biblioteca de estado
biblioteca de animação
Google Maps loader de terceiros
backend tradicional
banco de dados
autenticação
```

## 4.4 Produto

Preservar:

- mobile-first;
- low-bandwidth-first;
- funcionamento em redes abaixo de 1 Mbps;
- Google Maps sob demanda;
- API retorna somente `atende/não atende`;
- lista de regiões vem da API;
- nenhum nome ou telefone no formulário de viabilidade;
- resultado em modal ou bottom sheet;
- contratação final no WhatsApp;
- atendimento humano;
- nenhum detalhe de torres, CTOs, rotas ou tecnologia provável no mapa público.

---

# 5. Fase A — Auditoria somente leitura

Execute e registre sem expor credenciais:

```bash
pwd
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

Também verificar:

- sistema operacional;
- espaço disponível;
- se `TARGET_DIR` existe;
- se já existe `.git`;
- se existe remote;
- branch atual;
- `git status -sb`;
- versão LTS atual suportada do Node;
- compatibilidade atual entre Astro, Node e pnpm;
- autenticação do GitHub sem mostrar token;
- disponibilidade dos três documentos de entrada.

Produza um relatório:

```text
PREFLIGHT
- Ambiente:
- Ferramentas:
- GitHub:
- Diretório:
- Documentos encontrados:
- Bloqueadores:
- Avisos:
- Ações remotas ainda bloqueadas:
```

Se houver bloqueador crítico, pare nesta fase.

---

# 6. Fase B — Plano antes da escrita

Antes de criar arquivos, apresente:

- árvore alvo;
- arquivos que serão criados;
- arquivos que seriam alterados;
- dependências que seriam instaladas;
- comandos previstos;
- ações Git;
- ações GitHub;
- decisões ainda pendentes.

Aguarde aprovação se:

- o diretório não estiver vazio;
- houver arquivo existente com mesmo nome;
- for necessário alterar configuração global;
- houver ação remota;
- houver dependência adicional;
- a versão estável atual exigir mudança de stack.

---

# 7. Fase C — Fundação local

## 7.1 Inicializar Git

Somente em diretório novo ou aprovado:

```bash
git init -b main
```

Criar:

```text
.editorconfig
.gitattributes
.gitignore
.node-version
.env.example
README.md
CONTRIBUTING.md
SECURITY.md
AGENTS.md
```

Não criar licença aberta se o proprietário não tiver decidido. Para repositório privado/proprietário, registrar isso no README sem inventar licença.

## 7.2 Contexto canônico

Criar apenas um contexto automático na raiz:

```text
AGENTS.md
```

Não criar:

```text
HERMES.md
.hermes.md
CLAUDE.md
AGENTS.override.md
```

O `AGENTS.md` deve permanecer abaixo de 12.000 caracteres.

Conteúdo obrigatório:

```md
# Rural Conecta

## Missão

Landing page mobile-first para provedora de internet rural, com consulta simples
de disponibilidade e atendimento final por WhatsApp.

## Leia antes de editar

- docs/PROJECT_CONTEXT.md
- docs/ARCHITECTURE.md
- docs/DESIGN_BRIEF.md
- docs/PERFORMANCE_BUDGET.md
- docs/DECISIONS_PENDING.md
- documentos específicos da área alterada

## Arquitetura

- Astro estático.
- TypeScript strict.
- CSS nativo.
- TypeScript vanilla para interatividade.
- Sem framework client-side.
- Google Maps somente sob demanda.
- Worker apenas se necessário para secrets, CORS, cache ou proteção da API.

## Regras não negociáveis

- Mobile e rede lenta têm prioridade sobre desktop.
- Não carregar Maps na abertura.
- Não adicionar dependência sem justificar e pedir autorização.
- Não coletar nome/telefone na viabilidade.
- Não expor infraestrutura interna.
- Não registrar secrets ou coordenadas precisas em logs comuns.
- Não alterar contratos sem atualizar docs e testes.
- Não fazer push, merge ou deploy sem autorização explícita.

## Fluxo de trabalho

1. Verificar branch, status e contexto.
2. Definir escopo e arquivos.
3. Fazer mudança pequena.
4. Atualizar testes e docs afetados.
5. Rodar validações.
6. Revisar diff.
7. Informar riscos e próximos passos.

## Comandos oficiais

- pnpm dev
- pnpm format:check
- pnpm check
- pnpm test
- pnpm build
- pnpm test:e2e, quando existir

## Conclusão de tarefa

Informar resumo, arquivos, validações, impacto mobile/performance, riscos,
documentos alterados e git status final.
```

Ajustar somente para refletir os scripts reais gerados.

---

# 8. Fase D — Documentação

Criar:

```text
docs/README.md
docs/PROJECT_CONTEXT.md
docs/DESIGN_BRIEF.md
docs/ARCHITECTURE.md
docs/API_CONTRACT.md
docs/DESIGN_SYSTEM.md
docs/LOCATION_STRATEGY.md
docs/PERFORMANCE_BUDGET.md
docs/ACCESSIBILITY.md
docs/PRIVACY_DATA.md
docs/TEST_STRATEGY.md
docs/ROADMAP.md
docs/DECISIONS_PENDING.md
docs/AI_WORKFLOW.md
docs/AI_SKILLS_CATALOG.md
docs/adr/README.md
docs/adr/0001-static-first-astro.md
```

## 8.1 Reutilização dos documentos fornecidos

- Copiar e adaptar `01_PROJECT_CONTEXT_RURAL_CONECTA.md` para `docs/PROJECT_CONTEXT.md`.
- Copiar e adaptar `02_DESIGN_IMAGE_AGENT_BRIEF_RURAL_CONECTA.md` para `docs/DESIGN_BRIEF.md`.
- Não perder decisões já confirmadas.
- Não adicionar fatos comerciais não validados.

## 8.2 Conteúdo mínimo

### `docs/README.md`

Índice com:

- documento;
- finalidade;
- quando atualizar;
- responsável atual, se conhecido.

### `docs/ARCHITECTURE.md`

Registrar:

- contexto;
- diagrama textual;
- página estática;
- scripts vanilla;
- Maps sob demanda;
- API direta versus Worker como decisão condicional;
- fluxo região → localização → consulta → modal → WhatsApp;
- dependências permitidas;
- não objetivos.

### `docs/API_CONTRACT.md`

Começar com status `DRAFT`.

Incluir:

- endpoint de regiões;
- endpoint de viabilidade;
- exemplos marcados como propostos;
- erros;
- timeout;
- idempotência;
- perguntas que exigem resposta da API real.

Não declarar contrato proposto como contrato existente.

### `docs/DESIGN_SYSTEM.md`

Registrar:

- tokens provisórios;
- breakpoints guiados por conteúdo;
- tipografia;
- espaçamento;
- botões;
- cards;
- `<dialog>`;
- estados;
- tema escuro;
- regras de imagens;
- proibição de texto dentro de imagens.

### `docs/LOCATION_STRATEGY.md`

Registrar:

- região;
- GPS rápido;
- refinamento de precisão;
- busca;
- clique/toque;
- marcador arrastável;
- coordenadas manuais;
- fallback WhatsApp;
- timeouts;
- estados de permissão;
- necessidade de `center`/`bounds`.

### `docs/PERFORMANCE_BUDGET.md`

Registrar os orçamentos já aprovados e os perfis:

```text
1 Mbps / 300 ms
512 Kbps / 500 ms
Maps bloqueado
API lenta
API indisponível
```

### `docs/ACCESSIBILITY.md`

Meta WCAG 2.2 AA e checklist para:

- teclado;
- toque;
- foco;
- dialog;
- erros;
- mapa;
- redução de movimento;
- contraste.

### `docs/PRIVACY_DATA.md`

Começar como `DRAFT — requer revisão jurídica`.

Registrar:

- dados técnicos salvos;
- finalidade;
- dados proibidos em analytics/logs;
- retenção pendente;
- incidentes;
- acesso.

### `docs/TEST_STRATEGY.md`

Separar:

- unitários;
- integração;
- E2E;
- performance;
- acessibilidade;
- device/network matrix.

### `docs/ROADMAP.md`

Usar marcos, não uma lista enorme de microtarefas.

### `docs/DECISIONS_PENDING.md`

Cada item deve ter:

```text
ID
Pergunta
Opções
Recomendação
Responsável
Status
Bloqueia qual etapa
Data de revisão
```

### `docs/AI_WORKFLOW.md`

Registrar:

- `AGENTS.md` como contexto canônico;
- `.agents/skills/` como skills do projeto;
- política de ações remotas;
- uso de Codex;
- uso de Hermes;
- política de Superpowers;
- atualização de skills;
- revisão por PR.

### `docs/AI_SKILLS_CATALOG.md`

Tabela:

```text
Skill
Escopo
Origem
Versão/commit
Responsável
Pode escrever arquivos?
Pode fazer Git?
Política de atualização
Última revisão
```

### ADR 0001

Decisão:

```text
Astro static-first + TypeScript vanilla + CSS nativo
```

Registrar contexto, opções, decisão e consequências.

---

# 9. Fase E — Skills do projeto

Criar em:

```text
.agents/skills/
```

Cada skill:

- deve ter `SKILL.md`;
- deve ter `name` e `description`;
- deve realizar somente uma função;
- deve usar instruções imperativas;
- deve declarar quando usar e quando não usar;
- deve declarar entradas, procedimento, limites e verificação;
- não deve assumir que Superpowers está instalado;
- não deve fazer push, merge, deploy ou ações remotas por padrão;
- não deve conter referências ao projeto Atlas.

Criar exatamente estas seis skills:

## 9.1 `rural-architecture-change`

Descrição sugerida:

```yaml
description: Use when a Rural Conecta task changes architecture, API contracts, data flow, deployment, privacy, Google Maps strategy, or performance budgets. Do not use for routine copy or isolated CSS edits.
```

Procedimento:

1. ler documentos relevantes;
2. confirmar estado do Git;
3. listar decisão e alternativas;
4. identificar impacto em mobile, API, dados e performance;
5. pedir aprovação da decisão;
6. implementar somente após aprovação;
7. atualizar docs/ADR e testes;
8. verificar.

## 9.2 `rural-mobile-performance`

Descrição sugerida:

```yaml
description: Use for changes that can affect Rural Conecta mobile rendering, initial transfer size, images, fonts, JavaScript, Google Maps loading, Core Web Vitals, or behavior below 1 Mbps.
```

Deve verificar:

- 360–430 px;
- budgets;
- responsive images;
- Maps 0 KB inicial;
- scripts de terceiros;
- fontes;
- layout shift;
- reduced motion;
- perfis 1 Mbps e 512 Kbps.

## 9.3 `rural-viability-map`

Descrição sugerida:

```yaml
description: Use when implementing or reviewing the Rural Conecta region, geolocation, place search, map selection, coordinate entry, viability request, result dialog, or WhatsApp handoff flow.
```

Restrições:

- nenhum nome/telefone;
- API pública mostra só atende/não atende;
- não mostrar tecnologia provável;
- não mostrar infraestrutura;
- mapear erros e fallbacks;
- manter consulta idempotente;
- preservar ponto ao ocorrer falha.

## 9.4 `rural-ui-quality`

Descrição sugerida:

```yaml
description: Use for Rural Conecta layout, components, CSS, responsive behavior, design tokens, interactions, dialogs, forms, and visual reviews, with mobile-first and accessibility requirements.
```

Exigir:

- HTML semântico;
- controles touch;
- foco;
- contraste;
- layout mobile real;
- nenhum texto em imagem;
- CSS nativo;
- sem biblioteca de animação;
- screenshots 390 px e desktop quando aplicável.

## 9.5 `rural-security-env`

Descrição sugerida:

```yaml
description: Use when reviewing Rural Conecta environment variables, API credentials, Google Maps keys, CORS, Workers, logging, coordinates, headers, rate limits, idempotency, or sensitive data handling.
```

Bloquear:

- impressão de secrets;
- valores reais em exemplos;
- logs com payloads completos;
- chave sem restrição;
- CORS aberto sem justificativa;
- retries duplicando consultas;
- deploy/migration;
- `audit fix`.

## 9.6 `rural-pre-commit`

Descrição sugerida:

```yaml
description: Use before declaring a Rural Conecta change complete or ready for commit. Verify scope, git status, diff, secrets, formatting, type checks, tests, build, performance impact, and documentation.
```

Saída:

```text
READY ou NOT READY
Resumo
Arquivos
Diff stat
Validações
Impacto mobile/performance
Docs
Riscos
Git status
Mensagem de commit sugerida
```

Não executar commit, salvo autorização específica da tarefa.

---

# 10. Fase F — Scaffold Astro

## 10.1 Verificar versões

- usar Node 24 LTS, salvo incompatibilidade oficial comprovada;
- usar pnpm 11;
- fixar versão exata em `packageManager`;
- usar a versão estável atual do Astro;
- registrar versões no relatório.

Antes do scaffold:

```bash
npm install --global corepack@latest
corepack enable pnpm
corepack use pnpm@latest-11
pnpm create astro@latest --help
```

Não presumir flags antigas. Ler o help atual.

## 10.2 Criar projeto minimalista

Requisitos:

- template minimal ou empty;
- TypeScript strict;
- sem framework UI;
- sem Tailwind;
- sem adapter server-side inicialmente;
- saída estática;
- sem Google Maps;
- sem analytics.

Criar apenas:

- `BaseLayout.astro`;
- `index.astro` mínima;
- `tokens.css`;
- `reset.css`;
- `global.css`;
- favicon placeholder claramente identificado;
- metadata básica provisória;
- link HTML de WhatsApp somente se o número oficial estiver confirmado.

Não implementar o design completo.

## 10.3 Dependências permitidas nesta fase

Produção:

```text
astro
```

Desenvolvimento:

```text
@astrojs/check
typescript
prettier
prettier-plugin-astro
vitest
@vitest/coverage-v8
```

Playwright pode ser adiado até o primeiro fluxo real.

Não adicionar Zod ou adapter Cloudflare antes da decisão de BFF/Worker.

## 10.4 Scripts

Criar scripts equivalentes a:

```json
{
  "scripts": {
    "dev": "astro dev",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "astro check && astro build"
  }
}
```

Criar teste mínimo apenas quando ele testar comportamento útil. Não escrever teste artificial que apenas confirma `true === true`.

---

# 11. Fase G — GitHub

Executar somente com:

```text
ALLOW_REMOTE_WRITES=true
```

## 11.1 Preflight remoto

```bash
gh auth status
gh repo view "$GITHUB_OWNER/$GITHUB_REPO"
```

Se o repositório existir:

- não sobrescrever;
- parar;
- reportar owner, visibilidade e branch;
- pedir estratégia.

## 11.2 Primeiro commit

Executar somente com:

```text
ALLOW_COMMIT=true
```

Antes:

```bash
pnpm format:check
pnpm check
pnpm test
pnpm build
git status -sb
git diff --check
```

Stage somente arquivos esperados.

Mensagem sugerida:

```text
chore: prepara fundação do projeto Rural Conecta
```

## 11.3 Criar remoto

Somente se não existir:

```bash
gh repo create "$GITHUB_OWNER/$GITHUB_REPO" \
  --private \
  --source=. \
  --remote=origin
```

Fazer push somente depois de validar remote:

```bash
git remote -v
git push -u origin main
```

Nunca incluir token no comando ou log.

## 11.4 Settings

Executar somente com:

```text
ALLOW_GITHUB_SETTINGS=true
```

Ordem:

1. CI já existe e passou;
2. ativar squash merge;
3. apagar branch após merge;
4. criar ruleset de `main`;
5. exigir check de CI;
6. bloquear force push e exclusão;
7. aprovação obrigatória somente se houver segundo revisor;
8. ativar secret scanning/push protection quando disponível.

Não criar ruleset que impeça o owner de concluir o bootstrap.

---

# 12. Fase H — CI

Criar `.github/workflows/ci.yml`.

Requisitos:

- evento em pull request e push para `main`;
- cancelamento de execução anterior da mesma branch;
- permissões mínimas;
- Node/pnpm fixados;
- lockfile congelado;
- format;
- check;
- test;
- build;
- nenhuma credencial;
- nenhum deploy;
- nenhuma ação com permissão de escrita.

Usar versões atuais e mantidas das actions oficiais. Antes de fixar, confirmar documentação atual. Preferir SHA completo se a política do owner exigir maior segurança.

Criar PR template e issue templates.

`CODEOWNERS` só deve ser criado se o username/time responsável for confirmado. Não colocar placeholder inválido.

---

# 13. Fase I — Configurar agentes

## 13.1 Codex

Não alterar `~/.codex` sem aprovação.

Verificar o projeto:

```bash
codex --ask-for-approval never "Summarize the current instructions."
```

Dentro de uma sessão:

```text
/skills
```

Confirmar:

- `AGENTS.md`;
- seis skills;
- ausência de nomes duplicados;
- comandos oficiais.

## 13.2 Hermes

Preferir perfil dedicado. Não alterar config global silenciosamente.

Propor este patch, com caminho absoluto real:

```yaml
skills:
  external_dirs:
    - /caminho/absoluto/rural-conecta-site/.agents/skills
  write_approval: true
```

Antes de aplicar:

- fazer backup da configuração;
- preservar todas as chaves existentes;
- mostrar diff;
- pedir aprovação.

Depois:

```bash
hermes doctor
hermes skills list
hermes skills audit
```

Confirmar as seis skills.

Não criar `HERMES.md`, pois `AGENTS.md` é o contexto compartilhado.

---

# 14. Fase J — Superpowers

A instalação não é requisito do projeto.

## 14.1 Codex

Se:

```text
INSTALL_SUPERPOWERS_CODEX=ask
```

apenas orientar o usuário a abrir `/plugins`, localizar `Superpowers`, revisar e instalar. Não automatizar interação de conta.

Registrar em `docs/AI_SKILLS_CATALOG.md`:

```text
Superpowers
Escopo: global do desenvolvedor
Obrigatório: não
Versão: registrar após instalação
Projeto depende dele: não
```

## 14.2 Hermes

Default:

```text
INSTALL_SUPERPOWERS_HERMES=false
```

Não instalar o pacote completo nem `using-superpowers`.

Se o usuário autorizar avaliação, inspecionar primeiro:

```bash
hermes skills inspect obra/superpowers/skills/systematic-debugging
hermes skills inspect obra/superpowers/skills/verification-before-completion
hermes skills inspect obra/superpowers/skills/requesting-code-review
hermes skills inspect obra/superpowers/skills/using-git-worktrees
```

Depois:

- apresentar achados;
- apontar conflitos com skills existentes;
- pedir aprovação por skill;
- instalar uma por vez;
- rodar `hermes skills audit`;
- registrar origem e revisão.

Não usar `--force` sem uma revisão explícita e justificativa.

Não instalar inicialmente:

```text
using-superpowers
brainstorming
writing-plans
test-driven-development
```

Essas skills podem ser testadas posteriormente em perfil descartável, porque possuem gates fortes e sobreposição com o Hermes.

---

# 15. Validação final

Executar:

```bash
git status -sb
git diff --check
pnpm format:check
pnpm check
pnpm test
pnpm build
```

Verificar também:

- nenhum `.env` real;
- nenhum token;
- nenhum arquivo RAR/ZIP acidental;
- nenhum `node_modules`;
- nenhum output `dist`;
- `AGENTS.md` abaixo de 12.000 caracteres;
- docs indexadas;
- skills com frontmatter válido;
- nenhum nome Atlas;
- nenhum React/Tailwind;
- nenhum script Google Maps;
- nenhum deploy;
- CI sem permissões excessivas;
- remote correto, se criado.

---

# 16. Formato obrigatório do relatório

```md
# Relatório de bootstrap — Rural Conecta

## Resultado

SUCCESS | PARTIAL | BLOCKED

## Ambiente

- SO:
- Node:
- pnpm:
- Astro:
- Git:
- GitHub CLI:
- Hermes:
- Codex:

## Decisões aplicadas

- ...

## Arquivos criados

- ...

## Arquivos alterados

- ...

## Dependências instaladas

- ...

## Validações

- comando: resultado

## Git

- branch:
- HEAD:
- status:
- commit criado:
- remote:
- push:

## GitHub

- repo:
- visibilidade:
- CI:
- ruleset:
- ações não executadas:

## Agentes

- AGENTS.md validado:
- skills Codex:
- skills Hermes:
- Superpowers:

## Bloqueios e decisões pendentes

- ...

## Riscos

- ...

## Próximo passo recomendado

- ...
```

Não declarar sucesso sem evidência dos comandos.

---

# 17. Critério de conclusão

A tarefa está concluída quando:

- contexto canônico existe;
- docs principais existem;
- skills iniciais existem;
- scaffold minimal compila;
- CI foi criada;
- nenhum secret foi exposto;
- nenhum framework proibido foi instalado;
- `git status` é compreensível;
- ações remotas correspondem exatamente às autorizações;
- decisões não resolvidas permanecem explicitamente pendentes;
- o relatório final contém provas das validações.

Pare depois da fundação. Não comece a landing completa nesta mesma execução.
