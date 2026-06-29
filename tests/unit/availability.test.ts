import { describe, expect, it } from "vitest";

import {
  DEFAULT_API_BASE_URL,
  buildViabilityPayload,
  createAvailabilityEndpoints,
  normalizeAtlasApiBaseUrl,
} from "../../src/lib/availability/api";
import {
  isValidLatitude,
  isValidLongitude,
  parseManualCoordinates,
} from "../../src/lib/availability/coordinates";
import {
  GOOGLE_MAPS_SCRIPT_ID,
  createGoogleMapsConfig,
  createGoogleMapsScriptUrl,
  hasGoogleMapsRuntime,
  loadGoogleMaps,
} from "../../src/lib/availability/maps";
import type { GoogleMapsGlobal } from "../../src/lib/availability/maps";
import {
  normalizeRegionsResponse,
  normalizeViabilityError,
  normalizeViabilityResponse,
} from "../../src/lib/availability/normalizers";
import {
  createAvailabilityWhatsAppMessage,
  createWhatsAppUrl,
} from "../../src/lib/availability/whatsapp";

describe("availability coordinates", () => {
  function expectParsedCoordinates(
    text: string,
    expected: { latitude: number; longitude: number },
  ): void {
    const coordinates = parseManualCoordinates(text);
    expect(coordinates).not.toBeNull();
    expect(coordinates?.latitude).toBeCloseTo(expected.latitude, 6);
    expect(coordinates?.longitude).toBeCloseTo(expected.longitude, 6);
  }

  it("validates latitude and longitude ranges", () => {
    expect(isValidLatitude(-16.448694)).toBe(true);
    expect(isValidLatitude(-91)).toBe(false);
    expect(isValidLatitude(91)).toBe(false);
    expect(isValidLongitude(-46.906306)).toBe(true);
    expect(isValidLongitude(-181)).toBe(false);
    expect(isValidLongitude(181)).toBe(false);
  });

  it("keeps compatibility with separate manual coordinate fields", () => {
    expect(parseManualCoordinates("-16.448694", "-46.906306")).toEqual({
      latitude: -16.448694,
      longitude: -46.906306,
    });
    expect(parseManualCoordinates("-16,448694", "-46,906306")).toEqual({
      latitude: -16.448694,
      longitude: -46.906306,
    });
  });

  it("parses required decimal degree formats from one field", () => {
    const expected = { latitude: -16.448694, longitude: -46.906306 };

    expectParsedCoordinates("-16.448694, -46.906306", expected);
    expectParsedCoordinates("-16.448694 -46.906306", expected);
    expectParsedCoordinates("lat: -16.448694, lng: -46.906306", expected);
    expectParsedCoordinates(
      "Latitude -16.448694 Longitude -46.906306",
      expected,
    );
    expectParsedCoordinates("-16,448694; -46,906306", expected);
    expectParsedCoordinates("-16,448694 -46,906306", expected);
  });

  it("parses required DMS formats from one field", () => {
    expectParsedCoordinates("16°26'55.3\"S, 46°54'22.7\"W", {
      latitude: -16.448694444444445,
      longitude: -46.90630555555556,
    });
    expectParsedCoordinates("16°26'55\"S, 46°54'23\"O", {
      latitude: -16.448611111111113,
      longitude: -46.906388888888884,
    });
    expectParsedCoordinates("16 26 55 S, 46 54 23 W", {
      latitude: -16.448611111111113,
      longitude: -46.906388888888884,
    });
    expectParsedCoordinates("S 16 26 55, O 46 54 23", {
      latitude: -16.448611111111113,
      longitude: -46.906388888888884,
    });
    expectParsedCoordinates("16° 26' 55\" S, 46° 54' 23\" O", {
      latitude: -16.448611111111113,
      longitude: -46.906388888888884,
    });
  });

  it("rejects invalid coordinate entries", () => {
    expect(parseManualCoordinates("91, -46.906306")).toBeNull();
    expect(parseManualCoordinates("-16.448694, -181")).toBeNull();
    expect(parseManualCoordinates("texto sem coordenadas")).toBeNull();
    expect(parseManualCoordinates("-16.448694")).toBeNull();
    expect(parseManualCoordinates("16 60 55 S, 46 54 23 W")).toBeNull();
    expect(parseManualCoordinates("16 26 60 S, 46 54 23 W")).toBeNull();
    expect(parseManualCoordinates("+16 26 55 S, 46 54 23 W")).toBeNull();
  });
});
describe("availability API normalization", () => {
  it("normalizes regions and ignores sensitive or extra fields", () => {
    const regions = normalizeRegionsResponse({
      total: 4,
      regioes: [
        {
          nome: "ROMILDA",
          fontes: ["fibra", "radio"],
          id: "internal-id",
          cto: "CTO-123",
          latitude: -16.4,
          longitude: -46.9,
          distancia: 120,
        },
        { nome: "romilda", fontes: ["fibra"] },
        { nome: "15 DE NOVEMBRO", fontes: ["fibra"] },
        { nome: "TORRE CENTRO", fontes: ["radio"] },
        { nome: "Repetidora Interna", fontes: ["radio"] },
        { nome: "", fontes: ["radio"] },
      ],
    });

    expect(regions).toEqual([{ name: "15 DE NOVEMBRO" }, { name: "ROMILDA" }]);
    expect(JSON.stringify(regions)).not.toContain("internal-id");
    expect(JSON.stringify(regions)).not.toContain("CTO");
    expect(JSON.stringify(regions)).not.toContain("TORRE");
    expect(JSON.stringify(regions)).not.toContain("Repetidora");
    expect(JSON.stringify(regions)).not.toContain("distancia");
  });

  it("uses production as fallback and builds local Atlas endpoints when configured", () => {
    expect(normalizeAtlasApiBaseUrl(undefined)).toBe(DEFAULT_API_BASE_URL);
    expect(normalizeAtlasApiBaseUrl("")).toBe(DEFAULT_API_BASE_URL);
    expect(normalizeAtlasApiBaseUrl(" http://localhost:3001/ ")).toBe(
      "http://localhost:3001",
    );

    expect(createAvailabilityEndpoints()).toEqual({
      regionsEndpoint: `${DEFAULT_API_BASE_URL}/api/public/regioes`,
      viabilityEndpoint: `${DEFAULT_API_BASE_URL}/api/public/viabilidade-basica`,
    });
    expect(createAvailabilityEndpoints("http://localhost:3001")).toEqual({
      regionsEndpoint: "http://localhost:3001/api/public/regioes",
      viabilityEndpoint: "http://localhost:3001/api/public/viabilidade-basica",
    });
  });
  it("builds a viability payload with only latitude and longitude", () => {
    expect(
      buildViabilityPayload({
        latitude: -16.448694,
        longitude: -46.906306,
      }),
    ).toEqual({
      latitude: -16.448694,
      longitude: -46.906306,
    });
  });

  it("normalizes positive, negative and confirmation responses", () => {
    expect(
      normalizeViabilityResponse({
        viavel: true,
        status: "pre_viavel",
        mensagem: "Encontramos indício de viabilidade para este endereço.",
      }),
    ).toMatchObject({
      kind: "positive",
      status: "pre_viavel",
      message: "Encontramos indício de viabilidade para este endereço.",
    });

    expect(
      normalizeViabilityResponse({
        viavel: false,
        status: "sem_viabilidade_automatica",
        mensagem:
          "Não identificamos viabilidade automática para este ponto. Nossa equipe pode avaliar manualmente.",
      }),
    ).toMatchObject({
      kind: "negative",
      status: "sem_viabilidade_automatica",
    });

    expect(
      normalizeViabilityResponse({
        status: "necessita_confirmacao",
        mensagem: "Nossa equipe precisa confirmar este ponto.",
      }),
    ).toMatchObject({
      kind: "confirmation",
      status: "necessita_confirmacao",
    });
  });

  it("normalizes 429 and 503 errors", () => {
    expect(normalizeViabilityError(429)).toMatchObject({
      kind: "rate-limit",
      status: "limite_excedido",
    });
    expect(normalizeViabilityError(503)).toMatchObject({
      kind: "temporary-error",
      status: "erro_temporario",
    });
  });
});

describe("availability WhatsApp", () => {
  it("generates a safe contextual WhatsApp message", () => {
    const message = createAvailabilityWhatsAppMessage({
      regionName: "ROMILDA",
      resultMessage: "Encontramos indício de viabilidade para este endereço.",
      coordinates: {
        latitude: -16.4486944,
        longitude: -46.9063064,
      },
    });

    expect(message).toContain("Possível região/localidade: ROMILDA");
    expect(message).toContain(
      "Resultado: Encontramos indício de viabilidade para este endereço.",
    );
    expect(message).toContain("Coordenadas informadas: -16.448694, -46.906306");
    expect(message).not.toMatch(/fibra|radio|torre|CTO|porta|distância/i);

    const url = createWhatsAppUrl("553897402599", message);
    expect(url).toContain("https://wa.me/553897402599?text=");
    expect(decodeURIComponent(url)).toContain(
      "Quero continuar o atendimento com a equipe.",
    );
  });
});
describe("availability Google Maps", () => {
  function createFakeGoogleMaps(): GoogleMapsGlobal {
    class FakeMap {
      setCenter(): void {}
      panTo(): void {}
      setZoom(): void {}
      addListener(): { remove(): void } {
        return { remove: () => {} };
      }
    }

    class FakeMarker {
      setMap(): void {}
      setPosition(): void {}
      addListener(): { remove(): void } {
        return { remove: () => {} };
      }
    }

    return {
      maps: {
        Map: FakeMap,
        Marker: FakeMarker,
      },
    };
  }

  function createFakeDocument() {
    const scripts: Array<Record<string, unknown>> = [];

    return {
      scripts,
      document: {
        getElementById: (id: string) =>
          scripts.find((script) => script.id === id) ?? null,
        createElement: (tagName: string) => ({ tagName }),
        head: {
          append: (script: Record<string, unknown>) => {
            scripts.push(script);
          },
        },
      } as unknown as Document,
    };
  }

  it("creates a safe public Maps config and reports missing API key", () => {
    expect(createGoogleMapsConfig(undefined)).toEqual({
      available: false,
      reason: "missing-api-key",
    });
    expect(createGoogleMapsConfig("  ")).toEqual({
      available: false,
      reason: "missing-api-key",
    });
    expect(createGoogleMapsConfig(" public-key ", " map-id ")).toEqual({
      available: true,
      config: {
        apiKey: "public-key",
        mapId: "map-id",
        language: "pt-BR",
        region: "BR",
      },
    });
  });

  it("builds the Maps script URL with only the approved lazy libraries", () => {
    const url = new URL(
      createGoogleMapsScriptUrl({
        apiKey: "public-key",
        language: "pt-BR",
        region: "BR",
      }),
    );

    expect(url.origin).toBe("https://maps.googleapis.com");
    expect(url.pathname).toBe("/maps/api/js");
    expect(url.searchParams.get("key")).toBe("public-key");
    expect(url.searchParams.get("libraries")).toBe("places,marker");
    expect(url.searchParams.get("loading")).toBe("async");
    expect(url.searchParams.get("callback")).toBe(
      "__ruralConectaGoogleMapsReady",
    );
  });

  it("detects a mocked Google Maps runtime", () => {
    expect(hasGoogleMapsRuntime({} as Window)).toBe(false);
    expect(
      hasGoogleMapsRuntime({ google: createFakeGoogleMaps() } as Window),
    ).toBe(true);
  });

  it("loads Google Maps idempotently without inserting duplicate scripts", async () => {
    const { document, scripts } = createFakeDocument();
    const win = {} as Window;
    const config = {
      apiKey: "public-key",
      language: "pt-BR" as const,
      region: "BR" as const,
    };

    const firstLoad = loadGoogleMaps(config, document, win);
    const secondLoad = loadGoogleMaps(config, document, win);

    expect(firstLoad).toBe(secondLoad);
    expect(scripts).toHaveLength(1);
    expect(scripts[0]?.id).toBe(GOOGLE_MAPS_SCRIPT_ID);

    win.google = createFakeGoogleMaps();
    win.__ruralConectaGoogleMapsReady?.();

    await expect(firstLoad).resolves.toBe(win.google);
    await expect(loadGoogleMaps(config, document, win)).resolves.toBe(
      win.google,
    );
    expect(scripts).toHaveLength(1);
  });
});
