import { readFileSync } from "node:fs";

export type EmailHtmlLintResult = {
  ok: boolean;
  errors: string[];
};

/** File-based email HTML checks (no network). */
export function lintEmailHtml(html: string): EmailHtmlLintResult {
  const errors: string[] = [];
  const lower = html.toLowerCase();

  if (/<script[\s>]/i.test(html)) {
    errors.push("script_tag");
  }
  if (!/max-width\s*:\s*600px/i.test(html) && !/width\s*=\s*["']?600/i.test(html)) {
    errors.push("max_width_600");
  }
  if (!/<a\b[^>]*\bhref\s*=/i.test(html)) {
    errors.push("cta_href");
  }
  const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
  for (const tag of imgTags) {
    if (!/\balt\s*=/i.test(tag)) {
      errors.push("img_alt");
      break;
    }
  }
  if (imgTags.length === 0 && !lower.includes("alt=")) {
    // text-only emails are ok without imgs
  }

  return { ok: errors.length === 0, errors };
}

export function lintEmailHtmlFile(absPath: string): EmailHtmlLintResult {
  return lintEmailHtml(readFileSync(absPath, "utf8"));
}

export function isEmailHtmlPath(rel: string): boolean {
  return /email\/html\/.+\.html$/i.test(rel.replace(/\\/g, "/"));
}

export function isImageAssetPath(rel: string): boolean {
  const n = rel.replace(/\\/g, "/").toLowerCase();
  if (!/\.(png|jpe?g|webp|gif)$/i.test(n)) return false;
  return (
    n.includes("/11-brand/assets/") ||
    n.includes("/14-pages/assets/") ||
    n.includes("/email/assets/") ||
    n.includes("/social/assets/") ||
    n.includes("/19-paid/creatives/")
  );
}
