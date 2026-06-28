import { expect, test, type Page, type Route } from "@playwright/test";

const configuredAtlasApiBaseUrl = (
  (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.PUBLIC_ATLAS_API_BASE_URL ?? "https://atlassoftware.ia.br"
).replace(/\/+$/, "");
const defaultAtlasApiBaseUrl = "https://atlassoftware.ia.br";
const regionUrlPatterns = Array.from(
  new Set([
    `${configuredAtlasApiBaseUrl}/api/public/regioes`,
    `${defaultAtlasApiBaseUrl}/api/public/regioes`,
    "**/api/public/regioes",
  ]),
);

async function routeRegions(
  page: Page,
  handler: (route: Route) => Promise<void>,
): Promise<void> {
  for (const pattern of regionUrlPatterns) {
    await page.route(pattern, handler);
  }
}

const sectionHeadings = [
  /Internet de verdade para quem vive no campo\./,
  /Três passos claros para sair da dúvida\./,
  /A solução certa vem depois da análise local\./,
  /Categorias para cada rotina no campo\./,
  /Aqui você fala com gente da região\./,
  /Conexão para estudar, produzir e cuidar do que importa\./,
  /A lista ajuda a começar; a coordenada confirma o ponto\./,
  /Propriedades produtivas precisam de análise própria\./,
  /Compromissos até termos relatos autorizados\./,
  /Dúvidas comuns antes de chamar a equipe\./,
  /Pronto para conectar sua casa, fazenda ou empresa\?/,
];

async function mockRegions(page: Page): Promise<void> {
  await routeRegions(page, async (route) => {
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

test.describe("Landing Onda 4", () => {
  test("renders the landing without visible availability section", async ({
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
    await expect(page.getByText("Compromisso público")).toHaveCount(3);
    await expect(
      page.locator("#regioes").getByText("Novo Barreiro"),
    ).toBeVisible();
    await expect(
      page.locator("#regioes").getByText("Outras localidades pela API pública"),
    ).toBeVisible();

    await expect(page.locator(".availability-preview__compact")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Abrir pré-análise" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("dialog", { name: "Pré-análise de disponibilidade" }),
    ).toBeHidden();
  });

  test("keeps modal-only viability without personal data fields or Google integrations", async ({
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

    await expect(page.locator("#disponibilidade")).toHaveCount(1);
    await expect(page.locator(".availability-preview__compact")).toHaveCount(0);
    await expect(page.locator("[data-availability-modal]")).toBeHidden();

    await expect(page.getByLabel(/^Nome$/i)).toHaveCount(0);
    await expect(page.getByLabel(/^Telefone$/i)).toHaveCount(0);
    await expect(page.getByLabel(/^E-mail$/i)).toHaveCount(0);
    await expect(page.getByLabel(/^CPF$/i)).toHaveCount(0);
    await expect(page.locator("input[name], textarea[name]")).toHaveCount(0);
    await expect(page.locator('script[src*="maps.googleapis"]')).toHaveCount(0);
    expect(forbiddenRequests).toEqual([]);
  });

  test("supports navigation, modal CTA and contextual WhatsApp CTAs", async ({
    page,
  }) => {
    await mockRegions(page);
    await page.goto("/");

    await page
      .locator(".site-hero")
      .getByRole("link", { name: "Verificar disponibilidade" })
      .click();
    const modal = page.getByRole("dialog", {
      name: "Pré-análise de disponibilidade",
    });
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: "Fechar pré-análise" }).click();
    await expect(modal).toBeHidden();

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
