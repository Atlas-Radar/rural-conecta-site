export interface AvailabilityRegion {
  name: string;
}

export type ViabilityStatus =
  | "pre_viavel"
  | "sem_viabilidade_automatica"
  | "necessita_confirmacao"
  | "entrada_invalida"
  | "limite_excedido"
  | "erro_temporario"
  | "falha_rede";

export type ViabilityKind =
  | "positive"
  | "negative"
  | "confirmation"
  | "invalid-input"
  | "rate-limit"
  | "temporary-error"
  | "network-error";

export interface NormalizedViabilityResult {
  kind: ViabilityKind;
  status: ViabilityStatus;
  title: string;
  message: string;
  whatsappLabel: string;
}

interface RegionsApiItem {
  nome?: unknown;
}

interface RegionsApiResponse {
  regioes?: unknown;
}

interface ViabilityApiResponse {
  viavel?: unknown;
  status?: unknown;
  mensagem?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function publicMessage(value: unknown, fallback: string): string {
  const message = cleanText(value);
  return message || fallback;
}

export function normalizeRegionsResponse(data: unknown): AvailabilityRegion[] {
  if (!isRecord(data)) {
    return [];
  }

  const response = data as RegionsApiResponse;
  if (!Array.isArray(response.regioes)) {
    return [];
  }

  const seen = new Set<string>();
  const regions: AvailabilityRegion[] = [];

  for (const item of response.regioes) {
    if (!isRecord(item)) {
      continue;
    }

    const name = cleanText((item as RegionsApiItem).nome);
    const key = name.toLocaleLowerCase("pt-BR");

    if (!name || seen.has(key)) {
      continue;
    }

    seen.add(key);
    regions.push({ name });
  }

  return regions.sort((first, second) =>
    first.name.localeCompare(second.name, "pt-BR"),
  );
}

export function normalizeViabilityResponse(
  data: unknown,
): NormalizedViabilityResult {
  const response: ViabilityApiResponse = isRecord(data) ? data : {};
  const status = cleanText(response.status);

  if (status === "necessita_confirmacao") {
    return {
      kind: "confirmation",
      status: "necessita_confirmacao",
      title: "Pré-análise precisa de confirmação",
      message: publicMessage(
        response.mensagem,
        "Recebemos o ponto informado, mas nossa equipe precisa confirmar a disponibilidade manualmente.",
      ),
      whatsappLabel: "Continuar pelo WhatsApp",
    };
  }

  if (status === "sem_viabilidade_automatica" || response.viavel === false) {
    return {
      kind: "negative",
      status: "sem_viabilidade_automatica",
      title: "Não identificamos viabilidade automática",
      message: publicMessage(
        response.mensagem,
        "Não identificamos viabilidade automática para este ponto. Nossa equipe pode avaliar manualmente.",
      ),
      whatsappLabel: "Solicitar avaliação manual",
    };
  }

  if (status === "pre_viavel" || response.viavel === true) {
    return {
      kind: "positive",
      status: "pre_viavel",
      title: "Encontramos indício de viabilidade",
      message: publicMessage(
        response.mensagem,
        "Encontramos indício de viabilidade para este endereço.",
      ),
      whatsappLabel: "Continuar pelo WhatsApp",
    };
  }

  return {
    kind: "confirmation",
    status: "necessita_confirmacao",
    title: "Pré-análise precisa de confirmação",
    message:
      "Não conseguimos classificar automaticamente este ponto. Nossa equipe pode avaliar manualmente.",
    whatsappLabel: "Continuar pelo WhatsApp",
  };
}

export function normalizeViabilityError(
  httpStatus?: number,
): NormalizedViabilityResult {
  if (httpStatus === 400) {
    return {
      kind: "invalid-input",
      status: "entrada_invalida",
      title: "Coordenadas inválidas",
      message:
        "Revise latitude e longitude. A consulta automática precisa de coordenadas válidas.",
      whatsappLabel: "Pedir ajuda pelo WhatsApp",
    };
  }

  if (httpStatus === 429) {
    return {
      kind: "rate-limit",
      status: "limite_excedido",
      title: "Limite de consultas atingido",
      message:
        "Muitas consultas foram feitas em sequência. Tente novamente em alguns minutos ou fale com nossa equipe.",
      whatsappLabel: "Continuar pelo WhatsApp",
    };
  }

  if (httpStatus === 503) {
    return {
      kind: "temporary-error",
      status: "erro_temporario",
      title: "Pré-análise indisponível agora",
      message:
        "Não foi possível consultar a pré-análise agora. Nossa equipe pode avaliar manualmente pelo WhatsApp.",
      whatsappLabel: "Solicitar avaliação manual",
    };
  }

  return {
    kind: "network-error",
    status: "falha_rede",
    title: "Não foi possível verificar agora",
    message:
      "A conexão com a pré-análise falhou. Você ainda pode enviar as informações pelo WhatsApp.",
    whatsappLabel: "Continuar pelo WhatsApp",
  };
}
