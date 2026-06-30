export const site = {
  name: "Rural Conecta",
  description:
    "Internet rural para casas, fazendas, comunidades e empresas, com atendimento humano pelo WhatsApp.",
  whatsapp: {
    display: "38 9740-2599",
    digits: "553897402599",
    defaultMessage:
      "Olá! Quero verificar a disponibilidade da Rural Conecta para minha propriedade.",
  },
} as const;

export const availabilityRegions = [
  "Novo Barreiro",
  "Morro Agudo",
  "Santa Rosa",
  "Nolasco",
  "Santa Rita",
  "Dobeira",
  "Engenho do Padre",
  "São Marcos",
  "Santa Bárbara",
  "Tiro e Queda",
  "Povoado do Cunha",
  "Região Mundo Novo",
] as const;

export const locationMethods = [
  {
    title: "Usar minha localização",
    description: "Caminho mais simples no celular para iniciar a pré-análise.",
    icon: "gps",
  },
  {
    title: "Buscar fazenda ou local",
    description: "Use uma referência local e depois confirme por coordenadas.",
    icon: "search",
  },
  {
    title: "Escolher no mapa",
    description: "Abre sob demanda, sem carregar Maps na abertura.",
    icon: "map",
  },
  {
    title: "Informar coordenadas",
    description: "Alternativa técnica quando você já tem o ponto em mãos.",
    icon: "pin",
  },
] as const;

export const howItWorksSteps = [
  {
    title: "Escolha sua região",
    description:
      "Use uma possível região/localidade para orientar o primeiro atendimento.",
  },
  {
    title: "Marque sua localização",
    description:
      "Informe o ponto da propriedade por GPS ou coordenadas em decimal.",
  },
  {
    title: "Fale com nossa equipe",
    description:
      "A pré-análise mostra um indício de viabilidade e a confirmação segue pelo WhatsApp.",
  },
] as const;

export const technologies = [
  {
    title: "Fibra óptica",
    description:
      "Pode ser indicada quando a análise local confirma condição adequada para conexão cabeada.",
  },
  {
    title: "Internet via rádio",
    description:
      "Solução relevante para o campo, avaliada caso a caso sem tratar como opção inferior.",
  },
  {
    title: "Link dedicado",
    description:
      "Projeto consultivo para empresas, fazendas e operações que precisam de desenho sob medida.",
  },
] as const;

export const planPreviews = [
  {
    name: "Casa rural",
    audience: "Para moradia no campo e uso familiar",
    speed: "Velocidade sob consulta",
    price: "Valor sob consulta",
    features: [
      "Estudo, chamadas e navegação diária",
      "Atendimento humano pelo WhatsApp",
      "Recomendação após pré-análise do ponto",
    ],
  },
  {
    name: "Sítio ou fazenda",
    audience: "Para rotina rural com mais dispositivos",
    speed: "Velocidade sob consulta",
    price: "Valor sob consulta",
    features: [
      "Câmeras, comunicação e rotina produtiva",
      "Uso simultâneo avaliado conforme o local",
      "Instalação confirmada depois da análise",
    ],
  },
  {
    name: "Empresa rural",
    audience: "Para propriedade produtiva e operação",
    speed: "Projeto sob consulta",
    price: "Valor sob consulta",
    features: [
      "Gestão, vendas, compras e sistemas",
      "Atendimento consultivo para a operação",
      "Projeto personalizado quando necessário",
    ],
  },
] as const;

export const localServiceHighlights = [
  "Equipe acostumada com referências rurais",
  "Avaliação manual quando a pré-análise não basta",
  "WhatsApp oficial com conversa humana",
  "Instalação confirmada caso a caso, sem promessa automática",
] as const;

export const everydayBenefits = [
  "Aulas e estudo em casa",
  "Chamadas com família e equipe",
  "Filmes e entretenimento sem marcas citadas",
  "Trabalho remoto quando a análise permitir",
  "Câmeras e segurança da propriedade",
  "Rotina produtiva da fazenda",
  "Comunicação com fornecedores",
  "Atendimento comercial pelo celular",
] as const;

export const enterpriseCards = [
  {
    title: "Fazendas",
    description:
      "Conectividade para sede, escritório, câmeras e rotinas administrativas da propriedade.",
  },
  {
    title: "Empresas rurais",
    description:
      "Análise consultiva para operações que dependem de internet para vender, comprar e gerir.",
  },
  {
    title: "Sítios e comunidades",
    description:
      "Atendimento regional para locais onde endereço formal nem sempre representa o ponto real.",
  },
  {
    title: "Projetos personalizados",
    description:
      "Quando o caso exige desenho próprio, a equipe avalia alternativas sem promessa pública de SLA.",
  },
] as const;

export const testimonyPlaceholders = [
  {
    title: "Sem depoimentos inventados",
    description:
      "Relatos reais entram somente depois de autorização dos clientes e validação do conteúdo.",
  },
  {
    title: "O que a equipe acompanha",
    description:
      "Necessidade de estudo, trabalho, câmeras, comunicação familiar e rotina produtiva.",
  },
  {
    title: "Conversa antes da promessa",
    description:
      "O WhatsApp ajuda a entender caminho, referência, uso esperado e possibilidade de avaliação manual.",
  },
] as const;

export const faqItems = [
  {
    question: "A consulta garante instalação?",
    answer:
      "Não. A pré-análise mostra um indício de viabilidade. A equipe ainda confirma condições de atendimento, instalação e melhor solução para o ponto.",
  },
  {
    question: "Preciso informar telefone ou CPF?",
    answer:
      "Não. A consulta no site não pede nome, telefone, e-mail ou CPF. Nesta etapa, ela usa apenas latitude e longitude.",
  },
  {
    question: "Por que vocês pedem localização?",
    answer:
      "Porque na zona rural o endereço nem sempre indica o ponto exato da casa, sede, sítio ou fazenda. A coordenada ajuda a orientar a avaliação.",
  },
  {
    question: "E se a pré-análise não encontrar disponibilidade?",
    answer:
      "Você ainda pode solicitar avaliação manual pelo WhatsApp. A equipe verifica alternativas, expansão ou necessidade de análise personalizada.",
  },
  {
    question: "Vocês atendem fazendas, sítios e empresas rurais?",
    answer:
      "Sim. O atendimento pode envolver casas no campo, sítios, fazendas, comunidades e pequenas empresas rurais, sempre dependendo do ponto informado.",
  },
  {
    question: "O mapa já está disponível?",
    answer:
      "Sim. O Google Maps abre somente sob demanda, depois de uma ação explícita no modal, sem pesar a abertura inicial da landing.",
  },
  {
    question: "Posso continuar pelo WhatsApp?",
    answer:
      "Sim. Depois da pré-análise, ou se a consulta não funcionar, os CTAs levam ao WhatsApp oficial da Rural Conecta.",
  },
] as const;

export const quickLinks = [
  { label: "Disponibilidade", href: "#disponibilidade" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Planos", href: "#planos" },
  { label: "Regiões", href: "#regioes" },
  { label: "FAQ", href: "#faq" },
] as const;
export function createWhatsAppUrl(
  message: string = site.whatsapp.defaultMessage,
): string {
  return `https://wa.me/${site.whatsapp.digits}?text=${encodeURIComponent(message)}`;
}
