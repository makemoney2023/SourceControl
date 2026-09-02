#!/usr/bin/env node
/**
 * Generate the continuous city-flight legs with Gemini Omni.
 *
 * Usage:
 *   npx tsx scripts/omni-animate-city-legs.mjs
 *   npx tsx scripts/omni-animate-city-legs.mjs leg-08-skyline-lock --force
 *     (--force on leg N also regenerates legs N+1..end so Architecture A seams stay valid)
 */
import { spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CITY_LEGS,
  CITY_PACKAGE_ACCENTS,
  CITY_PLATE_MOMENTS,
  slideById,
} from "../src/data/cityFlight.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP = resolve(__dirname, "..");
const REPO = resolve(APP, "../..");
const LEGS_DIR = join(APP, "public/city/legs");
const POSTERS_DIR = join(APP, "public/city/posters");
const CHAIN_DIR = join(APP, "out/city-chain");
const RAW_DIR = join(CHAIN_DIR, "raw");
const MANIFEST_PATH = join(CHAIN_DIR, "manifest.json");
const STYLE_PATH = join(
  APP,
  "docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/assets/city/STYLE-PREAMBLE.md",
);
const ERA_PLATE = join(APP, "public/concepts/clean/sp-stack-00-era.png");
export const SUPERPATCH_LOGO = join(
  APP,
  "public/concepts/omni-chain/superpatch-logo-transparent.png",
);
const OPENMONTAGE = join(REPO, "skills/community/openmontage");
const PY =
  process.env.OMNI_PYTHON ||
  "/Users/cbsuperpatch/Desktop/Superpatch_Context/content-studio/superpatch-backend/venv/bin/python";

export const STYLE_PREAMBLE =
  "Neon night city, terrace and street level, cyan/magenta/amber signage glow, wet asphalt reflections, photographic, anamorphic, night. Allowed: SuperPatch wordmark/logo reveal, approved Income Stack plates as in-world facade and skyboard art, sparse SuperPatch package and patch product accents. Forbidden: other brands, crowds, people, readable unrelated signage, clinical claim text, guaranteed-income numbers.";

/** Base camera geography per leg — plate and package notes are appended from SSOT. */
const BASE_LEG_MOVES = {
  "leg-01-terrace":
    "Begin on an elevated terrace and push steadily forward toward the luminous city, preserving a grounded eye-level camera and continuous forward momentum.",
  "leg-02-title-glass":
    "Continue the same forward camera move beside a monumental glass facade, with reflections sliding naturally across the surface as the camera passes.",
  "leg-03-overlook":
    "Glide beyond the facade into a broad city overlook, gently revealing greater depth while maintaining the same direction, speed, lens, and photographic world.",
  "leg-04-street":
    "Descend smoothly from the overlook toward street level, following the avenue forward through reflected neon light with stable cinematic motion.",
  "leg-05-windows":
    "Skim forward along tall storefront windows at street level, letting cyan, magenta, and amber reflections travel across the glass.",
  "leg-06-ascent":
    "Rise smoothly above the street between glass towers, continuing forward as the skyline opens and the camera gains altitude.",
  "leg-07-name-stacks":
    "Bank gently across mid-rise facades, maintaining forward flight while revealing stacked illuminated signage panels.",
  "leg-08-skyline-lock":
    "Ascend rapidly in the first second above every nearby rooftop into an open aerial skyline, then settle into a majestic ultra-wide lock-off with very slow forward drift and immense city depth.",
  "leg-09-product":
    "Descend toward a wellness kiosk district at street level, continuing the same forward camera geography with stable cinematic motion.",
  "leg-10-science":
    "Continue immediately along the adjacent lab and science facade row without resetting camera direction — consecutive VTT product-to-science beat.",
  "leg-11-market-brand":
    "Glide forward through a market district with paired marquees and media towers, keeping the same night-flight direction and lens.",
  "leg-12-development":
    "Pass a training-center facade block at a steady forward drift, preserving continuous camera geography.",
  "leg-13-ten-layers":
    "Rise slightly above an income district grid, revealing layered avenues and terraces while maintaining forward motion.",
  "leg-14-districts-a":
    "Resume a gentle forward bank across distinct illuminated retail districts below, preserving skyline scale and seamless night-flight direction.",
  "leg-15-districts-b":
    "Continue across mid-district architecture with a subtle upward lift, revealing more avenues and terraces while maintaining continuous camera geography.",
  "leg-16-districts-c":
    "Drift across executive-tier signage and upper district skyboards with calm forward motion.",
  "leg-17-bridge":
    "Approach and cross a luminous bridge span, holding continuous forward flight across the mid-span and exit facade.",
  "leg-18-hold":
    "Rise rapidly in the first second and turn toward the distant skyline, then hold a calm high aerial overlook with restrained atmospheric drift as the city resolves.",
};

function plateMomentsForLeg(legId) {
  return CITY_PLATE_MOMENTS.filter((moment) => moment.legId === legId);
}

function packageAccentsForLeg(legId) {
  return CITY_PACKAGE_ACCENTS.filter((accent) => accent.legId === legId);
}

function buildLegMove(legId) {
  const base = BASE_LEG_MOVES[legId];
  if (!base) throw new Error(`Missing base move for ${legId}`);

  const plateNotes = plateMomentsForLeg(legId).map((moment) => moment.note);
  const packageNotes = packageAccentsForLeg(legId).map((accent) => accent.note);

  const inWorld = [
    ...plateNotes.map(
      (note) =>
        `Bake the approved reference plate exactly as in-world art — do not redraw — ${note}.`,
    ),
    ...packageNotes.map(
      (note) =>
        `Place the approved SuperPatch product accent sparingly — ${note}.`,
    ),
  ];

  if (legId === "leg-01-terrace") {
    inWorld.unshift(
      "In the first seconds reveal the SuperPatch wordmark/logo from the logo reference on the terrace facade.",
    );
  }

  return [base, ...inWorld].join(" ");
}

export function buildCityOmniLegs() {
  return CITY_LEGS.map((leg) => ({
    id: leg.id,
    clipSeconds: leg.clipSeconds,
    move: buildLegMove(leg.id),
    plateMoments: plateMomentsForLeg(leg.id),
    packageAccents: packageAccentsForLeg(leg.id),
  }));
}

export const CITY_OMNI_LEGS = buildCityOmniLegs();

export function resolvePublicPath(relativePath) {
  const normalized = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;
  return join(APP, "public", normalized);
}

export function referencePathsForLeg(index, leg) {
  const paths = [startFramePath(index)];

  if (leg.id === "leg-01-terrace") {
    paths.push(SUPERPATCH_LOGO);
  }

  for (const moment of leg.plateMoments ?? plateMomentsForLeg(leg.id)) {
    paths.push(resolvePublicPath(slideById(moment.slideId).conceptSrc));
  }

  for (const accent of leg.packageAccents ?? packageAccentsForLeg(leg.id)) {
    paths.push(resolvePublicPath(accent.src));
  }

  return paths;
}

function referenceTagInstructions(referencePaths) {
  const tags = ["<FIRST_FRAME> opens the clip from the chain seam or Era plate."];
  for (let i = 1; i < referencePaths.length; i += 1) {
    tags.push(
      `<IMAGE_REF_${i}> is an approved SuperPatch grounding reference — use it exactly, do not redraw.`,
    );
  }
  return tags.join(" ");
}

export function buildPrompt(leg, preamble = STYLE_PREAMBLE, referencePaths = []) {
  const refLead = referencePaths.length
    ? `${referenceTagInstructions(referencePaths)} `
    : "";
  return `${preamble} ${refLead}${leg.move}`;
}

export function startFramePath(index) {
  if (index === 0) return ERA_PLATE;
  return join(CHAIN_DIR, `${CITY_OMNI_LEGS[index - 1].id}.png`);
}

export function buildDesktopArgs(leg, rawPath, desktopPath) {
  const filters = [
    "scale=1920:1080:force_original_aspect_ratio=increase",
    "crop=1920:1080",
  ];
  if (leg.clipSeconds === 10) filters.push("setpts=1.25*PTS");
  filters.push("format=yuv420p");
  return [
    "-i", rawPath,
    "-vf", filters.join(","),
    "-t", String(leg.clipSeconds),
    "-an",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "20",
    "-g", "8",
    "-keyint_min", "8",
    "-sc_threshold", "0",
    "-movflags", "+faststart",
    desktopPath,
  ];
}

export function buildMobileArgs(desktopPath, mobilePath) {
  return [
    "-i", desktopPath,
    "-vf", "crop=ih*9/16:ih,scale=720:1280,format=yuv420p",
    "-an",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "22",
    "-g", "4",
    "-keyint_min", "4",
    "-sc_threshold", "0",
    "-movflags", "+faststart",
    mobilePath,
  ];
}

function loadEnvLocal() {
  const envPath = join(REPO, ".env.local");
  if (!existsSync(envPath)) throw new Error(`Missing ${envPath}`);
  const values = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    if (!line || line.trim().startsWith("#") || !line.includes("=")) continue;
    const splitAt = line.indexOf("=");
    values[line.slice(0, splitAt).trim()] = line
      .slice(splitAt + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  }
  return values;
}

function runFfmpeg(args) {
  const result = spawnSync(
    "ffmpeg",
    ["-y", "-loglevel", "error", ...args],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed: ${result.stderr?.slice(0, 800)}`);
  }
}

function extractLastEncodedFrame(videoPath, framePath) {
  runFfmpeg([
    "-sseof", "-0.15",
    "-i", videoPath,
    "-frames:v", "1",
    framePath,
  ]);
}

function encodeLeg(leg, rawPath) {
  const desktopPath = join(LEGS_DIR, `${leg.id}.mp4`);
  const mobilePath = join(LEGS_DIR, `${leg.id}-m.mp4`);
  const posterPath = join(POSTERS_DIR, `${leg.id}.webp`);
  runFfmpeg(buildDesktopArgs(leg, rawPath, desktopPath));
  runFfmpeg(buildMobileArgs(desktopPath, mobilePath));
  runFfmpeg(["-i", desktopPath, "-frames:v", "1", posterPath]);
  return { desktopPath, mobilePath, posterPath };
}

function runOmni({ apiKey, referencePaths, prompt, outputPath }) {
  const code = `
import json, os, sys
sys.path.insert(0, ${JSON.stringify(OPENMONTAGE)})
os.environ["GEMINI_API_KEY"] = ${JSON.stringify(apiKey)}
os.environ["GOOGLE_API_KEY"] = ${JSON.stringify(apiKey)}
from tools.video.gemini_omni_video import GeminiOmniVideo

result = GeminiOmniVideo().execute({
    "prompt": ${JSON.stringify(prompt)},
    "operation": "image_to_video",
    "aspect_ratio": "16:9",
    "duration": "8",
    "reference_image_paths": ${JSON.stringify(referencePaths)},
    "output_path": ${JSON.stringify(outputPath)},
    "store": True,
})
print(json.dumps({
    "success": result.success,
    "error": result.error,
    "data": result.data,
    "cost_usd": result.cost_usd,
    "duration_seconds": result.duration_seconds,
}))
if not result.success:
    sys.exit(1)
`;
  return new Promise((resolvePromise, reject) => {
    const child = spawn(PY, ["-"], {
      env: { ...process.env, GEMINI_API_KEY: apiKey, GOOGLE_API_KEY: apiKey },
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
      process.stdout.write(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      process.stderr.write(chunk);
    });
    child.on("close", (codeValue) => {
      if (codeValue !== 0) {
        reject(new Error(stderr || stdout || `python exit ${codeValue}`));
        return;
      }
      const lastLine = stdout.trim().split("\n").at(-1);
      try {
        resolvePromise(JSON.parse(lastLine));
      } catch {
        reject(new Error(`Bad tool JSON: ${lastLine?.slice(0, 400)}`));
      }
    });
    child.stdin.write(code);
    child.stdin.end();
  });
}

/** When forcing mid-chain, successors must regenerate so seam frames stay valid. */
export function expandForcedLegIds(forcedIds) {
  if (!forcedIds.size) return new Set(forcedIds);
  const expanded = new Set(forcedIds);
  for (const id of forcedIds) {
    const index = CITY_OMNI_LEGS.findIndex((leg) => leg.id === id);
    if (index === -1) continue;
    for (let i = index; i < CITY_OMNI_LEGS.length; i += 1) {
      expanded.add(CITY_OMNI_LEGS[i].id);
    }
  }
  return expanded;
}

function parseArgs(argv) {
  const ids = argv.filter((arg) => !arg.startsWith("--"));
  const unknown = ids.filter((id) => !CITY_OMNI_LEGS.some((leg) => leg.id === id));
  if (unknown.length) throw new Error(`Unknown leg id(s): ${unknown.join(", ")}`);
  const force = argv.includes("--force");
  let idSet = new Set(ids);
  if (force && idSet.size) idSet = expandForcedLegIds(idSet);
  return { force, ids: idSet };
}

function writeManifest(results) {
  writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(
      {
        model: "Gemini Omni",
        generatedAt: new Date().toISOString(),
        seamLaw: "leg N+1 starts from leg N encoded desktop last frame",
        results,
        okCount: results.filter((result) => result.ok).length,
        failCount: results.filter((result) => !result.ok).length,
        cost_usd_sum: results.reduce((sum, result) => sum + (result.cost_usd || 0), 0),
      },
      null,
      2,
    ),
  );
}

export async function main(argv = process.argv.slice(2)) {
  if (!existsSync(PY)) throw new Error(`Python missing: ${PY}`);
  if (!existsSync(ERA_PLATE)) throw new Error(`Era plate missing: ${ERA_PLATE}`);
  if (!existsSync(SUPERPATCH_LOGO)) throw new Error(`Logo missing: ${SUPERPATCH_LOGO}`);
  if (!existsSync(STYLE_PATH)) throw new Error(`Style preamble missing: ${STYLE_PATH}`);
  const preamble = readFileSync(STYLE_PATH, "utf8").trim();
  if (preamble !== STYLE_PREAMBLE) {
    throw new Error("STYLE-PREAMBLE.md must contain the approved preamble verbatim");
  }
  const env = loadEnvLocal();
  const apiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY / GOOGLE_API_KEY missing in .env.local");

  const { force, ids } = parseArgs(argv);
  mkdirSync(LEGS_DIR, { recursive: true });
  mkdirSync(POSTERS_DIR, { recursive: true });
  mkdirSync(RAW_DIR, { recursive: true });

  const results = [];
  for (let index = 0; index < CITY_OMNI_LEGS.length; index += 1) {
    const leg = CITY_OMNI_LEGS[index];
    if (ids.size && !ids.has(leg.id)) continue;

    const desktopPath = join(LEGS_DIR, `${leg.id}.mp4`);
    const mobilePath = join(LEGS_DIR, `${leg.id}-m.mp4`);
    const posterPath = join(POSTERS_DIR, `${leg.id}.webp`);
    const bridgePath = join(CHAIN_DIR, `${leg.id}.png`);
    const complete =
      existsSync(desktopPath) && existsSync(mobilePath) && existsSync(posterPath);

    if (!force && complete) {
      console.log(`SKIP ${leg.id} (encoded assets exist)`);
      extractLastEncodedFrame(desktopPath, bridgePath);
      results.push({ id: leg.id, ok: true, skipped: true, desktopPath });
      continue;
    }

    const referencePaths = referencePathsForLeg(index, leg);
    const missingRef = referencePaths.find((path) => !existsSync(path));
    if (missingRef) throw new Error(`Missing reference for ${leg.id}: ${missingRef}`);

    const firstFrame = referencePaths[0];
    if (index > 0) {
      const previousDesktop = join(LEGS_DIR, `${CITY_OMNI_LEGS[index - 1].id}.mp4`);
      if (!existsSync(previousDesktop)) {
        throw new Error(`Cannot generate ${leg.id}: missing encoded predecessor ${previousDesktop}`);
      }
      extractLastEncodedFrame(previousDesktop, firstFrame);
    }

    const rawPath = join(RAW_DIR, `${leg.id}.mp4`);
    console.log(
      `\n=== Gemini Omni ${leg.id} (${leg.clipSeconds}s final, ${referencePaths.length} refs) ===`,
    );
    try {
      const omni = await runOmni({
        apiKey,
        referencePaths,
        prompt: buildPrompt(leg, preamble, referencePaths),
        outputPath: rawPath,
      });
      const outputs = encodeLeg(leg, rawPath);
      extractLastEncodedFrame(outputs.desktopPath, bridgePath);
      results.push({
        id: leg.id,
        ok: true,
        ...outputs,
        referencePaths,
        interaction_id: omni.data?.interaction_id,
        cost_usd: omni.cost_usd,
        duration_seconds: omni.duration_seconds,
      });
      writeManifest(results);
      console.log(`OK ${leg.id}`);
    } catch (error) {
      results.push({ id: leg.id, ok: false, error: String(error.message || error) });
      writeManifest(results);
      throw error;
    }
  }

  writeManifest(results);
  console.log(
    `\nDone ok=${results.filter((result) => result.ok).length} cost~$${results
      .reduce((sum, result) => sum + (result.cost_usd || 0), 0)
      .toFixed(2)}`,
  );
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1] || "")) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
