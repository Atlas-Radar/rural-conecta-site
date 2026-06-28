import type { Coordinates } from "./coordinates";

export const API_BASE_URL = "https://atlassoftware.ia.br";
export const REGIONS_ENDPOINT = `${API_BASE_URL}/api/public/regioes`;
export const VIABILITY_ENDPOINT = `${API_BASE_URL}/api/public/viabilidade-basica`;

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
