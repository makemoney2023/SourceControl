#!/usr/bin/env python3
"""Generate carousel slide images from manifest.json via Google Gemini image API.

Usage:
    python generate.py                 # generate everything missing
    python generate.py --only w1d1-s02,w1d1-s03
    python generate.py --force --only w1d5-s26   # regenerate even if file exists
    python generate.py --dry-run
"""

import argparse
import json
import mimetypes
import os
import sys
import time
from pathlib import Path

HERE = Path(__file__).parent
REPO_ROOT = HERE.parent.parent.parent


def load_env():
    env_file = REPO_ROOT / ".env.local"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ.setdefault(key.strip(), value.strip().strip("\"'"))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", help="comma-separated item ids")
    parser.add_argument("--force", action="store_true", help="regenerate existing files")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    load_env()
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        sys.exit("No GEMINI_API_KEY / GOOGLE_API_KEY found in environment or .env.local")

    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)
    manifest = json.loads((HERE / "manifest.json").read_text())
    defaults = manifest["defaults"]
    realism_suffix = manifest["realism_suffix"]
    only = set(args.only.split(",")) if args.only else None

    results = {"ok": [], "skipped": [], "failed": []}
    for item in manifest["items"]:
        item_id = item["id"]
        if only and item_id not in only:
            continue
        out_path = HERE / item["out"]
        if out_path.exists() and not args.force:
            results["skipped"].append(item_id)
            continue

        prompt = item["prompt"]
        if item.get("people"):
            prompt = f"{prompt}\n\n{realism_suffix}"

        parts = []
        missing_ref = None
        for ref in item.get("refs", []):
            ref_path = HERE / ref
            if not ref_path.exists():
                missing_ref = ref
                break
            mime = mimetypes.guess_type(ref_path.name)[0] or "image/png"
            parts.append(types.Part.from_bytes(data=ref_path.read_bytes(), mime_type=mime))
        if missing_ref:
            print(f"[SKIP] {item_id}: missing ref {missing_ref} (generate anchors first)")
            results["skipped"].append(item_id)
            continue
        parts.append(prompt)

        if args.dry_run:
            print(f"[DRY] {item_id} -> {item['out']} (refs: {item.get('refs', [])})")
            continue

        config = types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"],
            image_config=types.ImageConfig(
                aspect_ratio=item.get("aspect_ratio", defaults["aspect_ratio"]),
                image_size=item.get("image_size", defaults["image_size"]),
            ),
        )
        model = item.get("model", defaults["model"])

        saved = False
        for attempt in (1, 2):
            try:
                resp = client.models.generate_content(model=model, contents=parts, config=config)
                for part in resp.candidates[0].content.parts:
                    if part.inline_data and part.inline_data.data:
                        out_path.parent.mkdir(parents=True, exist_ok=True)
                        out_path.write_bytes(part.inline_data.data)
                        print(f"[OK]   {item_id} -> {item['out']} ({len(part.inline_data.data)//1024} KB)")
                        saved = True
                        break
                if saved:
                    break
                print(f"[WARN] {item_id}: no image in response (attempt {attempt})")
            except Exception as exc:
                print(f"[ERR]  {item_id} attempt {attempt}: {exc}")
                if attempt == 1:
                    time.sleep(10)
        results["ok" if saved else "failed"].append(item_id)
        time.sleep(2)

    print(f"\nDone. ok={len(results['ok'])} skipped={len(results['skipped'])} failed={len(results['failed'])}")
    if results["failed"]:
        print("Failed:", ", ".join(results["failed"]))
        sys.exit(1)


if __name__ == "__main__":
    main()
