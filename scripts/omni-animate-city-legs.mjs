#!/usr/bin/env node
/**
 * Generate the ten continuous city-flight legs with Gemini Omni.
 *
 * Usage:
 *   node scripts/omni-animate-city-legs.mjs
 *   node scripts/omni-animate-city-legs.mjs leg-07-skyline-lock --force
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
const OPENMONTAGE = join(REPO, "skills/community/openmontage");
const PY =
  process.env.OMNI_PYTHON ||
  "/Users/cbsuperpatch/Desktop/Superpatch_Context/content-studio/superpatch-backend/venv/bin/python";

export const STYLE_PREAMBLE =
  "Neon night city, terrace and street level, cyan/magenta/amber signage glow, wet asphalt reflections, empty product-free dark glass storefronts and windows, no people, no readable signage, no logos, photographic, anamorphic, night.";

export const CITY_OMNI_LEGS = [
  {
    id: "leg-01-terrace",
    clipSeconds: 5,
    move: "Begin on an elevated terrace and push steadily forward toward the luminous city, preserving a grounded eye-level camera and continuous forward momentum.",
  },
  {
    id: "leg-02-title-glass",
    clipSeconds: 5,
    move: "Continue the same forward camera move beside a monumental dark glass facade, with reflections sliding naturally across the glass as the camera passes.",
  },
  {
    id: "leg-03-overlook",
    clipSeconds: 5,
    move: "Glide beyond the glass into a broad city overlook, gently revealing greater depth while maintaining the same direction, speed, lens, and photographic world.",
  },
  {
    id: "leg-04-street",
    clipSeconds: 5,
    move: "Descend smoothly from the overlook toward street level, following the avenue forward through reflected neon light with stable cinematic motion.",
  },
  {
    id: "leg-05-windows",
    clipSeconds: 5,
    move: "Skim forward along tall dark storefront windows at street level, letting cyan, magenta, and amber reflections travel across the glass without revealing interiors.",
  },
  {
    id: "leg-06-ascent",
    clipSeconds: 5,
    move: "Rise smoothly above the street between dark glass towers, continuing forward as the skyline opens and the camera gains altitude.",
  },
  {
    id: "leg-07-skyline-lock",
    clipSeconds: 10,
    move: "Ascend rapidly in the first second above every nearby rooftop into an open aerial skyline, then settle into a majestic ultra-wide lock-off with very slow forward drift and immense city depth.",
  },
  {
    id: "leg-08-districts-a",
    clipSeconds: 5,
    move: "Resume a gentle forward bank across distinct illuminated city districts below, preserving the skyline scale and seamless night-flight direction.",
  },
  {
    id: "leg-09-districts-b",
    clipSeconds: 5,
    move: "Continue across architecture-only districts with a subtle upward lift, every luminous panel showing blank abstract color, revealing more avenues and terraces while maintaining continuous camera geography.",
  },
  {
    id: "leg-10-hold",
    clipSeconds: 5,
    move: "Rise rapidly in the first second and turn toward the distant skyline, then hold a calm high aerial overlook where all visible facades are dark unbroken reflective glass and warm window grids, with plain unmarked surfaces and restrained atmospheric drift.",
  },
];

export function buildPrompt(leg, preamble = STYLE_PREAMBLE) {
  return `${preamble} ${leg.move}`;
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
  // Omni supplies eight seconds. The skyline peak deliberately slows that
  // motion to ten seconds so the longest leg remains a moving cinematic hold.
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

function runOmni({ apiKey, firstFrame, prompt, outputPath }) {
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
    "reference_image_paths": [${JSON.stringify(firstFrame)}],
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

function parseArgs(argv) {
  const ids = argv.filter((arg) => !arg.startsWith("--"));
  const unknown = ids.filter((id) => !CITY_OMNI_LEGS.some((leg) => leg.id === id));
  if (unknown.length) throw new Error(`Unknown leg id(s): ${unknown.join(", ")}`);
  return { force: argv.includes("--force"), ids: new Set(ids) };
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

    const firstFrame = startFramePath(index);
    if (index > 0) {
      const previousDesktop = join(LEGS_DIR, `${CITY_OMNI_LEGS[index - 1].id}.mp4`);
      if (!existsSync(previousDesktop)) {
        throw new Error(`Cannot generate ${leg.id}: missing encoded predecessor ${previousDesktop}`);
      }
      extractLastEncodedFrame(previousDesktop, firstFrame);
    }

    const rawPath = join(RAW_DIR, `${leg.id}.mp4`);
    console.log(`\n=== Gemini Omni ${leg.id} (${leg.clipSeconds}s final) ===`);
    try {
      const omni = await runOmni({
        apiKey,
        firstFrame,
        prompt: buildPrompt(leg, preamble),
        outputPath: rawPath,
      });
      const outputs = encodeLeg(leg, rawPath);
      extractLastEncodedFrame(outputs.desktopPath, bridgePath);
      results.push({
        id: leg.id,
        ok: true,
        ...outputs,
        firstFrame,
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
