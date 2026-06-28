export interface Coordinates {
  latitude: number;
  longitude: number;
}

const NUMBER_PATTERN = /^[+-]?\d+(?:[.,]\d+)?$/;
const NUMBER_IN_TEXT_PATTERN = /[+-]?\d+(?:[.,]\d+)?/g;

function parseCoordinateNumber(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!NUMBER_PATTERN.test(normalized)) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isValidLatitude(latitude: number): boolean {
  return Number.isFinite(latitude) && latitude >= -90 && latitude <= 90;
}

export function isValidLongitude(longitude: number): boolean {
  return Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
}

export function isValidCoordinates(coordinates: Coordinates): boolean {
  return (
    isValidLatitude(coordinates.latitude) &&
    isValidLongitude(coordinates.longitude)
  );
}

export function parseManualCoordinates(
  latitudeText: string,
  longitudeText: string,
): Coordinates | null {
  const latitudeValue = latitudeText.trim();
  const longitudeValue = longitudeText.trim();

  if (latitudeValue && !longitudeValue) {
    const matches = latitudeValue.match(NUMBER_IN_TEXT_PATTERN) ?? [];
    if (matches.length >= 2) {
      const latitude = parseCoordinateNumber(matches[0] ?? "");
      const longitude = parseCoordinateNumber(matches[1] ?? "");

      if (
        latitude !== null &&
        longitude !== null &&
        isValidCoordinates({ latitude, longitude })
      ) {
        return { latitude, longitude };
      }
    }
  }

  const latitude = parseCoordinateNumber(latitudeValue);
  const longitude = parseCoordinateNumber(longitudeValue);

  if (
    latitude === null ||
    longitude === null ||
    !isValidCoordinates({ latitude, longitude })
  ) {
    return null;
  }

  return { latitude, longitude };
}

export function formatCoordinate(value: number, decimals = 6): string {
  return value.toFixed(decimals);
}
