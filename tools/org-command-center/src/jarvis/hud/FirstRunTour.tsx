import { useState, type CSSProperties } from "react";

const TOUR_KEY = "sr-tour-v1";

const STEPS = [
  {
    copy: "This table is the company. Size is rank. The pip is status.",
    anchor: "table",
  },
  {
    copy: "Run next wakes the next seat. Hover to see who.",
    anchor: "run-next",
  },
  {
    copy: "Search any seat or task.",
    anchor: "command-deck",
  },
  {
    copy: "When someone is stuck, they show here and light up on the table.",
    anchor: "status",
  },
] as const;

const ANCHOR_STYLE: Record<string, CSSProperties> = {
  table: { top: "46%", left: "50%", transform: "translate(-50%, -50%)" },
  "run-next": { top: 76, right: 24 },
  "command-deck": { top: 76, right: 220 },
  threats: { top: 120, left: 16 },
  status: { top: 88, left: 24 },
};

type Props = {
  hasThreats: boolean;
  onDone: () => void;
};

export function FirstRunTour({ hasThreats, onDone }: Props) {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(() => localStorage.getItem(TOUR_KEY) !== "1");

  if (!open) return null;

  const last = step >= STEPS.length - 1;
  const current = STEPS[step];
  const anchor = current.anchor === "status" && hasThreats ? "threats" : current.anchor;

  function finish() {
    localStorage.setItem(TOUR_KEY, "1");
    setOpen(false);
    onDone();
  }

  return (
    <div
      className="j-glass j-first-run-tour"
      data-anchor={anchor}
      role="note"
      aria-label="Situation Room tour"
      style={{
        position: "fixed",
        zIndex: 20,
        fontSize: 13,
        padding: "12px 14px",
        maxWidth: 280,
        pointerEvents: "auto",
        ...ANCHOR_STYLE[anchor],
      }}
    >
      <p style={{ margin: "0 0 10px" }}>{current.copy}</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button type="button" className="j-btn" onClick={finish}>
          Skip
        </button>
        <button
          type="button"
          className="j-btn j-btn-primary"
          onClick={() => {
            if (last) finish();
            else setStep((currentStep) => currentStep + 1);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
