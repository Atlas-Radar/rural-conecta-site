import { expect, test, type Page, type Route } from "@playwright/test";

const configuredAtlasApiBaseUrl = (
  (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.PUBLIC_ATLAS_API_BASE_URL ?? "https://atlassoftware.ia.br"
).replace(/\/+$/, "");
const defaultAtlasApiBaseUrl = "https://atlassoftware.ia.br";
const apiUrlPatterns = {
  regions: Array.from(
    new Set([
      `${configuredAtlasApiBaseUrl}/api/public/regioes`,
      `${defaultAtlasApiBaseUrl}/api/public/regioes`,
      "**/api/public/regioes",
    ]),
  ),
  viability: Array.from(
    new Set([
      `${configuredAtlasApiBaseUrl}/api/public/viabilidade-basica`,
      `${defaultAtlasApiBaseUrl}/api/public/viabilidade-basica`,
      "**/api/public/viabilidade-basica",
    ]),
  ),
};

type ViabilityPayload = {
  latitude: number;
  longitude: number;
};

type MockMapsWindow = Window & {
  __mapsMock?: {
    maps: Array<{
      center: { lat: number; lng: number };
      zoom: number;
      click(lat: number, lng: number): void;
    }>;
    markers: Array<{
      position: { lat: number; lng: number };
      dragEnd(lat: number, lng: number): void;
    }>;
    searches: Array<{ query: string }>;
  };
};

async function routeApi(
  page: Page,
  patterns: string[],
  handler: (route: Route) => Promise<void>,
): Promise<void> {
  for (const pattern of patterns) {
    await page.route(pattern, handler);
  }
}

async function mockRegions(page: Page): Promise<void> {
  await routeApi(page, apiUrlPatterns.regions, async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        total: 3,
        regioes: [
          { nome: "15 DE NOVEMBRO", fontes: ["fibra"] },
          { nome: "ROMILDA", fontes: ["fibra", "radio"] },
          { nome: "TORRE CENTRO", fontes: ["radio"] },
          { nome: "Repetidora Interna", fontes: ["radio"] },
        ],
      }),
    });
  });
}

async function mockViability(
  page: Page,
  handler: (route: Route) => Promise<void>,
): Promise<void> {
  await routeApi(page, apiUrlPatterns.viability, handler);
}

async function openAvailabilityModal(page: Page) {
  const trigger = page
    .locator(".site-hero")
    .getByRole("link", { name: "Verificar disponibilidade" });
  await trigger.click();

  const modal = page.getByRole("dialog", {
    name: "Pré-análise de disponibilidade",
  });
  await expect(modal).toBeVisible();
  return { modal, trigger };
}

async function fillCoordinates(page: Page, coordinates: string) {
  const modal = page.getByRole("dialog", {
    name: "Pré-análise de disponibilidade",
  });
  await modal.getByLabel("Coordenadas do ponto").fill(coordinates);
  return modal;
}

async function submitCoordinates(page: Page) {
  const modal = page.getByRole("dialog", {
    name: "Pré-análise de disponibilidade",
  });
  const submit = modal.getByRole("button", { name: /Consultar pré-análise/ });
  await expect(submit).toBeEnabled();
  await submit.click();
  return modal;
}

async function mockGeolocationSuccess(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const win = window as unknown as Window & { __geoCalls: number };
    win.__geoCalls = 0;

    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (success: PositionCallback) => {
          win.__geoCalls += 1;
          success({
            coords: {
              latitude: -16.448694,
              longitude: -46.906306,
              accuracy: 80,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: Date.now(),
          } as GeolocationPosition);
        },
      },
    });
  });
}

async function mockGeolocationDenied(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const win = window as unknown as Window & { __geoCalls: number };
    win.__geoCalls = 0;

    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (
          _success: PositionCallback,
          error?: PositionErrorCallback,
        ) => {
          win.__geoCalls += 1;
          error?.({
            code: 1,
            message: "Permission denied",
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
          } as GeolocationPositionError);
        },
      },
    });
  });
}

async function getGeolocationCalls(page: Page): Promise<number> {
  return page.evaluate(
    () => (window as Window & { __geoCalls?: number }).__geoCalls ?? 0,
  );
}
async function mockGoogleMapsRuntime(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const win = window as MockMapsWindow;

    class MockLatLng {
      constructor(
        private readonly latitude: number,
        private readonly longitude: number,
      ) {}

      lat(): number {
        return this.latitude;
      }

      lng(): number {
        return this.longitude;
      }
    }

    class MockMap {
      center: { lat: number; lng: number };
      zoom: number;
      private readonly listeners: Record<string, (event: unknown) => void> = {};

      constructor(_element: HTMLElement, options: Record<string, unknown>) {
        this.center = options.center as { lat: number; lng: number };
        this.zoom = Number(options.zoom ?? 12);
        win.__mapsMock?.maps.push(this);
      }

      setCenter(position: MockLatLng | { lat: number; lng: number }): void {
        this.center = readLatLng(position);
      }

      panTo(position: MockLatLng | { lat: number; lng: number }): void {
        this.center = readLatLng(position);
      }

      setZoom(zoom: number): void {
        this.zoom = zoom;
      }

      addListener(
        eventName: string,
        handler: (event: unknown) => void,
      ): { remove(): void } {
        this.listeners[eventName] = handler;
        return { remove: () => delete this.listeners[eventName] };
      }

      click(lat: number, lng: number): void {
        this.listeners.click?.({ latLng: new MockLatLng(lat, lng) });
      }
    }

    class MockMarker {
      position: { lat: number; lng: number };
      private readonly listeners: Record<string, (event: unknown) => void> = {};

      constructor(options: Record<string, unknown>) {
        this.position = options.position as { lat: number; lng: number };
        win.__mapsMock?.markers.push(this);
      }

      setMap(): void {}

      setPosition(position: { lat: number; lng: number }): void {
        this.position = position;
      }

      addListener(
        eventName: string,
        handler: (event: unknown) => void,
      ): { remove(): void } {
        this.listeners[eventName] = handler;
        return { remove: () => delete this.listeners[eventName] };
      }

      dragEnd(lat: number, lng: number): void {
        this.listeners.dragend?.({ latLng: new MockLatLng(lat, lng) });
      }
    }

    class MockPlacesService {
      textSearch(
        request: { query: string },
        callback: (
          results: Array<{ geometry: { location: MockLatLng } }>,
          status: string,
        ) => void,
      ): void {
        win.__mapsMock?.searches.push({ query: request.query });
        callback(
          [{ geometry: { location: new MockLatLng(-16.521111, -46.812222) } }],
          "OK",
        );
      }
    }

    function readLatLng(position: MockLatLng | { lat: number; lng: number }): {
      lat: number;
      lng: number;
    } {
      if (position instanceof MockLatLng) {
        return { lat: position.lat(), lng: position.lng() };
      }

      return position;
    }

    win.__mapsMock = { maps: [], markers: [], searches: [] };
    const mapsRuntime = {
      maps: {
        Map: MockMap,
        Marker: MockMarker,
        Point: class {},
        Size: class {},
        places: {
          PlacesService: MockPlacesService,
          PlacesServiceStatus: { OK: "OK", ZERO_RESULTS: "ZERO_RESULTS" },
        },
      },
    };
    win.google = mapsRuntime as unknown as typeof win.google;
  });
}

async function clickMockMap(
  page: Page,
  latitude: number,
  longitude: number,
): Promise<void> {
  await page.evaluate(
    ([lat, lng]) => {
      const win = window as MockMapsWindow;
      win.__mapsMock?.maps.at(-1)?.click(lat, lng);
    },
    [latitude, longitude],
  );
}

test.describe("Disponibilidade Onda 5", () => {
  test("página carrega com modal fechado e abre por CTA do hero", async ({
    page,
  }) => {
    await mockRegions(page);
    await page.goto("/");

    await expect(page.locator("[data-availability-modal]")).toBeHidden();

    const { modal } = await openAvailabilityModal(page);
    await expect(modal).toHaveAttribute("aria-modal", "true");
    await expect(
      modal.getByRole("heading", { name: "Pré-análise de disponibilidade" }),
    ).toBeVisible();
  });

  test("botão fechar, Escape e restauração de foco funcionam", async ({
    page,
  }) => {
    await mockRegions(page);
    await page.goto("/");

    const { modal, trigger } = await openAvailabilityModal(page);
    await modal.getByRole("button", { name: "Fechar pré-análise" }).click();
    await expect(modal).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(modal).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("regiões mockadas carregam no select dentro do modal", async ({
    page,
  }) => {
    await mockRegions(page);
    await page.goto("/");
    const { modal } = await openAvailabilityModal(page);

    await expect(
      modal.getByText(
        "Regiões carregadas da API pública como possíveis localidades.",
      ),
    ).toBeVisible();
    await expect(modal.getByLabel("Possível região/localidade")).toContainText(
      "15 DE NOVEMBRO",
    );
    await expect(modal.getByLabel("Possível região/localidade")).toContainText(
      "ROMILDA",
    );
    await expect(
      modal.getByLabel("Possível região/localidade"),
    ).not.toContainText(/TORRE|Repetidora/i);
  });

  test("campo único DD habilita consulta e POST envia somente latitude e longitude", async ({
    page,
  }) => {
    await mockRegions(page);

    let postedPayload: unknown = null;
    await mockViability(page, async (route) => {
      postedPayload = route.request().postDataJSON();
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          viavel: true,
          status: "pre_viavel",
          mensagem: "Encontramos indício de viabilidade para este endereço.",
          tecnologia: "fibra",
          torre: "TORRE INTERNA",
        }),
      });
    });

    await page.goto("/");
    await openAvailabilityModal(page);
    await fillCoordinates(page, "-16.448694, -46.906306");
    const modal = await submitCoordinates(page);

    await expect(
      modal.getByRole("heading", {
        name: "Encontramos indício de viabilidade",
      }),
    ).toBeVisible();
    expect(postedPayload).toEqual({
      latitude: -16.448694,
      longitude: -46.906306,
    });
  });

  test("campo único DMS habilita consulta e envia decimal", async ({
    page,
  }) => {
    await mockRegions(page);

    let postedPayload: ViabilityPayload | null = null;
    await mockViability(page, async (route) => {
      postedPayload = route.request().postDataJSON() as ViabilityPayload;
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          viavel: true,
          status: "pre_viavel",
          mensagem: "Encontramos indício de viabilidade para este endereço.",
        }),
      });
    });

    await page.goto("/");
    await openAvailabilityModal(page);
    await fillCoordinates(page, "16 26 55 S, 46 54 23 W");
    await submitCoordinates(page);

    expect(postedPayload).not.toBeNull();
    const payload = postedPayload as unknown as ViabilityPayload;
    expect(Object.keys(payload).sort()).toEqual(["latitude", "longitude"]);
    expect(payload.latitude).toBeCloseTo(-16.448611, 6);
    expect(payload.longitude).toBeCloseTo(-46.906389, 6);
  });

  test("resultado positivo aparece dentro do modal e não na seção compacta", async ({
    page,
  }) => {
    await mockRegions(page);
    await mockViability(page, async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          viavel: true,
          status: "pre_viavel",
          mensagem: "Encontramos indício de viabilidade para este endereço.",
        }),
      });
    });

    await page.goto("/");
    await openAvailabilityModal(page);
    const modal = await fillCoordinates(page, "-16.448694, -46.906306");
    await modal.getByLabel("Possível região/localidade").selectOption({
      label: "ROMILDA",
    });
    await submitCoordinates(page);

    await expect(
      modal.getByRole("heading", {
        name: "Encontramos indício de viabilidade",
      }),
    ).toBeVisible();
    await expect(
      page
        .locator(".availability-preview__compact")
        .getByText("Encontramos indício de viabilidade"),
    ).toHaveCount(0);

    const whatsappHref = await modal
      .getByRole("link", { name: "Continuar pelo WhatsApp" })
      .getAttribute("href");
    expect(decodeURIComponent(whatsappHref ?? "")).toContain(
      "Possível região/localidade: ROMILDA",
    );
    expect(decodeURIComponent(whatsappHref ?? "")).toContain(
      "Coordenadas informadas: -16.448694, -46.906306",
    );
    expect(decodeURIComponent(whatsappHref ?? "")).not.toMatch(
      /fibra|radio|torre|CTO|porta|distância/i,
    );
  });

  test("resultado negativo aparece dentro do modal", async ({ page }) => {
    await mockRegions(page);
    await mockViability(page, async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          viavel: false,
          status: "sem_viabilidade_automatica",
          mensagem:
            "Não identificamos viabilidade automática para este ponto. Nossa equipe pode avaliar manualmente.",
        }),
      });
    });

    await page.goto("/");
    await openAvailabilityModal(page);
    const modal = await fillCoordinates(page, "-16.448694, -46.906306");
    await submitCoordinates(page);

    await expect(
      modal.getByRole("heading", {
        name: "Não identificamos viabilidade automática",
      }),
    ).toBeVisible();
    await expect(
      modal.getByRole("link", { name: "Solicitar avaliação manual" }),
    ).toBeVisible();
  });

  test("429, 503 e falha de rede permanecem com fallback público", async ({
    page,
  }) => {
    await mockRegions(page);
    await mockViability(page, async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ erro: "limite_excedido" }),
      });
    });

    await page.goto("/");
    await openAvailabilityModal(page);
    let modal = await fillCoordinates(page, "-16.448694, -46.906306");
    await submitCoordinates(page);
    await expect(modal.getByText("Limite de consultas atingido")).toBeVisible();

    await page.unrouteAll({ behavior: "ignoreErrors" });
    await mockRegions(page);
    await mockViability(page, async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ erro: "erro_temporario" }),
      });
    });
    await modal.getByRole("button", { name: "Editar coordenadas" }).click();
    await submitCoordinates(page);
    await expect(
      modal.getByText("Pré-análise indisponível agora"),
    ).toBeVisible();

    await page.unrouteAll({ behavior: "ignoreErrors" });
    await mockRegions(page);
    await mockViability(page, async (route) => {
      await route.abort("failed");
    });
    await modal.getByRole("button", { name: "Editar coordenadas" }).click();
    modal = await submitCoordinates(page);
    await expect(
      modal.getByText("Não foi possível verificar agora"),
    ).toBeVisible();
  });

  test("geolocation só é chamada após clique explícito e preenche o campo", async ({
    page,
  }) => {
    await mockGeolocationSuccess(page);
    await mockRegions(page);
    await page.goto("/");

    expect(await getGeolocationCalls(page)).toBe(0);
    const { modal } = await openAvailabilityModal(page);
    expect(await getGeolocationCalls(page)).toBe(0);

    await modal
      .getByRole("button", { name: /Pegar localização em tempo real/ })
      .click();

    expect(await getGeolocationCalls(page)).toBe(1);
    await expect(modal.getByLabel("Coordenadas do ponto")).toHaveValue(
      "-16.448694, -46.906306",
    );
    await expect(modal.getByText("Localização recebida.")).toBeVisible();
    await expect(
      modal.getByRole("button", { name: /Consultar pré-análise/ }),
    ).toBeEnabled();
  });

  test("permissão negada mostra fallback sem enviar POST", async ({ page }) => {
    await mockGeolocationDenied(page);
    await mockRegions(page);

    let postCount = 0;
    await mockViability(page, async (route) => {
      postCount += 1;
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ viavel: true, status: "pre_viavel" }),
      });
    });

    await page.goto("/");
    const { modal } = await openAvailabilityModal(page);
    await modal
      .getByRole("button", { name: /Pegar localização em tempo real/ })
      .click();

    await expect(modal.getByText(/Permissão negada/)).toBeVisible();
    await expect(
      modal.getByRole("button", { name: /Consultar pré-análise/ }),
    ).toBeDisabled();
    expect(postCount).toBe(0);
  });

  test("sem coordenadas não envia POST", async ({ page }) => {
    await mockRegions(page);

    let postCount = 0;
    await mockViability(page, async (route) => {
      postCount += 1;
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ viavel: true, status: "pre_viavel" }),
      });
    });

    await page.goto("/");
    const { modal } = await openAvailabilityModal(page);

    await expect(
      modal.getByRole("button", { name: /Consultar pré-análise/ }),
    ).toBeDisabled();
    expect(postCount).toBe(0);
  });

  test("não coleta dados pessoais e não usa name em input ou textarea", async ({
    page,
  }) => {
    await mockRegions(page);
    await page.goto("/");
    const { modal } = await openAvailabilityModal(page);

    await expect(page.getByLabel(/^Nome$/i)).toHaveCount(0);
    await expect(page.getByLabel(/^Telefone$/i)).toHaveCount(0);
    await expect(page.getByLabel(/^E-mail$/i)).toHaveCount(0);
    await expect(page.getByLabel(/^CPF$/i)).toHaveCount(0);
    await expect(page.locator("input[name], textarea[name]")).toHaveCount(0);
    await expect(modal).not.toContainText(
      /torre|CTO|rota|tecnologia provável/i,
    );
    await expect(
      page.locator(".site-header").getByRole("link", {
        name: /WhatsApp|Falar no WhatsApp/,
      }),
    ).toHaveCount(0);
  });

  test("landing inicial não carrega Maps e fallback aparece sem chave pública", async ({
    page,
  }) => {
    const forbiddenRequests: string[] = [];
    page.on("request", (request) => {
      const url = request.url();
      if (
        url.includes("maps.googleapis") ||
        url.includes("google.maps") ||
        url.includes("googletagmanager")
      ) {
        forbiddenRequests.push(url);
      }
    });

    await mockRegions(page);
    await page.goto("/");

    await expect(page.locator('script[src*="maps.googleapis"]')).toHaveCount(0);
    expect(forbiddenRequests).toEqual([]);

    const { modal } = await openAvailabilityModal(page);
    await expect(modal.getByLabel(/Buscar fazenda/)).toBeVisible();
    await expect(modal.getByText("Mapa indisponível agora")).toBeVisible();
    await expect(
      modal.getByText(/PUBLIC_GOOGLE_MAPS_API_KEY não está configurada/),
    ).toBeVisible();
    await expect(modal.getByLabel("Coordenadas do ponto")).toBeVisible();
    await expect(
      modal.getByRole("button", { name: /Pegar localização em tempo real/ }),
    ).toBeVisible();
    await expect(page.locator('script[src*="maps.googleapis"]')).toHaveCount(0);
    expect(forbiddenRequests).toEqual([]);
  });

  test("mock de pesquisa centraliza resultado e confirma coordenadas", async ({
    page,
  }) => {
    await mockGoogleMapsRuntime(page);
    await mockRegions(page);
    await page.goto("/");

    const { modal } = await openAvailabilityModal(page);
    await expect(modal.getByText(/Mapa pronto/)).toBeVisible();

    await modal.getByLabel(/Buscar fazenda/).fill("fazenda tal paracatu");
    await modal.getByRole("button", { name: "Buscar", exact: true }).click();

    await expect(modal.getByText("Resultado localizado no mapa")).toBeVisible();
    await expect(modal.getByText("-16.521111, -46.812222")).toBeVisible();

    await modal.getByRole("button", { name: "Confirmar este ponto" }).click();
    await expect(modal.getByLabel("Coordenadas do ponto")).toHaveValue(
      "-16.521111, -46.812222",
    );
    await expect(
      modal.getByRole("button", { name: /Consultar pré-análise/ }),
    ).toBeEnabled();
  });

  test("clique no mapa reposiciona marcador e consulta envia somente latitude e longitude", async ({
    page,
  }) => {
    await mockGoogleMapsRuntime(page);
    await mockRegions(page);

    let postedPayload: unknown = null;
    await mockViability(page, async (route) => {
      postedPayload = route.request().postDataJSON();
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          viavel: true,
          status: "pre_viavel",
          mensagem: "Encontramos indício de viabilidade para este endereço.",
        }),
      });
    });

    await page.goto("/");
    const { modal } = await openAvailabilityModal(page);
    await expect(modal.getByText(/Mapa pronto/)).toBeVisible();

    await clickMockMap(page, -16.61, -46.91);
    await expect(modal.getByText("Ponto marcado no mapa")).toBeVisible();
    await expect(modal.getByText("-16.610000, -46.910000")).toBeVisible();

    await clickMockMap(page, -16.62, -46.92);
    await expect(modal.getByText("-16.620000, -46.920000")).toBeVisible();

    await modal.getByRole("button", { name: "Confirmar este ponto" }).click();
    await expect(modal.getByLabel("Coordenadas do ponto")).toHaveValue(
      "-16.620000, -46.920000",
    );
    await submitCoordinates(page);

    expect(postedPayload).toEqual({ latitude: -16.62, longitude: -46.92 });
  });
  test("CTAs de disponibilidade abrem o mesmo modal", async ({ page }) => {
    await mockRegions(page);
    await page.goto("/");

    const modal = page.getByRole("dialog", {
      name: "Pré-análise de disponibilidade",
    });
    const ctas = [
      page.locator(".site-hero").getByRole("link", {
        name: "Verificar disponibilidade",
      }),

      page.locator("#tecnologias").getByRole("link", {
        name: "Fazer pré-análise",
      }),
      page
        .locator("#planos")
        .getByRole("link", {
          name: "Fazer pré-análise",
        })
        .first(),
      page.locator("#regioes").getByRole("link", {
        name: "Consultar pré-análise",
      }),
      page.locator("#cta-final").getByRole("link", {
        name: "Verificar disponibilidade",
      }),
    ];

    const headerCta = page.locator(".site-header").getByRole("link", {
      name: "Verificar disponibilidade",
    });
    if (await headerCta.isVisible()) {
      ctas.push(headerCta);
    }

    for (const cta of ctas) {
      await cta.scrollIntoViewIfNeeded();
      await cta.click();
      await expect(modal).toBeVisible();
      await modal.getByRole("button", { name: "Fechar pré-análise" }).click();
      await expect(modal).toBeHidden();
    }
  });
});
