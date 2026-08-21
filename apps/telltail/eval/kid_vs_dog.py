#!/usr/bin/env python3
"""Telltail scoped Phase 9 eval: one Lite cheap-model vision call, child vs dog.

Not an MVP. Not a bite-risk / K1 eval. One generateContent per still.
"""
from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIXTURES = ROOT / "fixtures"
DEFAULT_MODEL = "gemini-3.5-flash-lite"
ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

PROMPT = """You are the kids-in-frame safety gate for a dog-training app. Look at this still from a phone clip.

Decide ONLY whether a human CHILD is visible in the frame.

Definitions:
- CHILD: a human infant, toddler, child, or adolescent who is clearly not an adult. Include distant children if you can tell they are children.
- DOG: a dog is never a child.
- ADULT: an adult human (phone holder, walker, background adult, statue of an adult) is NOT a child. Adult-present is not a refuse.

Output JSON only, no markdown fences:
{
  "child_in_frame": true or false,
  "refuse": true or false,
  "refuse_reason": "kids-in-frame" or null,
  "visible": ["dog" and/or "child" and/or "adult" and/or "other"],
  "notes": "one short sentence of observable signals; no names; no identity"
}

Rules:
- refuse MUST equal child_in_frame
- If child_in_frame is true, refuse_reason is "kids-in-frame"; else null
- Do not identify anyone. Do not describe faces for identity. Purpose is child-present yes/no only.
- Do not comment on bite-risk, training, emotions, or whether anyone is safe.
"""

CASES = [
    {
        "id": "child-in-frame",
        "file": "child-in-frame.jpg",
        "expect_child": True,
        "expect_refuse": True,
        "label": "Child standing in a yard with a dog (AC-04.5)",
    },
    {
        "id": "dog-only",
        "file": "dog-only.jpg",
        "expect_child": False,
        "expect_refuse": False,
        "label": "Dog-only close portrait, no human (AC-04.5 negative)",
    },
    {
        "id": "adult-in-background",
        "file": "adult-in-background.jpg",
        "expect_child": False,
        "expect_refuse": False,
        "label": "Adult walking a dog; no child (AC-04.6)",
    },
]


def load_key() -> str:
    candidates = [
        Path(__file__).resolve().parents[2].parent / ".env.local",
        Path("/Users/cbsuperpatch/Desktop/ClaudeSkills/.env.local"),
    ]
    env_path = next((p for p in candidates if p.exists()), None)
    if env_path is not None:
        for line in env_path.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY=") or line.startswith("GOOGLE_API_KEY="):
                val = line.split("=", 1)[1].strip().strip('"').strip("'")
                if val:
                    os.environ.setdefault(line.split("=", 1)[0], val)
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not key:
        raise SystemExit("No GEMINI_API_KEY / GOOGLE_API_KEY")
    return key


def call_model(key: str, model: str, image_path: Path) -> dict:
    raw = image_path.read_bytes()
    b64 = base64.b64encode(raw).decode("ascii")
    mime = "image/jpeg"
    body = {
        "contents": [
            {
                "parts": [
                    {"text": PROMPT},
                    {"inline_data": {"mime_type": mime, "data": b64}},
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0,
            "responseMimeType": "application/json",
        },
    }
    url = ENDPOINT.format(model=model) + "?key=" + key
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            payload = json.load(resp)
            status = resp.status
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        return {
            "ok": False,
            "http_status": e.code,
            "error": err[:800],
            "latency_s": round(time.time() - t0, 3),
            "raw": None,
            "parsed": None,
        }
    latency = round(time.time() - t0, 3)
    text = ""
    try:
        text = payload["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError):
        return {
            "ok": False,
            "http_status": status,
            "error": "unexpected response shape",
            "latency_s": latency,
            "raw": payload,
            "parsed": None,
        }
    parsed = None
    parse_error = None
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError as e:
        parse_error = str(e)
    return {
        "ok": parsed is not None,
        "http_status": status,
        "error": parse_error,
        "latency_s": latency,
        "raw_text": text,
        "parsed": parsed,
        "usage": payload.get("usageMetadata"),
        "model_version": payload.get("modelVersion"),
    }


def score(case: dict, parsed: dict | None) -> dict:
    if not parsed:
        return {"right": False, "reason": "no_parse"}
    child = bool(parsed.get("child_in_frame"))
    refuse = bool(parsed.get("refuse"))
    expect_child = case["expect_child"]
    expect_refuse = case["expect_refuse"]
    child_ok = child is expect_child
    refuse_ok = refuse is expect_refuse
    refuse_matches_child = refuse is child
    right = child_ok and refuse_ok and refuse_matches_child
    return {
        "right": right,
        "child_ok": child_ok,
        "refuse_ok": refuse_ok,
        "refuse_matches_child": refuse_matches_child,
        "got_child": child,
        "got_refuse": refuse,
        "expect_child": expect_child,
        "expect_refuse": expect_refuse,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default=DEFAULT_MODEL)
    args = ap.parse_args()
    key = load_key()
    results = []
    for case in CASES:
        path = FIXTURES / case["file"]
        if not path.exists():
            results.append({**case, "ok": False, "error": f"missing {path}", "score": {"right": False}})
            continue
        print(f"CALL {case['id']} -> {args.model}", flush=True)
        out = call_model(key, args.model, path)
        sc = score(case, out.get("parsed"))
        row = {
            "id": case["id"],
            "file": case["file"],
            "label": case["label"],
            "model": args.model,
            "ok": out["ok"],
            "http_status": out.get("http_status"),
            "error": out.get("error"),
            "latency_s": out.get("latency_s"),
            "parsed": out.get("parsed"),
            "raw_text": out.get("raw_text"),
            "usage": out.get("usage"),
            "model_version": out.get("model_version"),
            "score": sc,
        }
        results.append(row)
        print(json.dumps({"id": case["id"], "ok": out["ok"], "score": sc, "parsed": out.get("parsed")}, indent=2))

    n = len(results)
    n_right = sum(1 for r in results if r.get("score", {}).get("right"))
    n_calls = sum(1 for r in results if r.get("http_status") == 200)
    summary = {
        "model": args.model,
        "n_fixtures": n,
        "n_live_calls": n_calls,
        "n_right": n_right,
        "n_wrong": n - n_right,
        "accuracy": (n_right / n) if n else None,
        "one_call_per_clip": True,
        "custom_detector": False,
    }
    report = {"summary": summary, "results": results}
    out_path = Path(__file__).with_name("results.json")
    out_path.write_text(json.dumps(report, indent=2))
    print("WROTE", out_path)
    print(json.dumps(summary, indent=2))
    return 0 if n_calls == n else 2


if __name__ == "__main__":
    sys.exit(main())
