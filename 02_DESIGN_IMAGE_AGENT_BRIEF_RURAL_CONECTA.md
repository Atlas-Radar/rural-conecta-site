# Rural Conecta — Brief Detalhado para Agente de Design Visual

> Objetivo: orientar um agente de design ou geração visual a criar propostas de interface **mobile e desktop** comparáveis para a landing page da Rural Conecta. As imagens devem representar uma interface implementável, moderna e coerente com as limitações de performance do projeto.

## 1. Objetivo da tarefa

Criar imagens de design de alta fidelidade para uma landing page de provedora de internet rural, com foco em:

- celular como experiência principal;
- conexão lenta e instável;
- visual rural premium e tecnológico;
- consulta de viabilidade simples;
- Google Maps como ferramenta de localização;
- WhatsApp como etapa humana de contratação.

Os arquivos anexados anteriormente servem como **referência de direção estética**, não como layout final a ser copiado. O novo design deve preservar a aparência moderna, mas corrigir densidade, fluxo mobile, inconsistência de marca e excesso de elementos.

## 2. Contexto do produto

A Rural Conecta oferece internet para casas, fazendas, comunidades e empresas em áreas rurais. Pode trabalhar com fibra, rádio e link dedicado, mas a consulta pública não informa qual tecnologia será usada.

A API de viabilidade retorna somente:

- atende;
- não atende.

O visitante não informa nome ou telefone para consultar. Ele:

1. escolhe uma região da API;
2. informa a localização;
3. consulta a disponibilidade;
4. recebe o resultado;
5. continua no WhatsApp com um atendente humano.

A localização pode ser obtida por:

- GPS do celular;
- busca por fazenda/local/endereço;
- toque no mapa;
- marcador arrastável;
- coordenadas manuais;
- compartilhamento posterior pelo WhatsApp.

## 3. Personalidade visual

A marca deve parecer:

- rural;
- premium;
- tecnológica;
- confiável;
- humana;
- regional;
- competente, sem parecer uma operadora impessoal;
- moderna, sem parecer uma startup genérica de IA.

### Conceito visual

> “Tecnologia avançada que respeita a realidade do campo.”

Misturar:

- paisagem rural brasileira;
- instalações reais de internet;
- técnicos locais;
- moradores e produtores;
- equipamento discreto;
- interface digital limpa;
- luzes e linhas verdes usadas com moderação.

## 4. Direção estética recomendada

### 4.1 Base visual

- fundo predominante verde-azulado muito escuro;
- superfícies ligeiramente mais claras;
- branco quente para títulos;
- verde vivo para CTA e estados positivos;
- verde mais suave para bordas e ícones;
- luz quente nas fotografias para gerar contraste humano;
- cards com borda fina, sem glow exagerado;
- grandes áreas de respiro;
- tipografia forte e direta;
- cantos arredondados moderados;
- gradientes sutis;
- linhas de conexão em SVG/CSS como elemento decorativo, não como efeito permanente.

### 4.2 Paleta provisória

Usar como ponto de partida editável:

```text
Background 950: #020B0C
Background 900: #061514
Surface 800:    #0A211B
Surface 700:    #0D2A21
Green 500:      #63D43B
Green 400:      #7BE653
Green 300:      #A1F27C
Text primary:   #F5F7F3
Text muted:     #B5C0B8
Border green:   rgba(99, 212, 59, 0.35)
Warm light:     #D89B5F
Error:          #F1786B
```

Não transformar tudo em neon. O verde forte deve indicar ação, conexão e status.

### 4.3 Tipografia

- sans-serif contemporânea, humana e legível;
- preferência por Inter, Manrope ou fonte de sistema equivalente;
- títulos com peso 700–800;
- corpo entre 400–500;
- no celular, corpo mínimo visual de 16 px;
- evitar texto excessivamente condensado;
- evitar mais de duas famílias tipográficas.

### 4.4 Marca

Usar **uma única versão consistente** do logotipo em todas as telas.

Se o logo oficial não estiver disponível:

- criar um placeholder limpo com símbolo rural + conectividade;
- não inventar versões diferentes a cada seção;
- deixar claro que é provisório;
- preferir inserir o logo como camada vetorial depois, não pedir ao gerador de imagem para desenhar texto perfeito dentro da fotografia.

## 5. Estratégia para as imagens de referência

Os mockups anteriores têm bons elementos:

- fundo escuro;
- verde luminoso;
- paisagens de campo;
- técnicos em atividade;
- cards modernos;
- grandes títulos;
- CTA de viabilidade;
- presença de atendimento local.

Corrigir no novo design:

- não usar moldura de telefone na interface real;
- não usar contador `1/10`, `2/10` ou barra de progresso;
- não transformar a landing em apresentação por slides;
- não comprimir layout desktop no celular;
- não misturar várias versões do logo;
- não mostrar torres, CTOs e rotas fictícias no mapa;
- não pedir nome ou telefone na consulta;
- não mostrar “fibra disponível” ou “rádio sujeito à análise” quando a API só retorna atende/não atende;
- não lotar a primeira tela com quatro ou mais cards;
- não alternar fundo claro e escuro a cada pequena seção.

## 6. Entregáveis obrigatórios

Criar os seguintes arquivos visuais:

### 6.1 Mobile — landing completa

```text
Nome: rural-conecta-mobile-full.png
Largura: 390 px de viewport
Canvas: página longa, aproximadamente 5.500–7.500 px de altura
Escala alternativa para apresentação: 780 px de largura, mantendo proporção
```

A imagem deve mostrar uma única página de scroll vertical contínuo.

### 6.2 Mobile — fluxo de viabilidade

Três telas separadas, todas em 390 × 844 px:

```text
rural-conecta-mobile-viability-start.png
rural-conecta-mobile-map.png
rural-conecta-mobile-result.png
```

Estados:

1. seleção da região e método de localização;
2. mapa em tela cheia com marcador;
3. resultado em bottom sheet/modal.

### 6.3 Desktop — landing completa

```text
Nome: rural-conecta-desktop-full.png
Largura de viewport: 1440 px
Canvas: página longa, aproximadamente 7.000–10.000 px de altura
```

### 6.4 Desktop — seção de viabilidade

```text
Nome: rural-conecta-desktop-viability.png
Dimensão: 1440 × 900 px
```

Mostrar formulário/controles à esquerda e mapa à direita.

### 6.5 Quadro comparativo

```text
Nome: rural-conecta-comparison-board.png
Dimensão sugerida: 2560 × 1600 px
```

Apresentar lado a lado:

- hero mobile;
- hero desktop;
- viabilidade mobile;
- viabilidade desktop;
- notas curtas sobre como o layout se adapta.

## 7. Variações de direção para comparação

Além da proposta principal, criar duas miniaturas de hero + viabilidade para comparar:

### Direção A — Dark Premium Imersivo

- fundo escuro em quase toda a página;
- fotografia dominante;
- verde intenso nos CTAs;
- cards escuros;
- atmosfera noturna/entardecer.

### Direção B — Dark com Ritmo Claro

- hero e viabilidade escuros;
- planos e depoimentos em superfícies claras;
- maior sensação de leveza;
- contraste visual mais forte entre seções.

Exportar:

```text
rural-conecta-direction-a-preview.png
rural-conecta-direction-b-preview.png
```

A proposta principal recomendada é a **Direção B**, porque preserva a identidade escura e melhora a leitura em uma página longa.

## 8. Arquitetura da landing para o design

A ordem do conteúdo deve ser a mesma no mobile e no desktop, com adaptações de layout:

1. Header.
2. Hero.
3. Consulta de viabilidade.
4. Como funciona em três passos.
5. Tecnologias oferecidas.
6. Planos.
7. Atendimento local.
8. Benefícios de streaming e TV.
9. Regiões atendidas.
10. Soluções para empresas e fazendas.
11. Depoimentos.
12. FAQ.
13. CTA final.
14. Rodapé.

A consulta de viabilidade deve aparecer cedo, logo após o hero.

## 9. Design mobile detalhado

### 9.1 Header mobile

- altura compacta, aproximadamente 64–72 px;
- logo à esquerda;
- botão de menu à direita;
- opcional: pequeno ícone de WhatsApp, sem competir com o CTA principal;
- fundo sólido ou semitransparente pequeno;
- nada de navegação horizontal comprimida.

### 9.2 Hero mobile

Objetivo: comunicar a proposta e levar à consulta rapidamente.

Estrutura recomendada:

```text
[ selo pequeno: CONEXÃO QUE MOVE O CAMPO ]

Internet de verdade
para quem vive no campo.

Fibra, rádio e soluções dedicadas para levar conexão
estável até sua casa, fazenda ou empresa.

[ Verificar disponibilidade ]
[ Falar no WhatsApp ]

Atendimento local • Fibra e rádio
```

Diretrizes:

- headline com 2–4 linhas;
- imagem de técnico/propriedade como fundo ou bloco inferior;
- não colocar quatro cards dentro da primeira viewport;
- CTA principal visível sem rolar em 390 × 844;
- botão secundário menos chamativo;
- imagem mobile em enquadramento 4:5 ou 3:4;
- overlay para leitura;
- sem vídeo;
- sem partículas.

### 9.3 Viabilidade mobile — tela inicial

Estrutura:

```text
Verifique a disponibilidade

Escolha uma região
[ Nolasco                                  v ]

Como deseja localizar sua propriedade?
[ ícone GPS ] Usar minha localização
[ ícone busca ] Buscar fazenda ou local
[ ícone mapa ] Escolher no mapa
[ ícone pin ] Informar coordenadas

[ Verificar disponibilidade ]
```

Regras:

- uma coluna;
- cada método deve ser um botão largo;
- ícones lineares consistentes;
- o botão “Verificar” fica desabilitado até existir ponto válido;
- não pedir nome, WhatsApp ou tipo de propriedade;
- incluir microtexto de privacidade simples;
- mostrar estado selecionado com borda/ícone, não apenas cor.

### 9.4 Mapa mobile

Criar uma tela separada em 390 × 844:

```text
Topo:
[ voltar ]  Escolha o ponto da propriedade

Campo de busca:
[ Buscar fazenda, estrada ou referência ]

Mapa:
- tema escuro legível;
- apenas marcador do usuário;
- botão de localização atual;
- zoom discreto;
- sem torres, CTOs ou rotas fictícias;
- indicador de região selecionada;

Base fixa:
Local selecionado
-17.123456, -46.123456
Precisão aproximada: 28 m

[ Confirmar este ponto ]
```

A base pode ser um bottom sheet curto. Respeitar safe area inferior.

### 9.5 Resultado mobile

Usar bottom sheet ou `<dialog>` visualmente equivalente.

Estado positivo:

```text
[ check ]
Há disponibilidade para este local

Nossa equipe vai confirmar a melhor tecnologia e as
condições de instalação para sua propriedade.

[ Continuar pelo WhatsApp ]
[ Ajustar localização ]
```

Estado negativo:

```text
[ ícone neutro ]
Não identificamos disponibilidade automática

Nossa equipe pode verificar alternativas ou uma análise
personalizada para esta localização.

[ Solicitar análise pelo WhatsApp ]
[ Escolher outro ponto ]
```

Não usar mensagem agressiva de “sem cobertura” como beco sem saída.

### 9.6 Como funciona

Três passos compactos:

1. Escolha sua região.
2. Marque sua localização.
3. Fale com nossa equipe.

No celular, usar sequência vertical com números grandes e uma linha discreta de conexão.

### 9.7 Tecnologias

Cards para:

- fibra óptica;
- internet via rádio;
- link dedicado.

No mobile:

- um card por linha;
- texto curto;
- ícone grande;
- sem especificações não confirmadas;
- CTA único para consultar disponibilidade.

### 9.8 Planos

- mostrar um card principal por vez;
- permitir scroll horizontal com CSS Scroll Snap ou uma sequência vertical curta;
- evitar três cards densos simultaneamente;
- velocidades e benefícios devem ser placeholders claramente marcados enquanto não forem validados;
- CTA: “Consultar disponibilidade”.

### 9.9 Atendimento local

Esta seção deve ter forte componente humano:

- técnico e atendente conversando com produtor rural;
- texto “Aqui você fala com gente da região”;
- três ou quatro diferenciais curtos;
- CTA WhatsApp;
- fotografia realista e calorosa.

### 9.10 Streaming e TV

- duas colunas de logos ou trilho horizontal;
- não usar logos não autorizados como conteúdo final;
- textos mínimos;
- carregamento visual secundário;
- CTA após o conjunto.

### 9.11 Regiões atendidas

- lista de regiões em chips ou cards compactos;
- mapa decorativo simples da área como SVG/ilustração, não um segundo Google Maps;
- CTA de consulta;
- deixar claro que a disponibilidade exata depende da coordenada.

### 9.12 Empresas e fazendas

Separar da seção de regiões.

Cards para:

- link dedicado;
- IP válido;
- SLA e suporte;
- projetos personalizados.

No mobile, uma coluna.

### 9.13 Depoimentos

- apenas depoimentos reais ou marcados como placeholder;
- um card principal na tela;
- rolagem horizontal para demais;
- foto pequena ou avatar neutro;
- evitar estrelas exageradas em todos os cards;
- incluir região de forma discreta.

### 9.14 FAQ

- acordeão nativo visual;
- perguntas em uma coluna;
- ícone simples;
- bom espaçamento de toque;
- CTA final próximo.

### 9.15 CTA final e rodapé

CTA final:

```text
Pronto para conectar sua casa, fazenda ou empresa?

[ Verificar disponibilidade ]
[ Falar no WhatsApp ]
```

Rodapé:

- logo;
- telefone/WhatsApp;
- endereço;
- links rápidos;
- política de privacidade;
- Área do Cliente como link discreto;
- redes sociais, se confirmadas.

## 10. Design desktop detalhado

### 10.1 Header desktop

- largura máxima de conteúdo aproximadamente 1200–1280 px;
- logo à esquerda;
- navegação central;
- “Verificar disponibilidade” e WhatsApp à direita;
- sticky opcional, com altura moderada;
- não exagerar em blur.

### 10.2 Hero desktop

Layout em duas áreas:

- conteúdo à esquerda, aproximadamente 52%;
- fotografia/equipamento à direita, aproximadamente 48%;
- CTA principal e secundário lado a lado;
- diferenciais abaixo em quatro cards pequenos ou uma barra horizontal;
- imagem 16:9 ou 4:3 com técnico e propriedade;
- linhas verdes decorativas no rodapé da cena;
- nada de texto incorporado na fotografia.

Headline:

```text
Internet de verdade
para quem vive no campo.
```

### 10.3 Viabilidade desktop

Usar 1440 × 900 como frame de referência.

Layout:

```text
Esquerda (40%):
- título;
- seletor de região;
- métodos de localização;
- coordenada atual;
- botão de consulta;
- texto de privacidade.

Direita (60%):
- mapa;
- campo de busca;
- botão “usar minha localização”;
- marcador;
- cartão flutuante pequeno com ponto confirmado.
```

Não mostrar resultado de tecnologia. O modal de resultado pode aparecer centralizado sobre a página ou ancorado ao painel.

### 10.4 Densidade desktop

O desktop pode usar grids de 2–4 colunas, mas deve manter respiro.

Evitar:

- mais de quatro cards por linha;
- textos longos dentro de cards;
- dez elementos competindo na mesma área;
- repetir CTA em cada pequeno bloco.

### 10.5 Ritmo de cor

Recomendação:

```text
Hero: escuro
Viabilidade: escuro
Como funciona: escuro ou verde muito profundo
Planos: claro
Atendimento local: claro ou fotografia quente
Benefícios: escuro
Regiões: escuro
Empresas: escuro
Depoimentos: claro
FAQ e CTA final: escuro
```

Isso evita alternância excessiva e melhora a leitura da página longa.

## 11. Fotografia e direção de arte

### 11.1 Cenas desejadas

Criar ou selecionar imagens separadas para composição:

1. Técnico instalando CPE/antena em poste próximo a uma casa rural, entardecer.
2. Equipe local conversando com produtor rural, luz quente, postura natural.
3. Paisagem de fazendas e morros, com infraestrutura discreta ao fundo.
4. Equipamento de internet sobre mesa/varanda rural, sem aparência genérica de e-commerce.
5. Técnico sorrindo em campo, uniforme coerente com a marca.

### 11.2 Enquadramento

Para cada foto principal, gerar duas versões:

- mobile: 4:5 ou 3:4, sujeito deslocado para deixar área de texto;
- desktop: 16:9 ou 3:2, com espaço negativo adequado.

### 11.3 Realismo

- ambiente brasileiro plausível;
- vegetação, arquitetura e relevo compatíveis com interior de Minas Gerais;
- diversidade realista de idade, gênero e tons de pele;
- ferramentas e equipamentos plausíveis;
- uniformes consistentes;
- mãos e cabos sem deformações;
- evitar cenário excessivamente cinematográfico ou futurista;
- não desenhar texto ou logo complexo dentro da foto por IA; aplicar depois como camada de design.

## 12. Componentes visuais

### 12.1 Botões

Primário:

- verde preenchido;
- texto branco ou verde-escuro com contraste adequado;
- ícone opcional;
- altura mobile 48–56 px;
- leve gradiente permitido;
- sombra discreta.

Secundário:

- fundo transparente/escuro;
- borda verde;
- sem competir com o primário.

### 12.2 Cards

- borda fina;
- radius 16–24 px;
- superfície sólida ou transparência moderada;
- sombra pequena;
- sem glassmorphism em toda a página;
- títulos curtos;
- ícone em círculo ou quadrado suave;
- estado ativo claramente identificável.

### 12.3 Ícones

- estilo linear consistente;
- espessura visual uniforme;
- não misturar outline, filled e 3D;
- criar SVGs limpos;
- símbolos principais: localização, mapa, GPS, fibra, rádio, dedicado, WhatsApp, suporte, escudo e empresa.

### 12.4 Microinterações representadas

Nas imagens, sugerir de forma sutil:

- hover/focus em desktop;
- pressed/selected em mobile;
- loading com skeleton leve;
- marcador pulando suavemente ao ser confirmado;
- bottom sheet entrando de baixo;
- CTA com brilho discreto no estado ativo.

Não representar animações permanentes.

## 13. Estados que devem aparecer no conjunto visual

Criar pelo menos uma amostra visual para cada estado:

1. Regiões carregando.
2. Região selecionada.
3. Pedido de permissão de localização.
4. Localização obtida com precisão aproximada.
5. Mapa carregando lentamente.
6. Marcador sendo ajustado.
7. Consulta em andamento.
8. Há disponibilidade.
9. Não identificamos disponibilidade.
10. Erro temporário com fallback para WhatsApp.

Os estados podem aparecer em uma página auxiliar de componentes, além das telas principais.

## 14. Conteúdo sugerido

### Hero

```text
CONEXÃO QUE MOVE O CAMPO

Internet de verdade
para quem vive no campo.

Fibra, rádio e soluções dedicadas para levar conexão estável
até sua casa, fazenda ou empresa na zona rural.

Verificar disponibilidade
Falar no WhatsApp
```

### Viabilidade

```text
Verifique a disponibilidade na sua região

Selecione uma região e informe o ponto da sua propriedade.
A consulta é rápida e não exige cadastro.
```

### Atendimento local

```text
Aqui você fala com gente da região.

Atendimento próximo, equipe técnica local e suporte para quem
conhece a realidade do campo.
```

### CTA final

```text
Pronto para conectar sua casa, fazenda ou empresa?

Marque sua localização e fale com nossa equipe sobre a melhor
solução para sua região.
```

Não inventar preços, velocidades, nomes de clientes ou promessas técnicas definitivas.

## 15. Restrições de performance refletidas no design

O design deve parecer implementável com carga inicial pequena.

Por isso:

- apenas uma fotografia crítica acima da dobra;
- imagens abaixo da dobra podem aparecer, mas sem depender de vídeo;
- evitar composição que exija dezenas de PNGs decorativos;
- linhas e brilhos devem poder ser feitos com CSS/SVG;
- ícones devem ser vetoriais;
- não usar canvas, partículas ou 3D como elemento central;
- o mapa não deve aparecer aberto no hero;
- a primeira seção deve funcionar visualmente antes do Maps;
- fontes devem ser simples;
- não criar layout que dependa de blur pesado em toda a tela;
- não criar múltiplas fotografias gigantes em sequência.

O objetivo visual é premium, mas o frontend deve conseguir manter a primeira transferência próxima de 150–190 KB no celular.

## 16. Acessibilidade visual

- contraste suficiente entre texto e fundo;
- texto de corpo nunca em verde fraco sobre fundo escuro;
- estados não dependem somente de cor;
- foco visível nos controles;
- botões com área de toque confortável;
- campo e botão não ficam escondidos pelo teclado;
- modal possui título claro e ação de fechar;
- mapas têm alternativa textual/coordenadas;
- títulos em hierarquia clara;
- parágrafos mobile curtos;
- não usar textos minúsculos para parecer sofisticado.

## 17. Elementos proibidos

Não incluir nos designs finais:

- campos de nome, telefone, e-mail ou CPF na consulta;
- tecnologia retornada pela API;
- rotas de fibra fictícias;
- torres e CTOs como dado público;
- mapa decorado como se fosse uma análise técnica real;
- contadores de slides `1/10`;
- moldura de iPhone dentro da landing;
- barra de status do aparelho como parte da interface;
- carrossel obrigatório para navegar pela página;
- vídeo automático;
- partículas em canvas;
- 3D pesado;
- múltiplos logos diferentes;
- depoimentos falsos apresentados como reais;
- logos de parceiros sem confirmação;
- aviso de cobrança, inadimplência ou cuidado com equipamentos no centro da landing de aquisição.

## 18. Processo recomendado para o agente

1. Leia o arquivo `01_PROJECT_CONTEXT_RURAL_CONECTA.md`.
2. Revise as referências anexadas apenas para captar clima e identidade.
3. Crie wireframes mobile de baixa fidelidade primeiro.
4. Valide ordem e densidade do conteúdo.
5. Construa os três estados críticos de viabilidade mobile.
6. Defina tokens visuais provisórios.
7. Faça o design mobile completo.
8. Expanda o mesmo sistema para desktop sem duplicar o conceito.
9. Gere a variação de direção A/B.
10. Monte o quadro comparativo.
11. Verifique acessibilidade, consistência e implementabilidade.
12. Exporte PNGs e, se possível, arquivo editável em Figma/SVG.

## 19. Checklist de aprovação

### Mobile

- [ ] O CTA de viabilidade aparece sem rolagem excessiva.
- [ ] A primeira tela não está superlotada.
- [ ] O fluxo é vertical, não um slideshow.
- [ ] A consulta não pede dados pessoais de contato.
- [ ] O mapa tem uma tela própria clara.
- [ ] O marcador e o botão de confirmar são fáceis de usar com o polegar.
- [ ] O resultado aparece em bottom sheet/modal.
- [ ] Existe saída para WhatsApp em todos os resultados.
- [ ] O design funciona entre 360 e 430 px.
- [ ] Não há texto menor que o necessário para leitura confortável.

### Desktop

- [ ] A composição expande o mobile, não cria outro produto.
- [ ] O hero tem hierarquia clara e respiro.
- [ ] A viabilidade usa duas colunas de forma funcional.
- [ ] O mapa não domina toda a página.
- [ ] Cards não estão excessivamente densos.
- [ ] A alternância de seções claras/escuras tem ritmo consistente.

### Marca e modernidade

- [ ] Apenas um logo consistente.
- [ ] Verde usado como destaque, não como excesso.
- [ ] Fotografias rurais coerentes e realistas.
- [ ] Ícones possuem o mesmo estilo.
- [ ] A interface parece premium sem depender de efeitos pesados.
- [ ] O design pode ser implementado com HTML, CSS, SVG e JavaScript leve.

### Produto

- [ ] A API é representada apenas por atende/não atende.
- [ ] O mapa serve para selecionar localização.
- [ ] A contratação continua no WhatsApp humano.
- [ ] Nenhum detalhe de infraestrutura interna aparece.
- [ ] Conteúdo comercial não confirmado está marcado como placeholder.

## 20. Prompt resumido para agente de imagem/design

```text
Crie uma landing page responsiva de alta fidelidade para a Rural Conecta,
provedora de internet rural no Brasil. O visual deve ser rural premium,
tecnológico, humano e moderno, com fundo verde-azulado muito escuro,
verde vivo usado com moderação, fotografias realistas de técnicos e
propriedades rurais e seções claras estratégicas para criar ritmo.

A experiência principal é mobile-first. O usuário escolhe uma região,
obtém ou marca sua localização por GPS, busca, mapa ou coordenadas,
consulta uma API que responde apenas atende/não atende e depois segue
para atendimento humano no WhatsApp. Não pedir nome ou telefone.
Não mostrar torres, CTOs, rotas de fibra ou tecnologia provável.

Crie uma página mobile de scroll contínuo, uma página desktop equivalente,
três telas mobile do fluxo de viabilidade e uma tela desktop da consulta.
No mobile, o mapa abre em tela cheia e o resultado aparece em bottom sheet.
No desktop, formulário à esquerda e mapa à direita. Preserve aparência
premium, mas evite vídeo, partículas, 3D, excesso de blur, glow e cards.
O design precisa ser implementável com HTML, CSS, SVG e JavaScript leve,
para funcionar em conexões inferiores a 1 Mbps.
```
