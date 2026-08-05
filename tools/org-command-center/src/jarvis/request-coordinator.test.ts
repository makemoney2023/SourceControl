import { describe, expect, it } from "vitest";
import { ManualActivityCounter, RequestSequence } from "./request-coordinator";

describe("RequestSequence", () => {
  it("accepts only the newest request while mounted", () => {
    const sequence = new RequestSequence();
    const first = sequence.begin();
    const second = sequence.begin();
    expect(sequence.isCurrent(first)).toBe(false);
    expect(sequence.isCurrent(second)).toBe(true);
    sequence.unmount();
    expect(sequence.isCurrent(second)).toBe(false);
  });

  it("refuses to begin work after unmount", () => {
    const sequence = new RequestSequence();
    sequence.unmount();
    expect(sequence.beginIfMounted()).toBeNull();
  });

  it("prevents a slower earlier seat response from overwriting the latest selection", async () => {
    const sequence = new RequestSequence();
    let resolveEarlier!: (value: string) => void;
    let resolveLatest!: (value: string) => void;
    const earlier = new Promise<string>((resolve) => {
      resolveEarlier = resolve;
    });
    const latest = new Promise<string>((resolve) => {
      resolveLatest = resolve;
    });
    const published: string[] = [];

    const earlierRequest = sequence.publishLatest(earlier, (value) => published.push(value));
    const latestRequest = sequence.publishLatest(latest, (value) => published.push(value));
    resolveLatest("cto");
    await latestRequest;
    resolveEarlier("head-of-research");
    await earlierRequest;

    expect(published).toEqual(["cto"]);
  });
});

describe("ManualActivityCounter", () => {
  it("does not clear refreshing until all manual requests finish", () => {
    const counter = new ManualActivityCounter();
    counter.begin();
    counter.begin();
    expect(counter.active).toBe(true);
    counter.end();
    expect(counter.active).toBe(true);
    counter.end();
    expect(counter.active).toBe(false);
  });

  it("never publishes manual completion after unmount", () => {
    const sequence = new RequestSequence();
    const request = sequence.begin();
    const counter = new ManualActivityCounter();
    counter.begin();
    sequence.unmount();
    expect(request).toBeGreaterThan(0);
    expect(counter.endAndShouldPublish(sequence)).toBe(false);
    expect(counter.active).toBe(false);
  });
});
