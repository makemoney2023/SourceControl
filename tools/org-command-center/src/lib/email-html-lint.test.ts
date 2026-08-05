import { describe, expect, it } from "vitest";
import { lintEmailHtml } from "./email-html-lint";

describe("lintEmailHtml", () => {
  it("passes a minimal table email", () => {
    const r = lintEmailHtml(
      `<!DOCTYPE html><html><body>
<table width="600" style="max-width:600px"><tr><td>
<img src="https://cdn.example/h.png" alt="Header" />
<a href="https://example.com/inquire">Inquire</a>
</td></tr></table>
</body></html>`,
    );
    expect(r.ok).toBe(true);
  });

  it("flags script tags and missing CTA", () => {
    const r = lintEmailHtml(`<html><body><script>x</script><p>Hi</p></body></html>`);
    expect(r.ok).toBe(false);
    expect(r.errors).toContain("script_tag");
    expect(r.errors).toContain("cta_href");
  });
});
