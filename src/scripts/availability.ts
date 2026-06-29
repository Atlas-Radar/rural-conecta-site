import {
  REGIONS_ENDPOINT,
  VIABILITY_ENDPOINT,
  buildViabilityPayload,
} from "../lib/availability/api";
import type { Coordinates } from "../lib/availability/coordinates";
import {
  formatCoordinate,
  parseManualCoordinates,
} from "../lib/availability/coordinates";
import {
  type AvailabilityRegion,
  type NormalizedViabilityResult,
  normalizeRegionsResponse,
  normalizeViabilityError,
  normalizeViabilityResponse,
} from "../lib/availability/normalizers";
import {
  type GoogleMapsConfig,
  type GoogleMapsGlobal,
  type GoogleMapsLatLng,
  type GoogleMapsLatLngLiteral,
  type GoogleMapsMap,
  type GoogleMapsMarker,
  type GoogleMapsPlacesService,
  createGoogleMapsConfig,
  hasGoogleMapsRuntime,
  loadGoogleMaps,
} from "../lib/availability/maps";
import {
  createAvailabilityWhatsAppMessage,
  createWhatsAppUrl,
} from "../lib/availability/whatsapp";

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 300000,
};

const DEFAULT_MAP_CENTER: Coordinates = {
  latitude: -16.448694,
  longitude: -46.906306,
};
const DEFAULT_MAP_ZOOM = 12;
const SELECTED_MAP_ZOOM = 16;

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

type MapState = "idle" | "loading" | "ready" | "unavailable";

function queryRequired<T extends Element>(
  root: ParentNode,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Elemento de disponibilidade não encontrado: ${selector}`);
  }
  return element;
}

function setText(element: HTMLElement, text: string): void {
  element.textContent = text;
}

function getFallbackRegions(select: HTMLSelectElement): AvailabilityRegion[] {
  return Array.from(select.options)
    .map((option) => option.textContent?.trim() ?? "")
    .filter(Boolean)
    .map((name) => ({ name }));
}

function renderRegions(
  select: HTMLSelectElement,
  regions: AvailabilityRegion[],
): void {
  select.replaceChildren();

  for (const region of regions) {
    const option = document.createElement("option");
    option.value = region.name;
    option.textContent = region.name;
    select.append(option);
  }
}

async function readJsonSafely(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

async function loadRegions(
  select: HTMLSelectElement,
  status: HTMLElement,
): Promise<void> {
  const fallbackRegions = getFallbackRegions(select);

  select.disabled = true;
  setText(status, "Carregando possíveis regiões...");

  try {
    const response = await fetch(REGIONS_ENDPOINT, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const data = await readJsonSafely(response);

    if (!response.ok) {
      throw new Error("Regions request failed");
    }

    const regions = normalizeRegionsResponse(data);
    if (regions.length === 0) {
      throw new Error("Empty regions response");
    }

    renderRegions(select, regions);
    setText(
      status,
      "Regiões carregadas da API pública como possíveis localidades.",
    );
  } catch {
    renderRegions(select, fallbackRegions);
    setText(
      status,
      "Não foi possível carregar as regiões agora. Você ainda pode informar coordenadas ou falar pelo WhatsApp.",
    );
  } finally {
    select.disabled = false;
  }
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter((element) => !element.hidden)
    .filter((element) => element.getAttribute("aria-hidden") !== "true");
}

function updateSubmitState(
  button: HTMLButtonElement,
  coordinates: Coordinates | null,
  helper: HTMLElement,
  rawCoordinates: string,
  isSubmitting: boolean,
): void {
  button.disabled = isSubmitting || coordinates === null;

  if (isSubmitting) {
    return;
  }

  if (coordinates) {
    setText(
      helper,
      `Coordenadas prontas: ${formatCoordinate(coordinates.latitude)}, ${formatCoordinate(coordinates.longitude)}.`,
    );
    return;
  }

  if (rawCoordinates.trim()) {
    setText(
      helper,
      "Não reconhecemos coordenadas válidas. Use DD, DMS ou lat,lng no mesmo campo.",
    );
    return;
  }

  setText(
    helper,
    "Informe o ponto da propriedade. Use localização em tempo real ou coordenadas.",
  );
}

function updateWhatsAppLink(
  link: HTMLAnchorElement,
  digits: string,
  regionName: string,
  result: NormalizedViabilityResult,
  coordinates: Coordinates | null,
): void {
  const message = createAvailabilityWhatsAppMessage({
    regionName,
    resultMessage: result.message,
    coordinates: coordinates ?? undefined,
  });

  link.href = createWhatsAppUrl(digits, message);
  link.textContent = result.whatsappLabel;
}

function renderLoadingResult(
  panel: HTMLElement,
  title: HTMLElement,
  message: HTMLElement,
  link: HTMLAnchorElement,
  editButton: HTMLButtonElement,
): void {
  panel.hidden = false;
  panel.dataset.status = "loading";
  link.hidden = true;
  editButton.hidden = true;
  setText(title, "Consultando pré-análise...");
  setText(
    message,
    "Aguarde enquanto verificamos somente latitude e longitude.",
  );
}

function renderResult(
  panel: HTMLElement,
  title: HTMLElement,
  message: HTMLElement,
  link: HTMLAnchorElement,
  editButton: HTMLButtonElement,
  digits: string,
  regionName: string,
  result: NormalizedViabilityResult,
  coordinates: Coordinates | null,
): void {
  panel.hidden = false;
  panel.dataset.status = result.status;
  link.hidden = false;
  editButton.hidden = false;
  setText(title, result.title);
  setText(message, result.message);
  updateWhatsAppLink(link, digits, regionName, result, coordinates);
}

function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  if (error.code === 1) {
    return "Permissão negada. Informe coordenadas ou continue pelo WhatsApp para avaliação manual.";
  }

  if (error.code === 3) {
    return "A localização demorou para responder. Tente novamente, informe coordenadas ou siga pelo WhatsApp.";
  }

  return "Localização indisponível agora. Use coordenadas ou fale pelo WhatsApp.";
}

function toLatLngLiteral(coordinates: Coordinates): GoogleMapsLatLngLiteral {
  return { lat: coordinates.latitude, lng: coordinates.longitude };
}

function latLngToCoordinates(latLng: GoogleMapsLatLng): Coordinates {
  return { latitude: latLng.lat(), longitude: latLng.lng() };
}

function formatMapCoordinates(coordinates: Coordinates): string {
  return `${formatCoordinate(coordinates.latitude)}, ${formatCoordinate(coordinates.longitude)}`;
}

function createGpsMarkerIcon(
  googleMaps: GoogleMapsGlobal,
): Record<string, unknown> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 48"><path fill="#63D43B" stroke="#020B0C" stroke-width="3" d="M21 3c-8.8 0-16 7.1-16 15.9 0 11.4 16 26.1 16 26.1s16-14.7 16-26.1C37 10.1 29.8 3 21 3Z"/><circle cx="21" cy="19" r="6.2" fill="#F5F7F3"/><circle cx="21" cy="19" r="2.6" fill="#020B0C"/></svg>`;
  const icon: Record<string, unknown> = {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
  };

  if (googleMaps.maps.Size) {
    icon.scaledSize = new googleMaps.maps.Size(42, 48);
  }

  if (googleMaps.maps.Point) {
    icon.anchor = new googleMaps.maps.Point(21, 45);
  }

  return icon;
}

function initAvailability(root: HTMLElement): void {
  const modal = queryRequired<HTMLDialogElement>(
    root,
    "[data-availability-modal]",
  );
  const regionSelect = queryRequired<HTMLSelectElement>(
    root,
    "[data-availability-region]",
  );
  const regionStatus = queryRequired<HTMLElement>(
    root,
    "[data-availability-region-status]",
  );
  const coordinatesInput = queryRequired<HTMLInputElement>(
    root,
    "[data-availability-coordinates]",
  );
  const helper = queryRequired<HTMLElement>(root, "[data-availability-helper]");
  const submitButton = queryRequired<HTMLButtonElement>(
    root,
    "[data-availability-submit]",
  );
  const submitLabel = queryRequired<HTMLElement>(submitButton, "span");
  const realtimeButton = queryRequired<HTMLButtonElement>(
    root,
    "[data-availability-realtime-location]",
  );
  const realtimeLabel = queryRequired<HTMLElement>(
    realtimeButton,
    "[data-availability-realtime-label]",
  );
  const mapCanvas = queryRequired<HTMLElement>(
    root,
    "[data-availability-map-canvas]",
  );
  const mapStatus = queryRequired<HTMLElement>(
    root,
    "[data-availability-map-status]",
  );
  const mapFallback = queryRequired<HTMLElement>(
    root,
    "[data-availability-map-fallback]",
  );
  const mapFallbackMessage = queryRequired<HTMLElement>(
    root,
    "[data-availability-map-fallback-message]",
  );
  const mapSearchInput = queryRequired<HTMLInputElement>(
    root,
    "[data-availability-map-search]",
  );
  const mapSearchButton = queryRequired<HTMLButtonElement>(
    root,
    "[data-availability-map-search-button]",
  );
  const mapConfirmButton = queryRequired<HTMLButtonElement>(
    root,
    "[data-availability-map-confirm]",
  );
  const mapSelectedTitle = queryRequired<HTMLElement>(
    root,
    "[data-availability-map-selected-title]",
  );
  const mapSelectedCoordinates = queryRequired<HTMLElement>(
    root,
    "[data-availability-map-selected-coordinates]",
  );
  const mapRetryButton = queryRequired<HTMLButtonElement>(
    root,
    "[data-availability-map-retry]",
  );
  const mapUseGpsButton = queryRequired<HTMLButtonElement>(
    root,
    "[data-availability-map-use-gps]",
  );
  const mapUseCoordinatesButton = queryRequired<HTMLButtonElement>(
    root,
    "[data-availability-map-use-coordinates]",
  );
  const resultPanel = queryRequired<HTMLElement>(
    root,
    "[data-availability-result]",
  );
  const resultTitle = queryRequired<HTMLElement>(
    root,
    "[data-availability-result-title]",
  );
  const resultMessage = queryRequired<HTMLElement>(
    root,
    "[data-availability-result-message]",
  );
  const resultLink = queryRequired<HTMLAnchorElement>(
    root,
    "[data-availability-whatsapp]",
  );
  const editButton = queryRequired<HTMLButtonElement>(
    root,
    "[data-availability-edit]",
  );
  const digits = root.dataset.whatsappDigits ?? "";
  const defaultRealtimeLabel =
    realtimeLabel.textContent?.trim() ?? "Pegar localização em tempo real";
  const defaultSubmitLabel =
    submitLabel.textContent?.trim() ?? "Consultar pré-análise";

  let coordinates: Coordinates | null = parseManualCoordinates(
    coordinatesInput.value,
  );
  let opener: HTMLElement | null = null;
  let regionsLoaded = false;
  let isSubmitting = false;
  let mapState: MapState = "idle";
  let googleMaps: GoogleMapsGlobal | null = null;
  let googleMapsConfig: GoogleMapsConfig | null = null;
  let map: GoogleMapsMap | null = null;
  let marker: GoogleMapsMarker | null = null;
  let placesService: GoogleMapsPlacesService | null = null;
  let pendingMapCoordinates: Coordinates | null = null;
  let mapLoadPromise: Promise<void> | null = null;

  function syncCoordinatesFromInput(): void {
    coordinates = parseManualCoordinates(coordinatesInput.value);
    updateSubmitState(
      submitButton,
      coordinates,
      helper,
      coordinatesInput.value,
      isSubmitting,
    );
  }

  function fillCoordinates(nextCoordinates: Coordinates): void {
    coordinatesInput.value = formatMapCoordinates(nextCoordinates);
    coordinates = nextCoordinates;
    updateSubmitState(
      submitButton,
      coordinates,
      helper,
      coordinatesInput.value,
      isSubmitting,
    );
  }

  function ensureRegionsLoaded(): void {
    if (regionsLoaded) {
      return;
    }

    regionsLoaded = true;
    void loadRegions(regionSelect, regionStatus);
  }

  function setMapLoading(): void {
    mapState = "loading";
    mapCanvas.hidden = false;
    mapFallback.hidden = true;
    mapSearchButton.disabled = true;
    setText(mapStatus, "Carregando Google Maps para escolher o ponto...");
  }

  function setMapReady(message: string): void {
    mapState = "ready";
    mapCanvas.hidden = false;
    mapFallback.hidden = true;
    mapSearchButton.disabled = false;
    setText(mapStatus, message);
  }

  function setMapUnavailable(message: string): void {
    mapState = "unavailable";
    mapCanvas.hidden = true;
    mapFallback.hidden = false;
    mapSearchButton.disabled = true;
    setText(
      mapStatus,
      "Mapa indisponível. GPS, coordenadas e WhatsApp continuam disponíveis.",
    );
    setText(mapFallbackMessage, message);
  }

  function renderSelectedMapPoint(
    nextCoordinates: Coordinates | null,
    title = "Toque no mapa para marcar",
  ): void {
    pendingMapCoordinates = nextCoordinates;
    mapConfirmButton.disabled = nextCoordinates === null;
    setText(mapSelectedTitle, title);
    setText(
      mapSelectedCoordinates,
      nextCoordinates
        ? formatMapCoordinates(nextCoordinates)
        : "Nenhum ponto confirmado ainda.",
    );
  }

  function updateMarker(nextCoordinates: Coordinates): void {
    if (!googleMaps || !map) {
      return;
    }

    if (!marker) {
      marker = new googleMaps.maps.Marker({
        map,
        position: toLatLngLiteral(nextCoordinates),
        draggable: true,
        title: "Ponto escolhido para pré-análise",
        icon: createGpsMarkerIcon(googleMaps),
      });
      marker.addListener("dragend", (event) => {
        if (!event.latLng) {
          return;
        }

        const draggedCoordinates = latLngToCoordinates(event.latLng);
        renderSelectedMapPoint(draggedCoordinates, "Marcador reposicionado");
        updateMarker(draggedCoordinates);
        setText(
          mapStatus,
          "Marcador reposicionado. Confirme o ponto antes de consultar.",
        );
      });
      return;
    }

    marker.setPosition(toLatLngLiteral(nextCoordinates));
  }

  function selectMapPoint(nextCoordinates: Coordinates, title: string): void {
    renderSelectedMapPoint(nextCoordinates, title);
    updateMarker(nextCoordinates);

    if (map) {
      map.panTo(toLatLngLiteral(nextCoordinates));
      map.setZoom(SELECTED_MAP_ZOOM);
    }
  }

  function initializeMap(): void {
    if (!googleMaps || map) {
      return;
    }

    const initialCoordinates = coordinates ?? DEFAULT_MAP_CENTER;
    const mapOptions: Record<string, unknown> = {
      center: toLatLngLiteral(initialCoordinates),
      zoom: coordinates ? SELECTED_MAP_ZOOM : DEFAULT_MAP_ZOOM,
      disableDefaultUI: false,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      clickableIcons: false,
      gestureHandling: "greedy",
    };

    if (googleMapsConfig?.mapId) {
      mapOptions.mapId = googleMapsConfig.mapId;
    }

    map = new googleMaps.maps.Map(mapCanvas, mapOptions);
    placesService = googleMaps.maps.places?.PlacesService
      ? new googleMaps.maps.places.PlacesService(map)
      : null;

    map.addListener("click", (event) => {
      if (!event.latLng) {
        return;
      }

      selectMapPoint(
        latLngToCoordinates(event.latLng),
        "Ponto marcado no mapa",
      );
      setText(
        mapStatus,
        "Ponto marcado. Use Confirmar este ponto para preencher a consulta.",
      );
    });

    if (coordinates) {
      selectMapPoint(coordinates, "Ponto atual carregado no mapa");
    }
  }

  async function ensureMapLoaded(): Promise<void> {
    if (mapState === "ready") {
      return;
    }

    if (mapLoadPromise) {
      return mapLoadPromise;
    }

    mapLoadPromise = (async () => {
      const configResult = createGoogleMapsConfig();
      if (!configResult.available && !hasGoogleMapsRuntime()) {
        setMapUnavailable(
          "PUBLIC_GOOGLE_MAPS_API_KEY não está configurada. Você ainda pode usar GPS, informar coordenadas ou seguir pelo WhatsApp.",
        );
        return;
      }

      setMapLoading();

      try {
        googleMapsConfig = configResult.available ? configResult.config : null;
        googleMaps = await loadGoogleMaps(
          googleMapsConfig ?? {
            apiKey: "runtime-already-available",
            language: "pt-BR",
            region: "BR",
          },
        );
        initializeMap();
        setMapReady(
          placesService
            ? "Mapa pronto. Pesquise uma referência ou toque no mapa para marcar."
            : "Mapa pronto. Toque no mapa para marcar; busca indisponível neste carregamento.",
        );
      } catch {
        setMapUnavailable(
          "Não foi possível carregar o Google Maps agora. GPS, coordenadas manuais e WhatsApp continuam funcionando.",
        );
      } finally {
        mapLoadPromise = null;
      }
    })();

    return mapLoadPromise;
  }
  async function searchPlace(): Promise<void> {
    const query = mapSearchInput.value.trim();
    if (!query) {
      setText(
        mapStatus,
        "Digite uma fazenda, comunidade, estrada ou referência para pesquisar.",
      );
      mapSearchInput.focus();
      return;
    }

    await ensureMapLoaded();

    if (mapState !== "ready" || !placesService || !map) {
      setText(
        mapStatus,
        "Busca indisponível agora. Você ainda pode usar GPS ou coordenadas.",
      );
      return;
    }

    const activeMap = map;

    mapSearchButton.disabled = true;
    setText(mapStatus, "Buscando referência no Google Maps...");

    placesService.textSearch(
      {
        query,
        location: toLatLngLiteral(coordinates ?? DEFAULT_MAP_CENTER),
        radius: 60000,
      },
      (results, status) => {
        mapSearchButton.disabled = false;
        const firstResult = results?.find(
          (result) => result.geometry?.location,
        );

        if (status !== "OK" || !firstResult?.geometry?.location) {
          setText(
            mapStatus,
            "Não encontramos esse local. Tente outra referência ou toque diretamente no mapa.",
          );
          return;
        }

        const foundCoordinates = latLngToCoordinates(
          firstResult.geometry.location,
        );
        activeMap.setCenter(firstResult.geometry.location);
        activeMap.setZoom(SELECTED_MAP_ZOOM);
        selectMapPoint(foundCoordinates, "Resultado localizado no mapa");
        setText(
          mapStatus,
          "Resultado encontrado. Confira o ponto e confirme antes de consultar.",
        );
      },
    );
  }

  function restoreFocus(): void {
    if (opener?.isConnected) {
      opener.focus({ preventScroll: true });
    }
    opener = null;
  }

  function afterClose(): void {
    document.body.classList.remove("availability-modal-is-open");
    restoreFocus();
  }

  function closeModal(): void {
    if (!modal.open) {
      return;
    }

    if (typeof modal.close === "function") {
      modal.close();
      return;
    }

    modal.removeAttribute("open");
    afterClose();
  }

  function openModal(trigger: HTMLElement): void {
    opener = trigger;

    if (typeof modal.showModal === "function" && !modal.open) {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }

    document.body.classList.add("availability-modal-is-open");
    ensureRegionsLoaded();
    void ensureMapLoaded();
    window.setTimeout(() => modal.focus({ preventScroll: true }), 0);
  }

  function trapFocus(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableElements(modal);
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (!first || !last) {
      event.preventDefault();
      modal.focus({ preventScroll: true });
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const trigger = target.closest<HTMLElement>(
      "[data-availability-modal-open]",
    );
    if (!trigger) {
      return;
    }

    event.preventDefault();
    trigger.closest("details")?.removeAttribute("open");
    openModal(trigger);
  });

  for (const closeButton of root.querySelectorAll<HTMLButtonElement>(
    "[data-availability-modal-close]",
  )) {
    closeButton.addEventListener("click", closeModal);
  }

  modal.addEventListener("close", afterClose);
  modal.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeModal();
  });
  modal.addEventListener("keydown", trapFocus);

  coordinatesInput.addEventListener("input", () => {
    syncCoordinatesFromInput();
    if (coordinates && mapState === "ready") {
      selectMapPoint(coordinates, "Coordenadas manuais no mapa");
      setText(mapStatus, "Coordenadas manuais carregadas no mapa.");
    }
  });

  realtimeButton.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
      setText(
        helper,
        "Seu navegador não informou localização. Informe coordenadas ou siga pelo WhatsApp.",
      );
      return;
    }

    realtimeButton.disabled = true;
    setText(realtimeLabel, "Solicitando localização em tempo real...");
    setText(helper, "Solicitando localização em tempo real...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        fillCoordinates(nextCoordinates);
        if (mapState === "ready") {
          selectMapPoint(nextCoordinates, "Localização recebida pelo GPS");
          setText(
            mapStatus,
            "GPS recebido. Confirme o ponto no mapa se quiser ajustar.",
          );
        }
        setText(helper, "Localização recebida.");
        setText(realtimeLabel, defaultRealtimeLabel);
        realtimeButton.disabled = false;
      },
      (error) => {
        setText(helper, getGeolocationErrorMessage(error));
        setText(realtimeLabel, defaultRealtimeLabel);
        realtimeButton.disabled = false;
      },
      GEOLOCATION_OPTIONS,
    );
  });

  for (const action of root.querySelectorAll<HTMLButtonElement>(
    "[data-availability-action]",
  )) {
    action.addEventListener("click", () => {
      const actionName = action.dataset.availabilityAction;

      if (actionName === "search") {
        void ensureMapLoaded().then(() => {
          mapSearchInput.focus();
          setText(
            helper,
            "Pesquise uma fazenda, comunidade, estrada ou referência e confirme o ponto no mapa.",
          );
        });
        return;
      }

      if (actionName === "map") {
        void ensureMapLoaded().then(() => {
          mapCanvas.focus({ preventScroll: true });
          setText(
            helper,
            "Toque ou clique no mapa para marcar o ponto da propriedade.",
          );
        });
        return;
      }

      coordinatesInput.focus();
      setText(helper, "Informe DD ou DMS no campo de coordenadas.");
    });
  }

  mapSearchButton.addEventListener("click", () => {
    void searchPlace();
  });
  mapSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void searchPlace();
    }
  });
  mapConfirmButton.addEventListener("click", () => {
    if (!pendingMapCoordinates) {
      return;
    }

    fillCoordinates(pendingMapCoordinates);
    setText(
      helper,
      "Ponto confirmado pelo mapa. Agora você pode consultar a pré-análise.",
    );
    setText(mapStatus, "Ponto confirmado no formulário de coordenadas.");
  });
  mapRetryButton.addEventListener("click", () => {
    mapState = "idle";
    void ensureMapLoaded();
  });
  mapUseGpsButton.addEventListener("click", () => {
    realtimeButton.click();
  });
  mapUseCoordinatesButton.addEventListener("click", () => {
    coordinatesInput.focus();
    setText(helper, "Informe DD ou DMS no campo de coordenadas.");
  });

  editButton.addEventListener("click", () => {
    resultPanel.hidden = true;
    coordinatesInput.focus();
    setText(helper, "Edite as coordenadas e consulte outro ponto.");
  });

  submitButton.addEventListener("click", async () => {
    syncCoordinatesFromInput();

    if (!coordinates) {
      updateSubmitState(
        submitButton,
        coordinates,
        helper,
        coordinatesInput.value,
        isSubmitting,
      );
      return;
    }

    isSubmitting = true;
    submitButton.disabled = true;
    setText(submitLabel, "Consultando pré-análise...");
    setText(helper, "Consultando pré-análise...");
    renderLoadingResult(
      resultPanel,
      resultTitle,
      resultMessage,
      resultLink,
      editButton,
    );

    try {
      const response = await fetch(VIABILITY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildViabilityPayload(coordinates)),
      });
      const data = await readJsonSafely(response);
      const result = response.ok
        ? normalizeViabilityResponse(data)
        : normalizeViabilityError(response.status);

      renderResult(
        resultPanel,
        resultTitle,
        resultMessage,
        resultLink,
        editButton,
        digits,
        regionSelect.value,
        result,
        coordinates,
      );
      setText(helper, result.message);
    } catch {
      const result = normalizeViabilityError();
      renderResult(
        resultPanel,
        resultTitle,
        resultMessage,
        resultLink,
        editButton,
        digits,
        regionSelect.value,
        result,
        coordinates,
      );
      setText(helper, result.message);
    } finally {
      isSubmitting = false;
      setText(submitLabel, defaultSubmitLabel);
      updateSubmitState(
        submitButton,
        coordinates,
        helper,
        coordinatesInput.value,
        isSubmitting,
      );
      resultPanel.scrollIntoView({ block: "nearest" });
    }
  });

  renderSelectedMapPoint(null);
  updateSubmitState(
    submitButton,
    coordinates,
    helper,
    coordinatesInput.value,
    isSubmitting,
  );
}

for (const root of document.querySelectorAll<HTMLElement>(
  "[data-availability-root]",
)) {
  initAvailability(root);
}
