// scripts/verify-city-assets.ts
// Exit non-zero unless every leg has desktop + mobile mp4 and a poster, with
// duration within 0.5s of the manifest.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { CITY_LEGS } from "../src/data/cityFlight";

const root = resolve(import.meta.dirname, "..");
const legsDir = resolve(root, "public/city/legs");
const postersDir = resolve(root, "public/city/posters");
let failures = 0;

function durationSec(file: string): number {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1", file,
  ]).toString();
  return Number(out.trim());
}

for (const leg of CITY_LEGS) {
  for (const rel of [leg.src, leg.srcMobile, leg.poster]) {
    const file = resolve(root, "public", rel.slice(1));
    if (!existsSync(file)) {
      console.error(`MISSING ${rel}`);
      failures++;
      continue;
    }
    if (rel.endsWith(".mp4")) {
      const d = durationSec(file);
      if (Math.abs(d - leg.clipSeconds) > 0.5) {
        console.error(`BAD DURATION ${rel}: ${d}s, expected ~${leg.clipSeconds}s`);
        failures++;
      }
    }
  }
}

const expectedLegIds = new Set(CITY_LEGS.map((l) => l.id));
for (const name of readdirSync(legsDir)) {
  if (!name.endsWith(".mp4")) continue;
  const base = name.replace(/(-m)?\.mp4$/, "");
  if (!expectedLegIds.has(base)) {
    console.error(`STALE leg asset ${name} (not in CITY_LEGS)`);
    failures++;
  }
}
for (const name of readdirSync(postersDir)) {
  const base = name.replace(/\.webp$/, "");
  if (name.endsWith(".webp") && !expectedLegIds.has(base)) {
    console.error(`STALE poster ${name} (not in CITY_LEGS)`);
    failures++;
  }
}

if (failures > 0) {
  console.error(`${failures} city asset problem(s)`);
  process.exit(1);
}
console.log(`all ${CITY_LEGS.length} legs verified`);
