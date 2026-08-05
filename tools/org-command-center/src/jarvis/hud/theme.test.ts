import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const themeCss = readFileSync(new URL("./theme.css", import.meta.url), "utf8");
const situationRoom = readFileSync(new URL("../SituationRoom.tsx", import.meta.url), "utf8");
const indexCss = readFileSync(new URL("../../index.css", import.meta.url), "utf8");

describe("Jarvis HUD theme contracts", () => {
  it("maps shared UI color tokens to Jarvis colors", () => {
    expect(themeCss).toContain("--color-bg: var(--j-bg)");
    expect(themeCss).toContain("--color-surface: var(--j-panel)");
    expect(themeCss).toContain("--color-line: var(--j-panel-border)");
    expect(themeCss).toContain("--color-accent: var(--j-accent)");
    expect(themeCss).toContain("--color-accent-fg: #041210");
    expect(themeCss).toContain("--color-muted: var(--j-muted)");
  });

  it("maps shadcn and Radix semantic aliases to the Jarvis palette", () => {
    for (const token of [
      "--background: var(--j-bg)",
      "--foreground: var(--j-ink)",
      "--card: var(--j-panel)",
      "--card-foreground: var(--j-ink)",
      "--primary: var(--j-accent)",
      "--primary-foreground: #041210",
      "--secondary: var(--j-accent-dim)",
      "--secondary-foreground: var(--j-ink)",
      "--muted-foreground: var(--j-muted)",
      "--accent-foreground: var(--j-ink)",
      "--destructive: var(--j-danger)",
      "--border: var(--j-panel-border)",
      "--input: var(--j-panel-border)",
      "--ring: var(--j-accent)",
    ]) {
      expect(themeCss).toContain(token);
    }
  });

  it("defines visible keyboard focus for selectable HUD controls", () => {
    for (const selector of [
      ".j-btn:focus-visible",
      ".j-holo-tile:focus-visible",
      ".j-threat-item:focus-visible",
      ".j-input:focus-visible",
      ".j-select:focus-visible",
      ".j-textarea:focus-visible",
      "[role=\"button\"]:focus-visible",
    ]) {
      expect(themeCss).toContain(selector);
    }
  });

  it("uses form-control classes for the new idea fields", () => {
    expect(situationRoom).toMatch(/id="sr-project"\s+className="j-select"/);
    expect(situationRoom).toMatch(/id="sr-new-name"\s+className="j-input"/);
    expect(situationRoom).toMatch(/id="sr-new-slug"\s+className="j-input"/);
    expect(situationRoom).toMatch(/id="sr-new-context"\s+className="j-textarea"/);
  });

  it("exposes pressed state for workspace view toggles", () => {
    expect(situationRoom).toContain("showTheater={showMap}");
    expect(situationRoom).toContain("opsMode={opsMode}");
    expect(situationRoom).toContain("onToggleTheater={onSetTheater}");
    expect(situationRoom).toContain("onToggleOps={onSetOpsTables}");
  });

  it("keeps the theater available and docks HUD overlays at responsive breakpoints", () => {
    expect(themeCss).not.toMatch(/@media \(max-width: 1100px\)[\s\S]*?\.j-map\s*\{\s*display:\s*none/);
    expect(themeCss).toContain("@media (max-width: 900px)");
    expect(themeCss).toContain("@media (max-width: 600px)");
    expect(themeCss).toContain(".j-stage-overlay-left");
    expect(themeCss).toContain(".j-stage-overlay-right");
    expect(themeCss).toContain(".j-ops-grid");
    expect(themeCss).toContain(".j-output-grid");
    expect(themeCss).toContain(".j-run-grid");
  });

  it("allocates a real mobile theater below a document-scrolling shell", () => {
    expect(situationRoom).toContain('className="j-workspace-stack"');
    expect(situationRoom).toContain('className="j-theater-stage"');
    expect(situationRoom).not.toContain(
      'className="j-theater-stage" style={{ minHeight: 0, height: "100%" }}',
    );
    expect(themeCss).toMatch(
      /\[data-theme="jarvis"\]\.j-situation-shell\s*\{[^}]*display:\s*grid/,
    );
    expect(themeCss).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\[data-theme="jarvis"\]\.j-situation-shell\s*\{[^}]*grid-template-rows:\s*auto minmax\(620px,\s*auto\)/,
    );
    expect(themeCss).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.j-workspace-stack\s*\{[^}]*min-height:\s*620px/,
    );
    expect(indexCss).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?body\s*\{[^}]*overflow-y:\s*auto/,
    );
  });

  it("disables all cinematic motion when reduced motion is requested", () => {
    for (const selector of [
      ".j-console-drawer",
      ".j-console-drawer-content",
      ".j-skeleton",
      ".j-command-dialog",
      ".j-voice-fab",
    ]) {
      expect(themeCss).toContain(selector);
    }
    expect(themeCss).toContain("animation: none !important");
  });

  it("layers modal surfaces above the voice control", () => {
    expect(themeCss).toMatch(/\.j-console-drawer\s*\{[\s\S]*?z-index:\s*90/);
    expect(themeCss).toMatch(/\.j-console-drawer-content\s*\{[\s\S]*?z-index:\s*91/);
    expect(themeCss).toMatch(/\.j-dropdown-content\s*\{[\s\S]*?z-index:\s*100/);
  });

  it("allows short desktop viewports to scroll without collapsing theater", () => {
    expect(themeCss).toMatch(/@media \(max-height: 700px\)[\s\S]*?\.j-situation-shell/);
    expect(themeCss).toMatch(/@media \(max-height: 700px\)[\s\S]*?\.j-theater-stage\s*\{[^}]*min-height:\s*520px/);
  });
});
