import type { Coordinates } from "./coordinates";

export const DEFAULT_API_BASE_URL = "https://atlassoftware.ia.br";

export function normalizeAtlasApiBaseUrl(baseUrl: string | undefined): string {
  const trimmedBaseUrl = baseUrl?.trim();
  if (!trimmedBaseUrl) {
    return DEFAULT_API_BASE_URL;
  }

  return trimmedBaseUrl.replace(/\/+$/, "");
}

export function createAvailabilityEndpoints(
  baseUrl: string | undefined = API_BASE_URL,
): {
  regionsEndpoint: string;
  viabilityEndpoint: string;
} {
  const normalizedBaseUrl = normalizeAtlasApiBaseUrl(baseUrl);

  return {
    regionsEndpoint: `${normalizedBaseUrl}/api/public/regioes`,
    viabilityEndpoint: `${normalizedBaseUrl}/api/public/viabilidade-basica`,
  };
}

export const API_BASE_URL = normalizeAtlasApiBaseUrl(
  import.meta.env.PUBLIC_ATLAS_API_BASE_URL,
);
export const {
  regionsEndpoint: REGIONS_ENDPOINT,
  viabilityEndpoint: VIABILITY_ENDPOINT,
} = createAvailabilityEndpoints(API_BASE_URL);

export interface ViabilityPayload {
  latitude: number;
  longitude: number;
}

export function buildViabilityPayload(
  coordinates: Coordinates,
): ViabilityPayload {
  return {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  };
}
