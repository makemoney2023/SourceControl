import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

describe("next.config redirects", () => {
  it("permanently redirects /apply to /inquire", () => {
    const redirects = nextConfig.redirects;
    expect(redirects).toBeDefined();

    return redirects!().then((rules) => {
      const applyRedirect = rules.find(
        (rule) => rule.source === "/apply" && rule.destination === "/inquire",
      );
      expect(applyRedirect).toBeDefined();
      expect(applyRedirect?.permanent).toBe(true);
    });
  });
});
