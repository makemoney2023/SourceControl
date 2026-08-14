import type { ReactNode } from "react";

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
}: Props) {
  return (
    <header
      className="j-hud-panel j-hud-grid j-mission-header"
      data-jarvis-focus={focusActive ? "true" : undefined}
    >
      <div className="j-glance-identity">
        <p className="j-wordmark">Situation Room</p>
        <p className="j-muted j-glance-meta">
          {customerName} · {initiativeName} · {phaseLabel}
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
