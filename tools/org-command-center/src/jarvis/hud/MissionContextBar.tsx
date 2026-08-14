import type { ReactNode } from "react";

type NamedSlug = { slug: string; name: string };

type Props = {
  customerName: string;
  initiativeName: string;
  phaseLabel: string;
  ideaName: string;
  statusLine: string;
  commandSlot?: ReactNode;
  controls?: ReactNode;
  children?: ReactNode;
  focusActive?: boolean;
  customerSlug?: string;
  initiativeSlug?: string;
  customerOptions?: NamedSlug[];
  initiativeOptions?: NamedSlug[];
  switching?: boolean;
  onSwitchCustomer?: (slug: string) => void;
  onSwitchInitiative?: (slug: string) => void;
};

export function MissionContextBar({
  customerName,
  initiativeName,
  phaseLabel,
  ideaName,
  statusLine,
  commandSlot,
  controls,
  children,
  focusActive,
  customerSlug,
  initiativeSlug,
  customerOptions,
  initiativeOptions,
  switching,
  onSwitchCustomer,
  onSwitchInitiative,
}: Props) {
  const showSwitchers = Boolean(customerOptions?.length && onSwitchCustomer);
  return (
    <header
      className="j-hud-panel j-hud-grid j-mission-header"
      data-jarvis-focus={focusActive ? "true" : undefined}
    >
      <div className="j-glance-identity">
        <p className="j-wordmark">Situation Room</p>
        <p className="j-muted j-glance-meta">
          {showSwitchers ? (
            <>
              <label className="j-visually-hidden" htmlFor="sr-glance-customer">
                Customer
              </label>
              <select
                id="sr-glance-customer"
                className="j-select j-glance-select"
                disabled={switching}
                value={customerSlug ?? customerOptions![0]!.slug}
                onChange={(e) => onSwitchCustomer?.(e.target.value)}
              >
                {customerOptions!.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name || c.slug}
                  </option>
                ))}
              </select>
              <span aria-hidden="true"> · </span>
              <label className="j-visually-hidden" htmlFor="sr-glance-initiative">
                Initiative
              </label>
              <select
                id="sr-glance-initiative"
                className="j-select j-glance-select"
                disabled={switching || !onSwitchInitiative}
                value={initiativeSlug ?? initiativeOptions?.[0]?.slug ?? ""}
                onChange={(e) => onSwitchInitiative?.(e.target.value)}
              >
                {(initiativeOptions ?? []).map((i) => (
                  <option key={i.slug} value={i.slug}>
                    {i.name || i.slug}
                  </option>
                ))}
              </select>
              <span> · {phaseLabel}</span>
            </>
          ) : (
            <>
              {customerName} · {initiativeName} · {phaseLabel}
            </>
          )}
        </p>
        <h1 className="j-heading">{ideaName}</h1>
        <p className="j-muted j-glance-status">{statusLine}</p>
      </div>
      <div className="j-glance-actions">
        {controls}
        {commandSlot}
        {children}
      </div>
    </header>
  );
}
