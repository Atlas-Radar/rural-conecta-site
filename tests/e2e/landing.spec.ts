import { expect, test, type Page } from "@playwright/test";

const regionsUrl = "https://atlassoftware.ia.br/api/public/regioes";

const sectionHeadings = [
  /Internet de verdade para quem vive no campo\./,
  /Verifique a disponibilidade na sua região\./,
  /Três passos claros para sair da dúvida\./,
  /Soluções rurais sem prometer antes da análise\./,
  /Opções comerciais em mock, prontas para edição\./,
  /Aqui você fala com gente da região\./,
  /Internet para a rotina real de quem vive no campo\./,
  /Principais localidades para o mock da Onda 1\./,
  /Projetos rurais pedem conversa consultiva\./,
  /Relatos em validação, sem nomes fictícios\./,
  /Dúvidas objetivas antes da consulta\./,
  /Pronto para conectar sua casa, fazenda ou empresa\?/,
];

async function mockRegions(page: Page): Promise<void> {
  await page.route(regionsUrl, async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        total: 2,
        regioes: [
          { nome: "Novo Barreiro", fontes: ["fibra"] },
          { nome: "Região Mundo Novo", fontes: ["radio"] },
        ],
      }),
    });
  });
}

test.describe("Landing Onda 1", () => {
  test("renders the complete visual mock with safe placeholder content", async ({
    page,
  }) => {
    await mockRegions(page);
    await page.goto("/");

    await expect(page.locator("main h1")).toHaveCount(1);

    for (const heading of sectionHeadings) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }

    await expect(page.getByText("Velocidade sob consulta")).toHaveCount(2);
    await expect(page.getByText("Valor sob consulta")).toHaveCount(3);
    await expect(page.getByText("Placeholder explícito")).toHaveCount(3);
    await expect(
      page.locator("#regioes").getByText("Novo Barreiro"),
    ).toBeVisible();
    await expect(
      page.locator("#regioes").getByText("Região Mundo Novo"),
    ).toBeVisible();
  });

  test("keeps viability without personal data fields or Google integrations", async ({
    page,
  }) => {
    const forbiddenRequests: string[] = [];
    page.on("request", (request) => {
      const url = request.url();
      if (
        url.includes("maps.googleapis") ||
        url.includes("google.maps") ||
        url.includes("googletagmanager") ||
        url.includes("viabilidade-basica")
      ) {
        forbiddenRequests.push(url);
      }
    });

    await mockRegions(page);
    await page.goto("/");

    const availability = page.locator("#disponibilidade");
    await expect(
      availability.getByLabel("Possível região/localidade"),
    ).toContainText("Novo Barreiro");
    await expect(
      availability.getByRole("button", { name: /Usar minha localização/ }),
    ).toBeVisible();
    await expect(
      availability.getByRole("button", { name: /Buscar fazenda ou local/ }),
    ).toBeVisible();
    await expect(
      availability.getByRole("button", { name: /Escolher no mapa/ }),
    ).toBeVisible();
    await expect(
      availability.getByRole("button", { name: /Informar coordenadas/ }),
    ).toBeVisible();
    await expect(
      availability.getByRole("button", { name: "Consultar pré-análise" }),
    ).toBeDisabled();

    await expect(page.getByLabel(/^Nome$/i)).toHaveCount(0);
    await expect(page.getByLabel(/^Telefone$/i)).toHaveCount(0);
    await expect(page.getByLabel(/^E-mail$/i)).toHaveCount(0);
    await expect(page.getByLabel(/^CPF$/i)).toHaveCount(0);
    await expect(page.locator("input[name], textarea[name]")).toHaveCount(0);
    await expect(page.locator('script[src*="maps.googleapis"]')).toHaveCount(0);
    expect(forbiddenRequests).toEqual([]);
  });

  test("supports basic navigation and contextual WhatsApp CTAs", async ({
    page,
  }) => {
    await mockRegions(page);
    await page.goto("/");

    await page
      .locator(".site-hero")
      .getByRole("link", { name: "Verificar disponibilidade" })
      .click();
    await expect(page).toHaveURL(/#disponibilidade$/);

    await page.getByRole("link", { name: "FAQ" }).last().click();
    await expect(page).toHaveURL(/#faq$/);

    await expect(
      page.locator("#atendimento-local").getByRole("link", {
        name: "Falar no WhatsApp",
      }),
    ).toHaveAttribute("href", /https:\/\/wa\.me\/553897402599/);
    await expect(
      page.locator("#cta-final").getByRole("link", {
        name: "Falar no WhatsApp",
      }),
    ).toHaveAttribute("href", /https:\/\/wa\.me\/553897402599/);

    const header = page.locator(".site-header");
    await expect(
      header.getByRole("link", { name: /WhatsApp|Falar no WhatsApp/ }),
    ).toHaveCount(0);
  });
});
