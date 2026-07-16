import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { JarvisIntent, JarvisMode } from "../intents";
import { policyFor } from "../policy";
import { heuristicIntent } from "./heuristic-intent";

type GoldenCase = {
  utterance: string;
  expectIntent: JarvisIntent;
  mode: JarvisMode;
  expectNeedsConfirm?: boolean;
  expectAllowed?: boolean;
};

const goldenPath = join(dirname(fileURLToPath(import.meta.url)), "golden.json");
const golden = JSON.parse(readFileSync(goldenPath, "utf8")) as GoldenCase[];

describe("golden transcript eval (heuristic + policy)", () => {
  expect(golden.length).toBeGreaterThanOrEqual(20);

  it.each(golden.map((c, i) => [i + 1, c.utterance, c] as const))(
    "case %i: %s",
    (_index, _utterance, c) => {
      expect(heuristicIntent(c.utterance)).toBe(c.expectIntent);

      const policy = policyFor(c.expectIntent, c.mode);
      if (c.expectNeedsConfirm !== undefined) {
        expect(policy.needsConfirm).toBe(c.expectNeedsConfirm);
      }
      if (c.expectAllowed !== undefined) {
        expect(policy.allowed).toBe(c.expectAllowed);
      }
    },
  );
});
