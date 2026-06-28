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
  createAvailabilityWhatsAppMessage,
  createWhatsAppUrl,
} from "../lib/availability/whatsapp";

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 300000,
};

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
      headers: {
        Accept: "application/json",
      },
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

function updateSubmitState(
  button: HTMLButtonElement,
  coordinates: Coordinates | null,
  helper: HTMLElement,
): void {
  const valid = coordinates !== null;
  button.disabled = !valid;

  if (!valid) {
    setText(
      helper,
      "Use sua localização ou preencha latitude e longitude para consultar a pré-análise.",
    );
  } else {
    setText(
      helper,
      `Coordenadas prontas para pré-análise: ${formatCoordinate(coordinates.latitude)}, ${formatCoordinate(coordinates.longitude)}.`,
    );
  }
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

function renderResult(
  panel: HTMLElement,
  title: HTMLElement,
  message: HTMLElement,
  link: HTMLAnchorElement,
  digits: string,
  regionName: string,
  result: NormalizedViabilityResult,
  coordinates: Coordinates | null,
): void {
  panel.hidden = false;
  panel.dataset.status = result.status;
  setText(title, result.title);
  setText(message, result.message);
  updateWhatsAppLink(link, digits, regionName, result, coordinates);
}

function initAvailability(root: HTMLElement): void {
  const regionSelect = queryRequired<HTMLSelectElement>(
    root,
    "[data-availability-region]",
  );
  const regionStatus = queryRequired<HTMLElement>(
    root,
    "[data-availability-region-status]",
  );
  const latitudeInput = queryRequired<HTMLInputElement>(
    root,
    "[data-availability-latitude]",
  );
  const longitudeInput = queryRequired<HTMLInputElement>(
    root,
    "[data-availability-longitude]",
  );
  const helper = queryRequired<HTMLElement>(root, "[data-availability-helper]");
  const submitButton = queryRequired<HTMLButtonElement>(
    root,
    "[data-availability-submit]",
  );
  const geolocationButton = queryRequired<HTMLButtonElement>(
    root,
    "[data-availability-method='gps']",
  );
  const searchButton = queryRequired<HTMLButtonElement>(
    root,
    "[data-availability-method='search']",
  );
  const mapButton = queryRequired<HTMLButtonElement>(
    root,
    "[data-availability-method='map']",
  );
  const coordinateButton = queryRequired<HTMLButtonElement>(
    root,
    "[data-availability-method='pin']",
  );
  const searchInput = queryRequired<HTMLInputElement>(
    root,
    "[data-availability-search]",
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
  const digits = root.dataset.whatsappDigits ?? "";
  let coordinates: Coordinates | null = parseManualCoordinates(
    latitudeInput.value,
    longitudeInput.value,
  );

  function syncCoordinatesFromInputs(): void {
    const parsed = parseManualCoordinates(
      latitudeInput.value,
      longitudeInput.value,
    );

    if (parsed && !longitudeInput.value.trim()) {
      latitudeInput.value = formatCoordinate(parsed.latitude);
      longitudeInput.value = formatCoordinate(parsed.longitude);
    }

    coordinates = parsed;
    updateSubmitState(submitButton, coordinates, helper);
  }

  function fillCoordinates(nextCoordinates: Coordinates): void {
    latitudeInput.value = formatCoordinate(nextCoordinates.latitude);
    longitudeInput.value = formatCoordinate(nextCoordinates.longitude);
    coordinates = nextCoordinates;
    updateSubmitState(submitButton, coordinates, helper);
  }

  latitudeInput.addEventListener("input", syncCoordinatesFromInputs);
  longitudeInput.addEventListener("input", syncCoordinatesFromInputs);

  geolocationButton.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
      setText(
        helper,
        "Seu navegador não informou a localização. Você pode preencher coordenadas ou seguir pelo WhatsApp.",
      );
      return;
    }

    geolocationButton.disabled = true;
    setText(helper, "Solicitando localização do navegador...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fillCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setText(
          helper,
          "Localização recebida. Revise as coordenadas e consulte a pré-análise.",
        );
        geolocationButton.disabled = false;
      },
      () => {
        setText(
          helper,
          "Não foi possível acessar sua localização. Você pode informar coordenadas ou falar pelo WhatsApp.",
        );
        geolocationButton.disabled = false;
      },
      GEOLOCATION_OPTIONS,
    );
  });

  searchButton.addEventListener("click", () => {
    searchInput.focus();
    setText(
      helper,
      "Nesta versão, a consulta automática por fazenda ou referência ainda precisa de coordenadas.",
    );
  });

  mapButton.addEventListener("click", () => {
    setText(
      helper,
      "O mapa entra em uma próxima etapa. Por enquanto, use sua localização, coordenadas ou WhatsApp.",
    );
  });

  coordinateButton.addEventListener("click", () => {
    latitudeInput.focus();
    setText(
      helper,
      "Informe latitude e longitude em decimal. Você também pode colar o par no campo de latitude.",
    );
  });

  submitButton.addEventListener("click", async () => {
    syncCoordinatesFromInputs();

    if (!coordinates) {
      updateSubmitState(submitButton, coordinates, helper);
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Consultando pré-análise...";
    setText(helper, "Consultando pré-análise...");

    try {
      const response = await fetch(VIABILITY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        digits,
        regionSelect.value,
        result,
        coordinates,
      );
      setText(helper, result.message);
    } finally {
      submitButton.textContent = "Consultar pré-análise";
      updateSubmitState(submitButton, coordinates, helper);
    }
  });

  void loadRegions(regionSelect, regionStatus);
  updateSubmitState(submitButton, coordinates, helper);
}

for (const root of document.querySelectorAll<HTMLElement>(
  "[data-availability-root]",
)) {
  initAvailability(root);
}
