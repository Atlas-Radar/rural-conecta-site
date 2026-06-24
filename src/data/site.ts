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

export function createWhatsAppUrl(
  message: string = site.whatsapp.defaultMessage,
): string {
  return `https://wa.me/${site.whatsapp.digits}?text=${encodeURIComponent(message)}`;
}
