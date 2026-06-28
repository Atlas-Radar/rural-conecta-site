import { expect, test } from "@playwright/test";

test.describe("Header mobile-first", () => {
  test("mobile keeps brand, menu, hero CTAs, and no header WhatsApp", async ({
    page,
  }, testInfo) => {
    test.skip(!testInfo.project.name.includes("mobile"), "mobile-only check");

    await page.goto("/");

    await expect(
      page
        .locator(".site-header")
        .getByRole("link", { name: "Rural Conecta - página inicial" }),
    ).toBeVisible();

    const menuToggle = page.getByText("Abrir menu de navegação");
    await expect(menuToggle).toBeAttached();

    const header = page.locator(".site-header");
    await expect(
      header.getByRole("link", { name: /WhatsApp|Falar no WhatsApp/ }),
    ).toHaveCount(0);

    await page.locator(".mobile-menu__toggle").click();
    const mobileMenu = page
      .getByRole("navigation", { name: "Principal" })
      .last();
    await expect(mobileMenu).toBeVisible();
    await expect(
      mobileMenu.getByRole("link", { name: "Disponibilidade" }),
    ).toBeVisible();
    await expect(
      mobileMenu.getByRole("link", { name: "WhatsApp" }),
    ).toHaveCount(0);

    const hero = page.locator(".site-hero");
    await expect(
      hero.getByRole("heading", {
        name: "Internet de verdade para quem vive no campo.",
      }),
    ).toBeVisible();
    await expect(
      hero.getByRole("link", { name: "Verificar disponibilidade" }),
    ).toBeInViewport();
    await expect(
      hero.getByRole("link", { name: "Falar no WhatsApp" }),
    ).toHaveAttribute("href", /https:\/\/wa\.me\/553897402599/);
  });

  test("desktop shows navigation and hero WhatsApp without loading Maps or scripts", async ({
    page,
  }, testInfo) => {
    test.skip(!testInfo.project.name.includes("desktop"), "desktop-only check");

    const scriptRequests: string[] = [];
    page.on("request", (request) => {
      const url = request.url();
      if (url.includes("maps.googleapis") || url.includes("google.maps")) {
        scriptRequests.push(url);
      }
    });

    await page.goto("/");

    await expect(
      page.getByRole("navigation", { name: "Principal" }).first(),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Início" })).toBeVisible();
    await expect(
      page.locator(".site-header").getByRole("link", { name: "Como funciona" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Verificar disponibilidade" }).first(),
    ).toBeVisible();

    const header = page.locator(".site-header");
    await expect(
      header.getByRole("link", { name: /WhatsApp|Falar no WhatsApp/ }),
    ).toHaveCount(0);

    const hero = page.locator(".site-hero");
    await expect(
      hero.getByRole("link", { name: "Falar no WhatsApp" }),
    ).toHaveAttribute("href", /https:\/\/wa\.me\/553897402599/);

    expect(scriptRequests).toEqual([]);
    await expect(page.locator("script")).toHaveCount(0);
  });
});
