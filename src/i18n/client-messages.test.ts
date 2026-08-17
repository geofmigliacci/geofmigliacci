import { describe, expect, it } from "vitest";
import { clientMessages } from "@/i18n/client-messages";
import en from "@/messages/en.json";

describe("clientMessages", () => {
  it("forwards the namespaces a Client Component reads", () => {
    expect(Object.keys(clientMessages(en))).toEqual([
      "nav",
      "common",
      "site",
      "home",
      "about",
      "blog",
      "errors",
    ]);
  });

  it("leaves behind the namespaces that only render server side", () => {
    const forwarded = clientMessages(en);

    expect(forwarded).not.toHaveProperty("legal");
    expect(forwarded).not.toHaveProperty("privacy");
    expect(forwarded).not.toHaveProperty("meta");
  });

  it("hands a namespace over whole", () => {
    expect(clientMessages(en).nav).toBe(en.nav);
  });
});
