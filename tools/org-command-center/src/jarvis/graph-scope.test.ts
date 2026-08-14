import { describe, expect, it } from "vitest";
import {
  breadcrumbTrail,
  initialGraphFocus,
  initiativeMocTitle,
  nextGraphFocus,
  parseInitiativeSlug,
  type GraphFocus,
} from "./graph-scope";

const agency: GraphFocus = { scope: "agency" };

describe("nextGraphFocus", () => {
  it("agency + customer node drills to customer", () => {
    expect(
      nextGraphFocus(agency, { kind: "customer", slug: "blacksage-kennels" }),
    ).toEqual({ scope: "customer", customer: "blacksage-kennels" });
  });

  it("agency + initiative node is refused", () => {
    expect(
      nextGraphFocus(agency, {
        kind: "initiative",
        slug: "blacksage-kennels/sieger-show-secretary",
      }),
    ).toBeNull();
  });

  it("customer + initiative node drills to initiative", () => {
    expect(
      nextGraphFocus(
        { scope: "customer", customer: "blacksage-kennels" },
        { kind: "initiative", slug: "blacksage-kennels/sieger-show-secretary" },
      ),
    ).toEqual({
      scope: "initiative",
      customer: "blacksage-kennels",
      initiative: "sieger-show-secretary",
    });
  });

  it("initiative + seat node drills to seat", () => {
    expect(
      nextGraphFocus(
        {
          scope: "initiative",
          customer: "blacksage-kennels",
          initiative: "sieger-show-secretary",
        },
        { kind: "seat", slug: "ceo-strategist" },
      ),
    ).toEqual({
      scope: "seat",
      customer: "blacksage-kennels",
      initiative: "sieger-show-secretary",
      seat: "ceo-strategist",
    });
  });

  it("seat + work node opens work without changing scope", () => {
    expect(
      nextGraphFocus(
        {
          scope: "seat",
          customer: "blacksage-kennels",
          initiative: "sieger-show-secretary",
          seat: "ceo-strategist",
        },
        { kind: "handoff", slug: "ceo-strategist" },
      ),
    ).toBe("open-work");
  });
});

describe("parseInitiativeSlug / moc titles", () => {
  it("splits customer/initiative", () => {
    expect(parseInitiativeSlug("blacksage-kennels/sieger-show-secretary")).toEqual({
      customer: "blacksage-kennels",
      initiative: "sieger-show-secretary",
    });
  });

  it("disambiguates Main", () => {
    expect(
      initiativeMocTitle({
        initiativeName: "Main",
        customerName: "Blacksage Kennels",
        uniqueInAgency: false,
      }),
    ).toBe("Blacksage Kennels · Main");
    expect(
      initiativeMocTitle({
        initiativeName: "Sieger Show Secretary",
        customerName: "Blacksage Kennels",
        uniqueInAgency: true,
      }),
    ).toBe("Sieger Show Secretary");
  });
});

describe("initialGraphFocus", () => {
  it("opens on the active customer so work nodes load", () => {
    expect(initialGraphFocus("blacksage-kennels")).toEqual({
      scope: "customer",
      customer: "blacksage-kennels",
    });
  });

  it("falls back to agency when no customer is selected", () => {
    expect(initialGraphFocus()).toEqual({ scope: "agency" });
    expect(initialGraphFocus("")).toEqual({ scope: "agency" });
  });
});

describe("breadcrumbTrail", () => {
  it("builds four crumbs for a seat focus", () => {
    const crumbs = breadcrumbTrail(
      {
        scope: "seat",
        customer: "blacksage-kennels",
        initiative: "sieger-show-secretary",
        seat: "ceo-strategist",
      },
      {
        orgName: "Velocity Agency",
        customerName: "Blacksage Kennels",
        initiativeName: "Sieger Show Secretary",
        seatTitle: "CEO / Strategist",
      },
    );
    expect(crumbs.map((c) => c.scope)).toEqual([
      "agency",
      "customer",
      "initiative",
      "seat",
    ]);
    expect(crumbs[3]?.label).toBe("CEO / Strategist");
  });
});
