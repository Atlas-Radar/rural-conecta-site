export interface Coordinates {
  latitude: number;
  longitude: number;
}

type Axis = "latitude" | "longitude";
type Hemisphere = "N" | "S" | "E" | "W" | "O" | "L";

interface DmsToken {
  type: "number" | "hemisphere";
  value: string;
}

interface DmsCoordinate {
  value: number;
  axis: Axis | null;
}

const NUMBER_PATTERN = /^[+-]?\d+(?:[.,]\d+)?$/;
const NUMBER_IN_TEXT_PATTERN = /[+-]?\d+(?:[.,]\d+)?/g;
const DMS_TOKEN_PATTERN = /[+-]?\d+(?:[.,]\d+)?|\b[NSWEOL]\b/gi;

function parseCoordinateNumber(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!NUMBER_PATTERN.test(normalized)) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function isHemisphere(value: string): value is Hemisphere {
  return ["N", "S", "E", "W", "O", "L"].includes(value);
}

function hemisphereAxis(hemisphere: Hemisphere): Axis {
  return hemisphere === "N" || hemisphere === "S" ? "latitude" : "longitude";
}

function hemisphereSign(hemisphere: Hemisphere): 1 | -1 {
  return hemisphere === "S" || hemisphere === "W" || hemisphere === "O"
    ? -1
    : 1;
}

function tokenizeDmsText(text: string): DmsToken[] {
  const matches = text.match(DMS_TOKEN_PATTERN) ?? [];

  return matches.map((match) => {
    const upper = match.toUpperCase();
    if (isHemisphere(upper)) {
      return { type: "hemisphere", value: upper };
    }

    return { type: "number", value: match };
  });
}

function mergeHemispheres(
  prefix: Hemisphere | null,
  suffix: Hemisphere | null,
): Hemisphere | null {
  if (prefix && suffix && prefix !== suffix) {
    return null;
  }

  return prefix ?? suffix;
}

function parseDmsValue(
  degreeToken: string,
  minuteToken: string,
  secondToken: string,
  hemisphere: Hemisphere | null,
): number | null {
  const degrees = parseCoordinateNumber(degreeToken);
  const minutes = parseCoordinateNumber(minuteToken);
  const seconds = parseCoordinateNumber(secondToken);

  if (degrees === null || minutes === null || seconds === null) {
    return null;
  }

  if (minutes < 0 || minutes > 59 || seconds < 0 || seconds >= 60) {
    return null;
  }

  const explicitPositive = degreeToken.trim().startsWith("+");
  const explicitNegative = degreeToken.trim().startsWith("-");
  const direction = hemisphere
    ? hemisphereSign(hemisphere)
    : degrees < 0
      ? -1
      : 1;

  if (hemisphere && hemisphereSign(hemisphere) < 0 && explicitPositive) {
    return null;
  }

  if (hemisphere && hemisphereSign(hemisphere) > 0 && explicitNegative) {
    return null;
  }

  const decimal = Math.abs(degrees) + minutes / 60 + seconds / 3600;
  return direction * decimal;
}

function readDmsCoordinate(
  tokens: DmsToken[],
  startIndex: number,
): { coordinate: DmsCoordinate; nextIndex: number } | null {
  let index = startIndex;
  let prefix: Hemisphere | null = null;

  if (tokens[index]?.type === "hemisphere") {
    const value = tokens[index]?.value.toUpperCase();
    if (!value || !isHemisphere(value)) {
      return null;
    }
    prefix = value;
    index += 1;
  }

  const degree = tokens[index];
  const minute = tokens[index + 1];
  const second = tokens[index + 2];

  if (
    degree?.type !== "number" ||
    minute?.type !== "number" ||
    second?.type !== "number"
  ) {
    return null;
  }

  index += 3;

  let suffix: Hemisphere | null = null;
  if (tokens[index]?.type === "hemisphere") {
    const value = tokens[index]?.value.toUpperCase();
    if (!value || !isHemisphere(value)) {
      return null;
    }

    if (!prefix || value === prefix) {
      suffix = value;
      index += 1;
    }
  }

  const hemisphere = mergeHemispheres(prefix, suffix);
  if ((prefix || suffix) && !hemisphere) {
    return null;
  }

  const value = parseDmsValue(
    degree.value,
    minute.value,
    second.value,
    hemisphere,
  );
  if (value === null) {
    return null;
  }

  return {
    coordinate: {
      value,
      axis: hemisphere ? hemisphereAxis(hemisphere) : null,
    },
    nextIndex: index,
  };
}

function normalizeDmsPair(
  first: DmsCoordinate,
  second: DmsCoordinate,
): Coordinates | null {
  const latitudeCandidate =
    first.axis === "longitude" && second.axis === "latitude" ? second : first;
  const longitudeCandidate =
    first.axis === "longitude" && second.axis === "latitude" ? first : second;

  if (latitudeCandidate.axis && latitudeCandidate.axis !== "latitude") {
    return null;
  }

  if (longitudeCandidate.axis && longitudeCandidate.axis !== "longitude") {
    return null;
  }

  const coordinates = {
    latitude: latitudeCandidate.value,
    longitude: longitudeCandidate.value,
  };

  return isValidCoordinates(coordinates) ? coordinates : null;
}

function parseDmsCoordinates(text: string): Coordinates | null {
  const tokens = tokenizeDmsText(text);
  if (tokens.length < 6) {
    return null;
  }

  const coordinates: DmsCoordinate[] = [];
  let index = 0;

  while (index < tokens.length) {
    const parsed = readDmsCoordinate(tokens, index);
    if (!parsed) {
      return null;
    }

    coordinates.push(parsed.coordinate);
    index = parsed.nextIndex;
  }

  if (coordinates.length !== 2) {
    return null;
  }

  return normalizeDmsPair(coordinates[0], coordinates[1]);
}

function parseDecimalPair(text: string): Coordinates | null {
  const matches = text.match(NUMBER_IN_TEXT_PATTERN) ?? [];
  if (matches.length !== 2) {
    return null;
  }

  const latitude = parseCoordinateNumber(matches[0] ?? "");
  const longitude = parseCoordinateNumber(matches[1] ?? "");

  if (latitude === null || longitude === null) {
    return null;
  }

  const coordinates = { latitude, longitude };
  return isValidCoordinates(coordinates) ? coordinates : null;
}

function parseSingleCoordinate(
  text: string,
  expectedAxis: Axis,
): number | null {
  const value = text.trim();
  if (!value) {
    return null;
  }

  const decimalMatches = value.match(NUMBER_IN_TEXT_PATTERN) ?? [];
  const hemisphereMatches = value.match(/\b[NSWEOL]\b/gi) ?? [];

  if (decimalMatches.length === 1 && hemisphereMatches.length === 0) {
    return parseCoordinateNumber(decimalMatches[0] ?? "");
  }

  const dms = parseDmsCoordinates(
    `${value} ${expectedAxis === "latitude" ? "E 0 0 0" : "N 0 0 0"}`,
  );
  if (!dms) {
    return null;
  }

  return expectedAxis === "latitude" ? dms.latitude : dms.longitude;
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
  longitudeText = "",
): Coordinates | null {
  const latitudeValue = latitudeText.trim();
  const longitudeValue = longitudeText.trim();

  if (!latitudeValue) {
    return null;
  }

  if (longitudeValue) {
    const latitude = parseSingleCoordinate(latitudeValue, "latitude");
    const longitude = parseSingleCoordinate(longitudeValue, "longitude");

    if (latitude === null || longitude === null) {
      return null;
    }

    const coordinates = { latitude, longitude };
    return isValidCoordinates(coordinates) ? coordinates : null;
  }

  return parseDmsCoordinates(latitudeValue) ?? parseDecimalPair(latitudeValue);
}

export function formatCoordinate(value: number, decimals = 6): string {
  return value.toFixed(decimals);
}
