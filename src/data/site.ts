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
    description: "Ideal no celular, quando o GPS estiver disponível.",
    icon: "gps",
  },
  {
    title: "Buscar fazenda ou local",
    description: "Use uma referência, comunidade, estrada ou propriedade.",
    icon: "search",
  },
  {
    title: "Escolher no mapa",
    description: "O mapa será carregado apenas quando você pedir.",
    icon: "map",
  },
  {
    title: "Informar coordenadas",
    description: "Cole latitude e longitude quando já tiver o ponto.",
    icon: "pin",
  },
] as const;

export const howItWorksSteps = [
  {
    title: "Escolha sua região",
    description:
      "Comece por uma localidade principal para orientar a análise comercial.",
  },
  {
    title: "Marque sua localização",
    description:
      "Informe o ponto da propriedade por GPS, busca, mapa ou coordenadas.",
  },
  {
    title: "Fale com nossa equipe",
    description:
      "A resposta automática será simples, e a conversa final segue com atendimento humano.",
  },
] as const;

export const technologies = [
  {
    title: "Fibra óptica",
    description:
      "Indicada quando a rede disponível permite uma conexão cabeada até a propriedade.",
  },
  {
    title: "Internet via rádio",
    description:
      "Alternativa para locais onde a análise técnica aponta melhor atendimento sem fibra.",
  },
  {
    title: "Link dedicado",
    description:
      "Projeto consultivo para operações rurais e empresas que precisam de atendimento sob medida.",
  },
] as const;

export const planPreviews = [
  {
    name: "Plano Rural Essencial",
    audience: "Casa, sítio ou rotina básica",
    speed: "Velocidade sob consulta",
    price: "Valor sob consulta",
    features: [
      "Navegação do dia a dia",
      "Atendimento humano",
      "Instalação sob análise",
    ],
  },
  {
    name: "Plano Rural Família",
    audience: "Residência com mais dispositivos",
    speed: "Velocidade sob consulta",
    price: "Valor sob consulta",
    features: [
      "Chamadas de vídeo",
      "Aulas online",
      "Uso simultâneo sob análise",
    ],
  },
  {
    name: "Plano Rural Empresa",
    audience: "Fazendas e empresas rurais",
    speed: "Projeto sob consulta",
    price: "Valor sob consulta",
    features: [
      "Operação remota",
      "Gestão da propriedade",
      "Projeto personalizado",
    ],
  },
] as const;

export const localServiceHighlights = [
  "Atendimento por gente da região",
  "Análise de propriedades rurais",
  "WhatsApp como conversa humana",
  "Instalação confirmada caso a caso",
] as const;

export const everydayBenefits = [
  "Aulas online",
  "Chamadas de vídeo",
  "Streaming sem logos de terceiros",
  "Trabalho remoto",
  "Segurança da propriedade",
  "Gestão rural",
  "Comunicação familiar",
  "Atendimento comercial",
] as const;

export const enterpriseCards = [
  {
    title: "Fazendas",
    description:
      "Conectividade para sede, escritório, câmera, automação leve e rotina administrativa.",
  },
  {
    title: "Empresas rurais",
    description:
      "Análise consultiva para operações que dependem de internet para vender, comprar e gerir.",
  },
  {
    title: "Comunidades",
    description:
      "Atendimento regional para localidades onde endereço formal nem sempre resolve o ponto real.",
  },
  {
    title: "Projetos personalizados",
    description:
      "Quando o caso exige desenho próprio, a equipe avalia alternativas sem promessa pública de SLA.",
  },
] as const;

export const testimonyPlaceholders = [
  {
    title: "Relatos em validação",
    description:
      "Depoimentos reais entrarão somente depois de autorização dos clientes.",
  },
  {
    title: "O que clientes costumam buscar",
    description:
      "Estabilidade para estudar, trabalhar, falar com a família e cuidar da propriedade.",
  },
  {
    title: "Atendimento antes da promessa",
    description:
      "A conversa pelo WhatsApp ajuda a entender caminho, referência e necessidade do local.",
  },
] as const;

export const faqItems = [
  {
    question: "Preciso informar CPF para consultar?",
    answer:
      "Não. A pré-análise de viabilidade não pede CPF, nome, telefone ou e-mail. Nesta etapa, a consulta automática usa apenas coordenadas.",
  },
  {
    question: "A consulta garante instalação?",
    answer:
      "Não. A resposta automática orienta o atendimento, mas a equipe ainda confirma condições de instalação e disponibilidade no ponto.",
  },
  {
    question: "O mapa carrega assim que abro o site?",
    answer:
      "Não. O Google Maps deve carregar somente quando a pessoa escolher usar o mapa ou busca de local.",
  },
  {
    question: "Posso falar direto pelo WhatsApp?",
    answer:
      "Sim. Os CTAs contextuais levam ao WhatsApp oficial para atendimento humano.",
  },
  {
    question: "Atende fazendas e comunidades?",
    answer:
      "Sim, a Rural Conecta atende casas, fazendas, comunidades e empresas rurais, sempre dependendo da coordenada exata.",
  },
] as const;

export const quickLinks = [
  { label: "Disponibilidade", href: "#disponibilidade" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Planos", href: "#planos" },
  { label: "FAQ", href: "#faq" },
] as const;
export function createWhatsAppUrl(
  message: string = site.whatsapp.defaultMessage,
): string {
  return `https://wa.me/${site.whatsapp.digits}?text=${encodeURIComponent(message)}`;
}
