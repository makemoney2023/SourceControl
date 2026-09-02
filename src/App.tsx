import { DeckShell } from "./components/DeckShell";
import { ExperienceShell } from "./components/experience/ExperienceShell";
import { Hero3dPreview } from "./components/Hero3dPreview";
import { CityFlightShell } from "./city/CityFlightShell";
import "./components/deck.css";

type AppView = "legacy" | "hero3d" | "experience" | "city";

function useAppView(): AppView {
  if (typeof window === "undefined") return "experience";
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  if (view === "legacy" || view === "static") return "legacy";
  if (view === "hero3d") return "hero3d";
  if (view === "city") return "city";
  return "experience";
}

export default function App() {
  const view = useAppView();
  if (view === "legacy") return <DeckShell />;
  if (view === "hero3d") return <Hero3dPreview />;
  if (view === "city") return <CityFlightShell />;
  return <ExperienceShell />;
}
