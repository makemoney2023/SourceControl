// scripts/city-placeholder-legs.ts
// Placeholder city legs: slow ffmpeg push-ins over approved plates, encoded for
// scrubbing (dense GOP). Same output paths the real kie legs will overwrite later.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { CITY_LEGS, slideById } from "../src/data/cityFlight";

const root = resolve(import.meta.dirname, "..");
const legsDir = resolve(root, "public/city/legs");
const postersDir = resolve(root, "public/city/posters");
mkdirSync(legsDir, { recursive: true });
mkdirSync(postersDir, { recursive: true });

const FPS = 25;

function ffmpeg(args: string[]): void {
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });
}

for (const leg of CITY_LEGS) {
  const plate = resolve(root, "public", slideById(leg.placeholderPlateOf).conceptSrc.slice(1));
  if (!existsSync(plate)) throw new Error(`missing plate ${plate}`);
  const frames = FPS * leg.clipSeconds;
  const zoom = `zoompan=z='1.04+0.14*on/${frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=${FPS}`;
  const desktop = `${legsDir}/${leg.id}.mp4`;
  const mobile = `${legsDir}/${leg.id}-m.mp4`;

  // Desktop: 1920x1080, GOP 8, no audio.
  ffmpeg([
    "-loop", "1", "-i", plate,
    "-vf", `${zoom},format=yuv420p`,
    "-t", String(leg.clipSeconds), "-an",
    "-c:v", "libx264", "-preset", "medium", "-crf", "20",
    "-g", "8", "-keyint_min", "8", "-sc_threshold", "0",
    desktop,
  ]);

  // Mobile: portrait center crop 720x1280, GOP 4.
  ffmpeg([
    "-i", desktop,
    "-vf", "crop=ih*9/16:ih,scale=720:1280,format=yuv420p",
    "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "22",
    "-g", "4", "-keyint_min", "4", "-sc_threshold", "0",
    mobile,
  ]);

  // Poster from the ENCODED desktop mp4 (first decoded frame = what the browser holds).
  ffmpeg(["-i", desktop, "-frames:v", "1", `${postersDir}/${leg.id}.webp`]);

  console.log(`built ${leg.id}`);
}
console.log("placeholder legs complete");
