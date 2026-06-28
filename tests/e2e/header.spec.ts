import { expect, test } from "@playwright/test";

test.describe("Header mobile-first", () => {
  test("mobile keeps brand, accessible menu, and primary hero CTA visible", async ({
    page,
  }, testInfo) => {
    test.skip(!testInfo.project.name.includes("mobile"), "mobile-only check");

    await page.goto("/");

    await expect(
      page.getByRole("link", { name: "Rural Conecta - página inicial" }),
    ).toBeVisible();

    const menuToggle = page.getByText("Abrir menu de navegação");
    await expect(menuToggle).toBeAttached();

    await page.locator(".mobile-menu__toggle").click();
    await expect(
      page.getByRole("navigation", { name: "Principal" }).last(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Disponibilidade" }).last(),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Verificar disponibilidade" }).first(),
    ).toBeVisible();
  });

  test("desktop shows navigation and header CTAs without loading Maps or scripts", async ({
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
      page.getByRole("link", { name: "Como funciona" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Verificar disponibilidade" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "WhatsApp" }).first(),
    ).toBeVisible();

    expect(scriptRequests).toEqual([]);
    await expect(page.locator("script")).toHaveCount(0);
  });
});
