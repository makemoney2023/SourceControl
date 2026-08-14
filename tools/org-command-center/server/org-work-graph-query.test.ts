import { describe, expect, it } from "vitest";
import { parseOrgWorkGraphQuery } from "./org-work-graph-query";

describe("parseOrgWorkGraphQuery", () => {
  it("defaults to agency", () => {
    expect(parseOrgWorkGraphQuery(new URL("http://x/api/org-work-graph"))).toEqual({
      scope: "agency",
    });
  });

  it("rejects initiative without customer", () => {
    const r = parseOrgWorkGraphQuery(
      new URL("http://x/api/org-work-graph?scope=initiative"),
    );
    expect(r).toEqual({ error: "customer and initiative are required for scope=initiative" });
  });

  it("rejects legacy portfolio as unknown scope", () => {
    const r = parseOrgWorkGraphQuery(
      new URL("http://x/api/org-work-graph?scope=portfolio"),
    );
    expect(r).toEqual({ error: "scope must be agency, customer, initiative, or seat" });
  });

  it("parses seat focus", () => {
    expect(
      parseOrgWorkGraphQuery(
        new URL(
          "http://x/api/org-work-graph?scope=seat&customer=blacksage-kennels&initiative=sieger-show-secretary&seat=ceo-strategist",
        ),
      ),
    ).toEqual({
      scope: "seat",
      customer: "blacksage-kennels",
      initiative: "sieger-show-secretary",
      seat: "ceo-strategist",
    });
  });
});
