export interface GoogleMapsLatLngLiteral {
  lat: number;
  lng: number;
}

export interface GoogleMapsLatLng {
  lat(): number;
  lng(): number;
}

export interface GoogleMapsMouseEvent {
  latLng?: GoogleMapsLatLng | null;
}

export interface GoogleMapsEventHandle {
  remove(): void;
}

export interface GoogleMapsPoint {
  new (x: number, y: number): unknown;
}

export interface GoogleMapsSize {
  new (width: number, height: number): unknown;
}

export interface GoogleMapsMap {
  setCenter(position: GoogleMapsLatLngLiteral | GoogleMapsLatLng): void;
  panTo(position: GoogleMapsLatLngLiteral | GoogleMapsLatLng): void;
  setZoom(zoom: number): void;
  addListener(
    eventName: "click",
    handler: (event: GoogleMapsMouseEvent) => void,
  ): GoogleMapsEventHandle;
}

export interface GoogleMapsMarker {
  setMap(map: GoogleMapsMap | null): void;
  setPosition(position: GoogleMapsLatLngLiteral): void;
  addListener(
    eventName: "dragend",
    handler: (event: GoogleMapsMouseEvent) => void,
  ): GoogleMapsEventHandle;
}

export type GoogleMapsPlacesStatus = "OK" | "ZERO_RESULTS" | string;

export interface GoogleMapsPlaceResult {
  geometry?: {
    location?: GoogleMapsLatLng | null;
  };
  name?: string;
  formatted_address?: string;
}

export interface GoogleMapsPlacesService {
  textSearch(
    request: {
      query: string;
      location?: GoogleMapsLatLngLiteral;
      radius?: number;
    },
    callback: (
      results: GoogleMapsPlaceResult[] | null,
      status: GoogleMapsPlacesStatus,
    ) => void,
  ): void;
}

export interface GoogleMapsGlobal {
  maps: {
    Map: new (
      element: HTMLElement,
      options: Record<string, unknown>,
    ) => GoogleMapsMap;
    Marker: new (options: Record<string, unknown>) => GoogleMapsMarker;
    Point?: GoogleMapsPoint;
    Size?: GoogleMapsSize;
    places?: {
      PlacesService: new (map: GoogleMapsMap) => GoogleMapsPlacesService;
      PlacesServiceStatus?: {
        OK?: string;
        ZERO_RESULTS?: string;
      };
    };
  };
}

declare global {
  interface Window {
    google?: GoogleMapsGlobal;
    __ruralConectaGoogleMapsReady?: () => void;
    __ruralConectaGoogleMapsPromise?: Promise<GoogleMapsGlobal>;
  }
}

export interface GoogleMapsConfig {
  apiKey: string;
  mapId?: string;
  language: "pt-BR";
  region: "BR";
}

export type GoogleMapsConfigResult =
  | { available: true; config: GoogleMapsConfig }
  | { available: false; reason: "missing-api-key" };

export const GOOGLE_MAPS_SCRIPT_ID = "rural-conecta-google-maps-js";
const GOOGLE_MAPS_CALLBACK = "__ruralConectaGoogleMapsReady";

export function createGoogleMapsConfig(
  apiKey: string | undefined = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY,
  mapId: string | undefined = import.meta.env.PUBLIC_GOOGLE_MAP_ID,
): GoogleMapsConfigResult {
  const normalizedApiKey = apiKey?.trim();

  if (!normalizedApiKey) {
    return { available: false, reason: "missing-api-key" };
  }

  const normalizedMapId = mapId?.trim();

  return {
    available: true,
    config: {
      apiKey: normalizedApiKey,
      mapId: normalizedMapId || undefined,
      language: "pt-BR",
      region: "BR",
    },
  };
}

export function hasGoogleMapsRuntime(
  win: Pick<Window, "google"> = window,
): boolean {
  return Boolean(win.google?.maps?.Map && win.google.maps.Marker);
}

export function createGoogleMapsScriptUrl(config: GoogleMapsConfig): string {
  const params = new URLSearchParams({
    key: config.apiKey,
    v: "weekly",
    loading: "async",
    callback: GOOGLE_MAPS_CALLBACK,
    libraries: "places,marker",
    language: config.language,
    region: config.region,
  });

  return `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
}

export function loadGoogleMaps(
  config: GoogleMapsConfig,
  doc: Document = document,
  win: Window = window,
): Promise<GoogleMapsGlobal> {
  if (hasGoogleMapsRuntime(win)) {
    return Promise.resolve(win.google as GoogleMapsGlobal);
  }

  if (win.__ruralConectaGoogleMapsPromise) {
    return win.__ruralConectaGoogleMapsPromise;
  }

  win.__ruralConectaGoogleMapsPromise = new Promise<GoogleMapsGlobal>(
    (resolve, reject) => {
      win.__ruralConectaGoogleMapsReady = () => {
        if (hasGoogleMapsRuntime(win)) {
          resolve(win.google as GoogleMapsGlobal);
          return;
        }

        reject(new Error("Google Maps runtime unavailable"));
      };

      const existingScript = doc.getElementById(GOOGLE_MAPS_SCRIPT_ID);
      if (existingScript) {
        return;
      }

      const script = doc.createElement("script");
      script.id = GOOGLE_MAPS_SCRIPT_ID;
      script.src = createGoogleMapsScriptUrl(config);
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        win.__ruralConectaGoogleMapsPromise = undefined;
        reject(new Error("Google Maps script failed"));
      };

      doc.head.append(script);
    },
  );

  return win.__ruralConectaGoogleMapsPromise;
}
