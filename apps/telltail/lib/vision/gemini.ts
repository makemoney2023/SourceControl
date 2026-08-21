import { VISION_MODEL } from "@/lib/types";
import {
  buildUserContext,
  postProcessVision,
  VISION_SYSTEM_PROMPT,
} from "@/lib/vision/prompt";
import { visionResponseSchema } from "@/lib/vision/gate";

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${VISION_MODEL}:generateContent`;

function loadApiKey(): string | null {
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? null;
}

function parseDataUrl(dataUrl: string): { mimeType: string; data: string } | null {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

export async function callGeminiVision(params: {
  imageDataUrl: string;
  contextText?: string;
  chips?: string[];
}): Promise<{ ok: true; result: ReturnType<typeof postProcessVision> } | { ok: false; error: string }> {
  const key = loadApiKey();
  if (!key) {
    return { ok: false, error: "GEMINI_API_KEY not configured" };
  }

  const image = parseDataUrl(params.imageDataUrl);
  if (!image) {
    return { ok: false, error: "Invalid image data URL" };
  }

  const contextBlock = buildUserContext(params.contextText, params.chips);
  const prompt = contextBlock
    ? `${VISION_SYSTEM_PROMPT}\n\n${contextBlock}`
    : VISION_SYSTEM_PROMPT;

  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          { inline_data: { mime_type: image.mimeType, data: image.data } },
        ],
      },
    ],
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json",
    },
  };

  const url = `${ENDPOINT}?key=${key}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    return { ok: false, error: `Gemini HTTP ${response.status}: ${errText.slice(0, 400)}` };
  }

  const payload = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return { ok: false, error: "Unexpected Gemini response shape" };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "Failed to parse Gemini JSON" };
  }

  const validated = visionResponseSchema.safeParse(parsed);
  if (!validated.success) {
    return { ok: false, error: `Schema validation failed: ${validated.error.message}` };
  }

  return { ok: true, result: postProcessVision(validated.data) };
}
