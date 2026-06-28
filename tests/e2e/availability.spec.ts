import { expect, test, type Page } from "@playwright/test";

const regionsUrl = "https://atlassoftware.ia.br/api/public/regioes";
const viabilityUrl =
  "https://atlassoftware.ia.br/api/public/viabilidade-basica";

async function mockRegions(page: Page): Promise<void> {
  await page.route(regionsUrl, async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        total: 3,
        regioes: [
          { nome: "15 DE NOVEMBRO", fontes: ["fibra"] },
          { nome: "ROMILDA", fontes: ["fibra", "radio"] },
          { nome: "TORRE CENTRO", fontes: ["radio"] },
        ],
      }),
    });
  });
}

async function fillValidCoordinates(page: Page): Promise<void> {
  const availability = page.locator("#disponibilidade");
  await availability.getByLabel("Latitude").fill("-16.448694");
  await availability.getByLabel("Longitude").fill("-46.906306");
}

test.describe("Disponibilidade Onda 2", () => {
  test("carrega regiões mockadas da API e preenche o select", async ({
    page,
  }) => {
    await mockRegions(page);
    await page.goto("/");

    const availability = page.locator("#disponibilidade");
    await expect(
      availability.getByText(
        "Regiões carregadas da API pública como possíveis localidades.",
      ),
    ).toBeVisible();
    await expect(
      availability.getByLabel("Possível região/localidade"),
    ).toContainText("15 DE NOVEMBRO");
    await expect(
      availability.getByLabel("Possível região/localidade"),
    ).toContainText("ROMILDA");
  });

  test("coordenadas manuais válidas habilitam consulta e POST envia somente latitude e longitude", async ({
    page,
  }) => {
    await mockRegions(page);

    let postedPayload: unknown = null;
    await page.route(viabilityUrl, async (route) => {
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
    await fillValidCoordinates(page);

    const availability = page.locator("#disponibilidade");
    const submit = availability.getByRole("button", {
      name: "Consultar pré-análise",
    });
    await expect(submit).toBeEnabled();
    await submit.click();

    await expect(
      availability.getByRole("heading", {
        name: "Encontramos indício de viabilidade",
      }),
    ).toBeVisible();
    expect(postedPayload).toEqual({
      latitude: -16.448694,
      longitude: -46.906306,
    });
  });

  test("resultado positivo exibe indício de viabilidade e WhatsApp contextual", async ({
    page,
  }) => {
    await mockRegions(page);
    await page.route(viabilityUrl, async (route) => {
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
    const availability = page.locator("#disponibilidade");
    await availability.getByLabel("Possível região/localidade").selectOption({
      label: "ROMILDA",
    });
    await fillValidCoordinates(page);
    await availability
      .getByRole("button", { name: "Consultar pré-análise" })
      .click();

    await expect(
      availability.getByRole("heading", {
        name: "Encontramos indício de viabilidade",
      }),
    ).toBeVisible();

    const whatsappHref = await availability
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

  test("resultado negativo oferece avaliação manual", async ({ page }) => {
    await mockRegions(page);
    await page.route(viabilityUrl, async (route) => {
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
    await fillValidCoordinates(page);
    const availability = page.locator("#disponibilidade");
    await availability
      .getByRole("button", { name: "Consultar pré-análise" })
      .click();

    await expect(
      availability.getByRole("heading", {
        name: "Não identificamos viabilidade automática",
      }),
    ).toBeVisible();
    await expect(
      availability.getByRole("link", { name: "Solicitar avaliação manual" }),
    ).toBeVisible();
  });

  test("erro 429 mostra mensagem de limite", async ({ page }) => {
    await mockRegions(page);
    await page.route(viabilityUrl, async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ erro: "limite_excedido" }),
      });
    });

    await page.goto("/");
    await fillValidCoordinates(page);
    const availability = page.locator("#disponibilidade");
    await availability
      .getByRole("button", { name: "Consultar pré-análise" })
      .click();

    await expect(
      availability.getByText("Limite de consultas atingido"),
    ).toBeVisible();
  });

  test("erro 503 mostra fallback para atendimento manual", async ({ page }) => {
    await mockRegions(page);
    await page.route(viabilityUrl, async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ erro: "erro_temporario" }),
      });
    });

    await page.goto("/");
    await fillValidCoordinates(page);
    const availability = page.locator("#disponibilidade");
    await availability
      .getByRole("button", { name: "Consultar pré-análise" })
      .click();

    await expect(
      availability.getByText("Pré-análise indisponível agora"),
    ).toBeVisible();
    await expect(
      availability.getByText(/avaliar manualmente pelo WhatsApp/),
    ).toBeVisible();
  });

  test("sem coordenadas não envia POST", async ({ page }) => {
    await mockRegions(page);

    let postCount = 0;
    await page.route(viabilityUrl, async (route) => {
      postCount += 1;
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ viavel: true, status: "pre_viavel" }),
      });
    });

    await page.goto("/");
    const availability = page.locator("#disponibilidade");
    await expect(
      availability.getByRole("button", { name: "Consultar pré-análise" }),
    ).toBeDisabled();
    await expect(availability.getByText(/Use sua localização/)).toBeVisible();
    expect(postCount).toBe(0);
  });

  test("não coleta dados pessoais, não carrega Google e mantém header sem WhatsApp", async ({
    page,
  }) => {
    await mockRegions(page);

    const forbiddenRequests: string[] = [];
    page.on("request", (request) => {
      const url = request.url();
      if (
        url.includes("maps.googleapis") ||
        url.includes("google.maps") ||
        url.includes("googletagmanager") ||
        url.toLowerCase().includes("places")
      ) {
        forbiddenRequests.push(url);
      }
    });

    await page.goto("/");

    await expect(page.getByLabel(/^Nome$/i)).toHaveCount(0);
    await expect(page.getByLabel(/^Telefone$/i)).toHaveCount(0);
    await expect(page.getByLabel(/^E-mail$/i)).toHaveCount(0);
    await expect(page.getByLabel(/^CPF$/i)).toHaveCount(0);
    await expect(page.locator("input[name], textarea[name]")).toHaveCount(0);
    await expect(page.locator('script[src*="maps.googleapis"]')).toHaveCount(0);
    await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(
      0,
    );
    await expect(
      page.locator(".site-header").getByRole("link", {
        name: /WhatsApp|Falar no WhatsApp/,
      }),
    ).toHaveCount(0);
    expect(forbiddenRequests).toEqual([]);
  });
});
