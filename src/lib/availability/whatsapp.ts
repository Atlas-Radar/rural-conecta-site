import type { Coordinates } from "./coordinates";
import { formatCoordinate } from "./coordinates";

export interface WhatsAppContext {
  regionName?: string;
  resultMessage: string;
  coordinates?: Coordinates;
}

export function createAvailabilityWhatsAppMessage(
  context: WhatsAppContext,
): string {
  const lines = ["Olá! Fiz uma pré-análise no site da Rural Conecta.", ""];

  if (context.regionName) {
    lines.push(`Possível região/localidade: ${context.regionName}`);
  }

  lines.push(`Resultado: ${context.resultMessage}`);

  if (context.coordinates) {
    lines.push(
      `Coordenadas informadas: ${formatCoordinate(context.coordinates.latitude)}, ${formatCoordinate(context.coordinates.longitude)}`,
    );
  }

  lines.push("", "Quero continuar o atendimento com a equipe.");

  return lines.join("\n");
}

export function createWhatsAppUrl(digits: string, message: string): string {
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
