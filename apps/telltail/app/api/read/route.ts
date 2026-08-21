import { NextResponse } from "next/server";
import { z } from "zod";
import { callGeminiVision } from "@/lib/vision/gemini";

export const runtime = "nodejs";

const readRequestSchema = z.object({
  imageDataUrl: z.string().min(20),
  contextText: z.string().max(4000).optional(),
  chips: z.array(z.string()).max(6).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = readRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const outcome = await callGeminiVision(parsed.data);
  if (!outcome.ok) {
    const status = outcome.error.includes("not configured") ? 503 : 502;
    return NextResponse.json({ error: outcome.error }, { status });
  }

  return NextResponse.json({
    model: "gemini-3.5-flash-lite",
    one_call_per_read: true,
    plus_stubbed: true,
    result: outcome.result,
  });
}
