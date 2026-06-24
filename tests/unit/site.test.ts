import { describe, expect, it } from "vitest";

import { createWhatsAppUrl, site } from "../../src/data/site";

describe("site data", () => {
  it("uses the official WhatsApp number in wa.me format", () => {
    const url = createWhatsAppUrl();

    expect(url).toContain(`https://wa.me/${site.whatsapp.digits}?text=`);
    expect(site.whatsapp.display).toBe("38 9740-2599");
  });

  it("encodes WhatsApp messages safely", () => {
    const url = createWhatsAppUrl("Olá, Rural Conecta! Região: Nolasco?");

    expect(url).toContain(
      "Ol%C3%A1%2C%20Rural%20Conecta!%20Regi%C3%A3o%3A%20Nolasco%3F",
    );
  });
});
