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

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

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
    coordinatesInput.value = `${formatCoordinate(nextCoordinates.latitude)}, ${formatCoordinate(nextCoordinates.longitude)}`;
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

  coordinatesInput.addEventListener("input", syncCoordinatesFromInput);

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
        fillCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
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
        setText(
          helper,
          "Busca por fazenda ou local entra na próxima onda. Nesta etapa, confirme o ponto por coordenadas.",
        );
        return;
      }

      if (actionName === "map") {
        setText(
          helper,
          "Escolher no mapa entra na próxima onda. Nenhum Google Maps foi carregado agora.",
        );
        return;
      }

      coordinatesInput.focus();
      setText(helper, "Informe DD ou DMS no campo de coordenadas.");
    });
  }

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
