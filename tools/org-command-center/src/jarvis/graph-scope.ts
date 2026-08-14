export type GraphScope = "agency" | "customer" | "initiative" | "seat";

export type GraphFocus = {
  scope: GraphScope;
  customer?: string;
  initiative?: string;
  seat?: string;
};

export type GraphClickNode = {
  kind: string;
  slug?: string;
};

export function initialGraphFocus(customer?: string): GraphFocus {
  const slug = customer?.trim();
  if (!slug) return { scope: "agency" };
  return { scope: "customer", customer: slug };
}

export function parseInitiativeSlug(
  slug: string,
): { customer: string; initiative: string } | null {
  const i = slug.indexOf("/");
  if (i <= 0 || i === slug.length - 1) return null;
  return { customer: slug.slice(0, i), initiative: slug.slice(i + 1) };
}

export function nextGraphFocus(
  current: GraphFocus,
  node: GraphClickNode,
): GraphFocus | "open-work" | null {
  if (current.scope === "agency" && node.kind === "customer" && node.slug) {
    return { scope: "customer", customer: node.slug };
  }
  if (current.scope === "customer" && node.kind === "initiative" && node.slug) {
    const parsed = parseInitiativeSlug(node.slug);
    if (!parsed || parsed.customer !== current.customer) return null;
    return {
      scope: "initiative",
      customer: parsed.customer,
      initiative: parsed.initiative,
    };
  }
  if (current.scope === "initiative" && node.kind === "seat" && node.slug) {
    return {
      scope: "seat",
      customer: current.customer,
      initiative: current.initiative,
      seat: node.slug,
    };
  }
  if (
    current.scope === "seat" &&
    (node.kind === "handoff" ||
      node.kind === "run" ||
      node.kind === "deliverable" ||
      node.kind === "artifact" ||
      node.kind === "skill" ||
      node.kind === "phase")
  ) {
    return "open-work";
  }
  return null;
}

export function initiativeMocTitle(input: {
  initiativeName: string;
  customerName: string;
  uniqueInAgency: boolean;
}): string {
  if (input.uniqueInAgency) return input.initiativeName;
  return `${input.customerName} · ${input.initiativeName}`;
}

export type BreadcrumbCrumb = {
  scope: GraphScope;
  label: string;
  focus: GraphFocus;
};

export function breadcrumbTrail(
  focus: GraphFocus,
  names: {
    orgName: string;
    customerName?: string;
    initiativeName?: string;
    seatTitle?: string;
  },
): BreadcrumbCrumb[] {
  const crumbs: BreadcrumbCrumb[] = [
    { scope: "agency", label: names.orgName, focus: { scope: "agency" } },
  ];
  if (focus.customer && names.customerName) {
    crumbs.push({
      scope: "customer",
      label: names.customerName,
      focus: { scope: "customer", customer: focus.customer },
    });
  }
  if (focus.customer && focus.initiative && names.initiativeName) {
    crumbs.push({
      scope: "initiative",
      label: names.initiativeName,
      focus: {
        scope: "initiative",
        customer: focus.customer,
        initiative: focus.initiative,
      },
    });
  }
  if (focus.seat && names.seatTitle) {
    crumbs.push({
      scope: "seat",
      label: names.seatTitle,
      focus: { ...focus, scope: "seat" },
    });
  }
  return crumbs;
}
